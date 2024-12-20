import { CachedGitJson } from './CachedGitJson';
import { MULTICHAIN_ENDPOINTS } from '../../constants';
import { AmmConfig, ZapConfig, OneInchZapConfig, ZapConfigsByType } from './types';
import {
  areTokensEqual,
  getTokenById,
  getTokenWrappedNative,
  initTokenService,
  nativeToWrapped,
} from '../tokens/tokens';
import { getAmmAllPrices } from '../stats/getAmmPrices';
import { serviceEventBus } from '../../utils/ServiceEventBus';
import { ApiChain, AppChain, toAppChain } from '../../utils/chain';
import { getMultichainVaults, getSingleChainVaults } from '../stats/getMultichainVaults';
import { Vault, isValidZapCategory } from '../vaults/types';
import { isFiniteNumber } from '../../utils/number';
import BigNumber from 'bignumber.js';
import { getOneInchPriceApi, getOneInchSwapApi } from './one-inch';
import { BIG_ONE, BIG_ZERO, isFiniteBigNumber, toWeiString } from '../../utils/big-number';
import { IOneInchPriceApi, IOneInchSwapApi } from './one-inch/types';
import { errorToString } from '../../utils/error';
import { keyBy, sortBy, uniq } from 'lodash';
import { isResultFulfilled, isResultRejected } from '../../utils/promise';
import { getKey, setKey } from '../../utils/cache';
import { TokenEntity, TokenErc20 } from '../tokens/types';
import { convertFromChainTemplate } from '../../utils/templates';
import { isLocalPath } from '../../utils/fetch';

const GH_ORG = 'RedDuck-Software';
const GH_REPO = 'cubera-contracts';
const GH_BRANCH = 'staging';
const DEBUG = false;
const REDIS_KEY = 'ZAP_SUPPORT';
const INIT_DELAY = Number(process.env.ZAP_INIT_DELAY || 0);

const ammConfigChains: ReadonlyArray<ApiChain> = Object.keys(
  MULTICHAIN_ENDPOINTS
) as (keyof typeof MULTICHAIN_ENDPOINTS)[];

let zapsConfigByType: ZapConfigsByType | undefined;
let ammConfigsByChain: Record<string, CachedGitJson<AmmConfig[]>> | undefined;
let zapSupportByVault: Record<string, ZapSupport> = {};
let zapsSupportedByVault: Record<string, string[]> = {};

const ZAP_CUBERA_LOCAL_PATH = process.env.ZAP_CUBERA_LOCAL_PATH;
const ZAP_1INCH_LOCAL_PATH = process.env.ZAP_1INCH_LOCAL_PATH;
// should be in format: /path/to/file/{chain}.json
const ZAP_AMM_TEMPLATE_LOCAL_PATH = process.env.ZAP_AMM_TEMPLATE_LOCAL_PATH;
const VALIDATE_VAULT_ZAP_ID = (process.env.VALIDATE_VAULT_ZAP_ID ?? 'true') == 'true';

async function initZapConfigs() {
  zapsConfigByType = {
    cubera: await CachedGitJson.create<ZapConfig[]>({
      isCustomPath: !!ZAP_CUBERA_LOCAL_PATH,
      org: GH_ORG,
      repo: GH_REPO,
      branch: GH_BRANCH,
      path: ZAP_CUBERA_LOCAL_PATH ?? `configs/zap/cubera.json`,
      updateOnInterval: 60 * 60, // 1 hour
      updateOnStart: true,
      debug: DEBUG,
    }),
    oneInch: await CachedGitJson.create<OneInchZapConfig[]>({
      isCustomPath: !!ZAP_1INCH_LOCAL_PATH,
      org: GH_ORG,
      repo: GH_REPO,
      branch: GH_BRANCH,
      path: ZAP_1INCH_LOCAL_PATH ?? `configs/zap/one-inch.json`,
      updateOnInterval: 60 * 60, // 1 hour
      updateOnStart: true,
      debug: DEBUG,
    }),
  };
}

async function initAmmConfigs() {
  ammConfigsByChain = Object.fromEntries(
    await Promise.all(
      ammConfigChains.map(async chain => {
        const path = convertFromChainTemplate(
          ZAP_AMM_TEMPLATE_LOCAL_PATH ?? 'configs/amm/{chain}.json',
          toAppChain(chain)
        );

        const ammConfig = await CachedGitJson.create<AmmConfig[]>({
          isCustomPath: !!ZAP_AMM_TEMPLATE_LOCAL_PATH,
          org: GH_ORG,
          repo: GH_REPO,
          branch: GH_BRANCH,
          path,
          updateOnInterval: 60 * 60, // 1 hour
          updateOnStart: true,
          debug: DEBUG,
        });

        return [chain, ammConfig] as const;
      })
    )
  );
}

export async function getZapsConfigs() {
  try {
    return zapsConfigByType.oneInch.value;
  } catch (err) {
    return undefined;
  }
}

export async function initZapService() {
  // Load
  await loadFromRedis();

  // Setup
  await Promise.all([initZapConfigs(), initAmmConfigs()]);

  // Update
  setTimeout(performUpdate, INIT_DELAY);
}

async function waitForConfigs() {
  return Promise.all([
    ...Object.values(ammConfigsByChain).map(config => config.waitForAvailable()),
    ...Object.values(zapsConfigByType).map(config => config.waitForAvailable()),
  ]);
}

async function waitForDependencies() {
  return Promise.all([
    waitForConfigs(),
    serviceEventBus.waitForFirstEvent('vaults/updated'),
    serviceEventBus.waitForFirstEvent('boosts/updated'),
    serviceEventBus.waitForFirstEvent('tokens/updated'),
    getAmmAllPrices(),
  ]);
}

type ZapSupport = {
  vaultId: string;
  chainId: AppChain;
  oneInch: {
    supported: boolean;
    unsupportedReason?: string;
  };
};

type ZapDisabled = { id: string; supported: false; unsupportedReason: string };
type ZapEnabled = { id: string; supported: true };
type ZapStatus = ZapDisabled | ZapEnabled;

function checkAssetTokens(
  assets: string[],
  apiChain: ApiChain
): { tokens: TokenEntity[]; missingAssets: string[] } {
  const tokens = assets.map(asset => getTokenById(asset, apiChain));
  const missingAssets = assets.filter((asset, i) => !tokens[i]);
  return { tokens, missingAssets };
}

function markTokenUnsupported(
  tokenAddress: string,
  reason: string,
  tokenAddressToVaults: Record<string, Vault[]>,
  tokenAddressToToken: Record<string, TokenErc20>,
  resultsById: Record<string, ZapStatus>
) {
  const vaultsToMark = tokenAddressToVaults[tokenAddress];
  if (!vaultsToMark || !vaultsToMark.length) {
    // console.warn(`markTokenUnsupported: No vaults found for token ${tokenAddress}: ${reason}`);
    return;
  }

  // Do not perform further tests on this token
  delete tokenAddressToVaults[tokenAddress];
  delete tokenAddressToToken[tokenAddress];

  // Mark all vaults using this token as unsupported
  for (const vault of vaultsToMark) {
    if (!(vault.id in resultsById)) {
      resultsById[vault.id] = {
        id: vault.id,
        supported: false,
        unsupportedReason: reason,
      };
    }
  }

  // For each vault removed
  for (const vault of vaultsToMark) {
    // Find this vault under other tokens
    for (const [address, vaults] of Object.entries(tokenAddressToVaults)) {
      // Remove this vault from that list
      tokenAddressToVaults[address] = vaults.filter(v => v.id !== vault.id);
      // If list is empty, we no longer need to test this token either
      if (tokenAddressToVaults[address].length === 0) {
        delete tokenAddressToVaults[address];
        delete tokenAddressToToken[address];
      }
    }
  }
}

async function checkOneInch(
  vaults: Vault[],
  apiChain: ApiChain,
  appChain: AppChain
): Promise<ZapStatus[]> {
  const oneInchZap = zapsConfigByType.oneInch.value.find(zap => zap.chainId === appChain);
  if (!oneInchZap) {
    return vaults.map(vault => ({
      id: vault.id,
      supported: false,
      unsupportedReason: 'No 1inch zap for chain',
    }));
  }

  const tokenAddressToVaults: Record<string, Vault[]> = {};
  const tokenAddressToToken: Record<string, TokenErc20> = {};

  const resultsById: Record<string, ZapStatus> = Object.fromEntries(
    vaults
      .map(vault => {
        if (oneInchZap.blockedVaults.includes(vault.id)) {
          return { id: vault.id, supported: false, unsupportedReason: 'Vault is manually blocked' };
        }

        if (!vault.assets?.length) {
          return {
            id: vault.id,
            supported: false,
            unsupportedReason: 'Vault assets are not specified',
          };
        }

        if (VALIDATE_VAULT_ZAP_ID) {
          if (!vault.zapCategory || !isValidZapCategory(vault.zapCategory)) {
            return {
              id: vault.id,
              supported: false,
              unsupportedReason: 'Invalid zapCategory specified',
            };
          }
          if (vault.zapId === undefined) {
            return {
              id: vault.id,
              supported: false,
              unsupportedReason: 'Invalid zapId specified',
            };
          }
        }

        const { tokens, missingAssets } = checkAssetTokens(vault.assets, apiChain);
        if (missingAssets.length) {
          return {
            id: vault.id,
            supported: false,
            unsupportedReason: `Missing token in assets: ${missingAssets.join(', ')}`,
          };
        }

        // internally we only swap wnative, not native
        const lpTokens = tokens.map(nativeToWrapped);
        for (const token of lpTokens) {
          if (!tokenAddressToVaults[token.address]) {
            tokenAddressToVaults[token.address] = [];
          }
          tokenAddressToVaults[token.address].push(vault);
          tokenAddressToToken[token.address] = token;
        }
      })
      .filter(r => !!r)
      .map(r => [r.id, r])
  );

  // No more to check
  if (!Object.keys(tokenAddressToVaults).length) {
    return Object.values(resultsById);
  }

  // Token: 1inch prices
  const wnative = getTokenWrappedNative(apiChain);
  const oneInchPriceApi = getOneInchPriceApi(apiChain, oneInchZap.priceOracleAddress);
  const oneInchNativePriceByAddress = await getOneInchPricesInNative(
    oneInchPriceApi,
    Object.values(tokenAddressToToken),
    wnative
  );
  for (const [tokenAddress, token] of Object.entries(tokenAddressToToken)) {
    const price = oneInchNativePriceByAddress[tokenAddress];

    // No price: stop checking this token/vaults with this token
    if (token.oracleId !== 'BIFI' && (!isFiniteBigNumber(price) || price.lte(BIG_ZERO))) {
      markTokenUnsupported(
        tokenAddress,
        `No 1inch price available for token ${token.id} with address ${token.address}`,
        tokenAddressToVaults,
        tokenAddressToToken,
        resultsById
      );
    }
  }

  // No more to check
  if (!Object.keys(tokenAddressToVaults).length) {
    return Object.values(resultsById);
  }

  // Vault: Manual token blocks
  // We wait until here to apply manual token blocks so that we can see if auto-block would catch it or not
  for (const vaults of Object.values(tokenAddressToVaults)) {
    for (const vault of vaults) {
      const blockedAssets = vault.assets.filter(asset => oneInchZap.blockedTokens.includes(asset));
      if (blockedAssets.length && !(vault.id in resultsById)) {
        resultsById[vault.id] = {
          id: vault.id,
          supported: false,
          unsupportedReason: `Token is manually blocked: ${blockedAssets.join(', ')}`,
        };
      }
    }
  }

  // Anything left is supported
  for (const vaults of Object.values(tokenAddressToVaults)) {
    for (const vault of vaults) {
      if (!(vault.id in resultsById)) {
        resultsById[vault.id] = {
          id: vault.id,
          supported: true,
        };
      }
    }
  }

  return Object.values(resultsById);
}

async function getCanSwapOnOneInch(
  api: IOneInchSwapApi,
  tokens: TokenErc20[],
  wnative: TokenErc20,
  amount: BigNumber
): Promise<Record<string, true | string>> {
  const amountInWei = toWeiString(amount, wnative.decimals);
  const tokensExcludingWnative = tokens.filter(t => !areTokensEqual(t, wnative));

  // Don't quote wnative:wnative
  const calls = tokensExcludingWnative.map(token =>
    api.getQuote({
      fromTokenAddress: token.address,
      toTokenAddress: wnative.address,
      amount: amountInWei,
    })
  );
  const results = await Promise.allSettled(calls);

  // Return a map of token address to true if it can be swapped, or error string if not
  // wnative is always swappable
  return results.reduce(
    (canSwap, result, i) => {
      if (result.status === 'fulfilled') {
        canSwap[tokensExcludingWnative[i].address] = true;
      } else {
        canSwap[tokensExcludingWnative[i].address] = errorToString(result.reason);
      }

      return canSwap;
    },
    { [wnative.address]: true } as Record<string, true | string>
  );
}

async function getOneInchPricesInNative(
  api: IOneInchPriceApi,
  tokens: TokenErc20[],
  wnative: TokenErc20
): Promise<Record<string, BigNumber>> {
  // Don't quote wnative
  const tokensExcludingWnative = tokens.filter(t => !areTokensEqual(t, wnative));
  const tokenAddresses = tokensExcludingWnative.map(t => t.address);
  const ratesByAddress = await api.getRatesToNative(tokenAddresses);

  return tokensExcludingWnative.reduce(
    (prices, token) => {
      const rate = ratesByAddress[token.address];
      if (!rate || rate.isZero()) {
        return prices;
      }

      prices[token.address] = rate
        .shiftedBy(-wnative.decimals)
        .decimalPlaces(wnative.decimals, BigNumber.ROUND_FLOOR)
        .shiftedBy(token.decimals)
        .decimalPlaces(0, BigNumber.ROUND_FLOOR)
        .shiftedBy(-wnative.decimals);

      return prices;
    },
    { [wnative.address]: BIG_ONE } as Record<string, BigNumber>
  );
}

async function fetchVaultZapSupportForChain(apiChain: ApiChain): Promise<ZapSupport[]> {
  const appChain = toAppChain(apiChain);

  const vaults = getSingleChainVaults(apiChain);
  if (!vaults || !vaults.length) {
    return [];
  }

  const supportById: Record<string, ZapSupport> = Object.fromEntries(
    vaults.map(vault => {
      return [
        vault.id,
        {
          vaultId: vault.id,
          chainId: vault.network,
          oneInch: {
            supported: false,
            unsupportedReason: 'Not checked',
          },
        },
      ];
    })
  );

  const [oneInchResults] = await Promise.all([checkOneInch(vaults, apiChain, appChain)]);

  const resultsByType = {
    oneInch: oneInchResults,
  };

  for (const [type, results] of Object.entries(resultsByType)) {
    results.forEach(result => {
      if (result.id in supportById) {
        supportById[result.id][type].supported = result.supported;
        if (result.supported === true) {
          delete supportById[result.id][type].unsupportedReason;
        } else {
          supportById[result.id][type].unsupportedReason = result.unsupportedReason;
        }
      }
    });
  }

  return Object.values(supportById);
}

function scheduleUpdate() {
  // Schedule next update for when vaults or prices change
  Promise.race([
    serviceEventBus.waitForNextEvent('prices/updated'),
    serviceEventBus.waitForNextEvent('vaults/updated'),
  ]).then(performUpdate);
}

async function performUpdate() {
  console.log('> Updating zap service...');
  try {
    const start = Date.now();

    // Wait for all data to be ready
    await waitForDependencies();

    // Update all chains
    const chainsWithVaults = uniq(getMultichainVaults().map(vault => vault.chain));
    const results = await Promise.allSettled(chainsWithVaults.map(fetchVaultZapSupportForChain));

    const fulfilled = results.filter(isResultFulfilled);

    if (fulfilled.length) {
      const allResults = sortBy(
        fulfilled.flatMap(result => result.value),
        'vaultId'
      );
      zapSupportByVault = keyBy(allResults, 'vaultId');
      buildFromByVault();
      await saveToRedis();
    }

    console.log(
      `> Zap availability for ${fulfilled.length}/${results.length} chains updated (${
        (Date.now() - start) / 1000
      }s)`
    );

    if (fulfilled.length < results.length) {
      const rejected = results.filter(isResultRejected);
      console.error(` - ${rejected.length} chains failed to update:`);
      rejected.forEach(result => console.error(`  - ${result.reason}`));
    }
  } catch (err) {
    console.error(`> Zap service update failed`, err);
  } finally {
    scheduleUpdate();
  }
}

function buildFromByVault() {
  const anySupported = Object.values(zapSupportByVault).filter(result => result.oneInch.supported);
  zapsSupportedByVault = Object.fromEntries(
    anySupported.map(result => [result.vaultId, ['oneInch'].filter(type => result[type].supported)])
  );
}

async function loadFromRedis() {
  const cachedSupport = await getKey<typeof zapSupportByVault>(REDIS_KEY);

  if (cachedSupport && typeof cachedSupport === 'object') {
    zapSupportByVault = cachedSupport;
    buildFromByVault();
  }
}

async function saveToRedis() {
  await setKey(REDIS_KEY, zapSupportByVault);
}

export function getZapSupportByVault(): Record<string, string[]> | undefined {
  return zapsSupportedByVault;
}

export function getZapSupportByVaultDebug(): Record<string, ZapSupport> | undefined {
  return zapSupportByVault;
}
