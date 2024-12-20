import { addressBook } from '../../../packages/address-book/address-book';

const configsByChain: Record<string, Config> = {};

interface Config {
  devMultisig: string;
  treasuryMultisig: string;
  strategyOwner: string;
  vaultOwner: string;
  keeper: string;
  treasurer: string;
  launchpoolOwner: string;
  rewardPool: string;
  treasury: string;
  feeRecipient: string;
  bifiMaxiStrategy: string;
  voter: string;
  feeConfig: string;
  multicallManager: string;

  earnPriceAggregator: string;
  earnConfiguration: string;
  earnGelatoChecker: string;
  earnFactory: string;
  earnBeacon: string;
  earnHelper: string;

  ac: string;
  wNative: string;
  gelatoAutomate: string;
  oneInchRouter: string;
  uniswapV3Quoter: string;
}

export const initConfigService = () => {
  Object.keys(addressBook).forEach(chain => {
    const config = addressBook[chain].platforms.cubera;
    // Prune ab fields
    configsByChain[chain] = {
      devMultisig: config.devMultisig,
      treasuryMultisig: config.treasuryMultisig,
      strategyOwner: config.strategyOwner,
      vaultOwner: config.vaultOwner,
      keeper: config.keeper,
      treasurer: config.treasurer,
      launchpoolOwner: config.launchpoolOwner,
      rewardPool: config.rewardPool,
      treasury: config.treasury,
      feeRecipient: config.feeRecipient,
      bifiMaxiStrategy: config.bifiMaxiStrategy,
      voter: config.voter,
      feeConfig: config.feeConfig,
      multicallManager: config.multicallManager,

      earnPriceAggregator: config.earnPriceAggregator,
      earnConfiguration: config.earnConfiguration,
      earnGelatoChecker: config.earnGelatoChecker,
      earnFactory: config.earnFactory,
      earnBeacon: config.earnBeacon,
      earnHelper: config.earnHelper,

      ac: config.ac,
      wNative: config.wNative,
      gelatoAutomate: config.gelatoAutomate,
      oneInchRouter: config.oneInchRouter,
      uniswapV3Quoter: config.uniswapV3Quoter,
    };
  });

  console.log('> Configs initialized');
};

export const getAllConfigs = () => {
  return configsByChain;
};

export const getSingleChainConfig = (chain: string) => {
  return configsByChain[chain] ?? {};
};
