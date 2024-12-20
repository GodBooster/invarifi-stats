import { AppChain } from '../../utils/chain';
import { TokenEntity } from '../tokens/types';
import { ZapCategory } from '../vaults/types';
import { CachedGitJson } from './CachedGitJson';

export type ZapFeeSingle = number;
export type ZapFeeDiscounted = { original: number; discounted: number };
export type ZapFee = ZapFeeSingle | ZapFeeDiscounted;

export interface ZapConfig {
  zapAddress: string;
  ammId: string;
  chainId: AppChain;
}

export interface OneInchZapConfig {
  id: string;
  network: string;
  zapAddress: string; // identifier
  priceOracleAddress: string;
  strategies: {
    address: string;
    category: ZapCategory;
  }[];
  chainId: string;
  depositFromTokens: string[];
  withdrawToTokens: string[];
  autoswapTokens?: string[];
  blockedTokens: string[];
  blockedVaults: string[];
  fee: ZapFee;
}

export interface AmmConfigBase {
  id: string;
  name: string;
  routerAddress: string;
  factoryAddress: string;
  pairInitHash: string;
  minimumLiquidity: string;
  swapFeeNumerator: string;
  swapFeeDenominator: string;
}

export interface AmmConfigUniswapV2 extends AmmConfigBase {
  readonly type: 'uniswapv2';
  mintFeeNumerator: string;
  mintFeeDenominator: string;
  getAmountOutMode: 'getAmountOut' | 'getAmountsOut' | 'getAmountOutWithFee';
}

export interface AmmConfigSolidly extends AmmConfigBase {
  readonly type: 'solidly';
  getAmountOutMode: 'getAmountOut';
}

export type AmmConfig = AmmConfigUniswapV2 | AmmConfigSolidly;

export type ZapConfigsByType = {
  cubera: CachedGitJson<ZapConfig[]>;
  oneInch: CachedGitJson<OneInchZapConfig[]>;
};

export type ChainTokens = {
  byId: Record<TokenEntity['id'], TokenEntity['address']>;
  byAddress: Record<TokenEntity['address'], TokenEntity>;
};

export type TokensByChain = Record<string, ChainTokens>;
