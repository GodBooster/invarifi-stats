import BigNumber from 'bignumber.js';

import { getFarmWithTradingFeesApy } from '../../../utils/getFarmWithTradingFeesApy';
import { compound } from '../../../utils/compound';

import { BASE_HPY } from '../../../constants';
import { getTotalPerformanceFeeForVault } from '../../vaults/getVaultFees';

export interface ApyBreakdown {
  vaultApr?: number;
  compoundingsPerYear?: number;
  performanceFee?: number;
  vaultApy?: number;
  lpFee?: number;
  tradingApr?: number;
  totalApy?: number;
  liquidStakingApr?: number;
  composablePoolApr?: number;
}

export interface ApyBreakdownResult {
  apys: Record<string, number>;
  apyBreakdowns: Record<string, ApyBreakdown>;
}

export const getApyBreakdown = (
  pools: { name: string; address: string; batcherFee?: number }[],
  tradingAprs: Record<string, BigNumber> | undefined,
  farmAprs: BigNumber[],
  providerFee?: number | BigNumber[],
  liquidStakingAprs?: number[],
  composablePoolAprs?: number[]
): ApyBreakdownResult => {
  const result: ApyBreakdownResult = {
    apys: {},
    apyBreakdowns: {},
  };

  if (providerFee === undefined) {
    providerFee = 0;
  }

  pools.forEach((pool, i) => {
    const liquidStakingApr: number | undefined = liquidStakingAprs
      ? liquidStakingAprs[i]
      : undefined;

    const composablePoolApr: number | undefined = composablePoolAprs
      ? composablePoolAprs[i]
      : undefined;

    const extraApr =
      liquidStakingAprs && composablePoolAprs
        ? liquidStakingApr + composablePoolApr
        : liquidStakingAprs
        ? liquidStakingApr
        : composablePoolAprs
        ? composablePoolApr
        : 0;

    const provFee = providerFee[i] == undefined ? providerFee : providerFee[i].toNumber();
    const simpleApr = farmAprs[i]?.toNumber();
    const performanceFee = getTotalPerformanceFeeForVault(pool.name);
    const shareAfterPerformanceFee = 1 - performanceFee;
    const vaultApr = simpleApr * shareAfterPerformanceFee;
    let vaultApy = compound(simpleApr, BASE_HPY, 1, shareAfterPerformanceFee);

    let tradingApr: number | undefined = 0;
    if (tradingAprs != null) {
      tradingApr = (
        (tradingAprs[pool.address.toLowerCase()] ?? new BigNumber(0)).isFinite()
          ? tradingAprs[pool.address.toLowerCase()]
          : new BigNumber(0)
      )?.toNumber();
    }

    const totalApy =
      getFarmWithTradingFeesApy(simpleApr, tradingApr, BASE_HPY, 1, shareAfterPerformanceFee) +
      extraApr;

    // Add token to APYs object
    result.apys[pool.name] = totalApy;
    result.apyBreakdowns[pool.name] = {
      vaultApr: vaultApr,
      compoundingsPerYear: BASE_HPY,
      performanceFee: performanceFee,
      vaultApy: vaultApy,
      lpFee: provFee,
      tradingApr: tradingApr,
      liquidStakingApr: liquidStakingApr,
      composablePoolApr: composablePoolApr,
      totalApy: totalApy,
    };
  });

  return result;
};

export default getApyBreakdown;
