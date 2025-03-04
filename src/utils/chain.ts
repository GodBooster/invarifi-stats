import { addressBook, ChainId } from '../../packages/address-book/address-book';
import { invert } from 'lodash';
import { SUPPORTED_CHAINS } from '../constants';

export type ApiChain = keyof typeof ChainId;
export type AppChain = Exclude<ApiChain, 'one'> | 'harmony';
export type AnyChain = AppChain | ApiChain;

const appChainToApiChain: Partial<Record<AppChain, ApiChain>> = {
  harmony: 'one',
} as const;
const apiChainToAppChain: Partial<Record<ApiChain, AppChain>> = invert(appChainToApiChain);

export const selectSupportedChains = <T extends Partial<Record<AppChain, R>>, R>(records: T) => {
  const supportedChains = SUPPORTED_CHAINS;

  return Object.fromEntries(
    Object.entries(records).filter(([key, _]: [ApiChain, R]) => supportedChains.includes(key))
  ) as Partial<Record<AppChain, R>>;
};

export function toAppChain(chain: AnyChain): AppChain {
  if (isAppChain(chain)) {
    return chain;
  }

  if (apiChainToAppChain[chain]) {
    return apiChainToAppChain[chain];
  }

  throw new Error(`Invalid api chain: ${chain}`);
}

export function toApiChain(chain: AnyChain): ApiChain {
  if (isApiChain(chain)) {
    return chain;
  }

  if (appChainToApiChain[chain]) {
    return appChainToApiChain[chain];
  }

  throw new Error(`Invalid app chain: ${chain}`);
}

export function isApiChain(chain: string): chain is ApiChain {
  return chain in ChainId;
}

export function isAppChain(chain: string): chain is AppChain {
  return chain in appChainToApiChain || (chain in ChainId && !(chain in apiChainToAppChain));
}

export function toChainId(chain: AnyChain): number {
  const apiChain = toApiChain(chain);
  return ChainId[apiChain];
}

export function fromChainId(chainId: number): ApiChain {
  return Object.keys(ChainId).find(key => ChainId[key] === chainId) as ApiChain;
}
