import BigNumber from 'bignumber.js';
import { ApiChain, AppChain } from '../../utils/chain';

export enum ZapTypeCommon {
  SINGLE = 0,
  SINGLE_GOV,
  UNISWAP_V2_LP,
  SOLIDLY_STABLE_LP,
  SOLIDLY_VOLATILE_LP,
  STARGATE,
}

export enum ZapTypeBalancerAuraEth {
  BALANCER_AURA = 0,
  BALANCER_AURA_MULTI_REWARD,
  BALANCER_AURA_GYRO,
}

export enum ZapTypeCurveConvex {
  CONVEX = 0,
  CURVE_CONVEX,
}

export enum ZapTypeRetroGamma {
  RETRO_GAMMA = 0,
}

export enum ZapTypeHop {
  HOP = 0,
}

export enum ZapTypeCurveOp {
  CURVE_OP = 0,
}

export enum ZapTypeBalancerAuraArbitrum {
  BALANCER_AURA_ARBITRUM = 0,
}

export enum ZapTypeVelodrome {
  VELODROME = 0,
}

export enum ZapTypeBaseSwap {
  BASESWAP = 0,
}

export enum ZapCategory {
  COMMON = 'common',
  CURVE_CONVEX_ETH = 'curve-convex-eth',
  BALANCER_AURA_ETH = 'balancer-aura-eth',
  BALANCER_AURA_ARBITRUM = 'balancer-aura-arbitrum',
  RETRO_GAMMA = 'retro-gamma',
  HOP = 'hop',
  VELODROME = 'velodrome',
  CURVE_OP = 'curve-op',
  BASESWAP = 'baseswap',
}

type ZapTypeId =
  | ZapTypeCommon
  | ZapTypeBalancerAuraEth
  | ZapTypeCurveConvex
  | ZapTypeRetroGamma
  | ZapTypeHop
  | ZapTypeCurveOp
  | ZapTypeBalancerAuraArbitrum
  | ZapTypeVelodrome
  | ZapTypeBaseSwap;

export const isValidZapCategory = (type: ZapCategory) => {
  return Object.values(ZapCategory).includes(type);
};

export type Vault = {
  id: string;
  name: string;
  token: string;
  tokenAddress?: string | null;
  tokenDecimals: number;
  tokenProviderId?: string;
  tokenAmmId?: string;
  earnedToken: string;
  earnedTokenAddress: string;
  earnedTokenDecimals?: number;
  earnedOracleId?: string;
  earnContractAddress: string;
  oracle: 'lps' | 'tokens';
  oracleId: string;
  status: 'active' | 'paused' | 'eol';
  platformId: string;
  assets?: string[];
  zapId?: ZapTypeId;
  zapCategory?: ZapCategory;
  strategyTypeId: string;
  risks: string[];
  addLiquidityUrl?: string;
  removeLiquidityUrl?: string;
  network: AppChain;
  isGovVault?: boolean;
  strategy: string;
  lastHarvest?: number;
  pricePerFullShare: BigNumber;
  createdAt: number;
  chain: ApiChain;
  autoswapTokens?: string[];
};
