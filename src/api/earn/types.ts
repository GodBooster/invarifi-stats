import { AppChain } from '../../utils/chain';

export type EarnPool = {
  id: string;
  earn: string;
  name: string;
  vaults: {
    vaultId: string;
    lpHelper: string;
    part: number;
  }[];
  stableAddress: string;
  stableDecimals: number;
  stable: string;
  priceAggregator: string;
  gelatoChecker: string;
  reservedForAutomation: number;
  earnConfiguration: string;
  status: 'active' | 'paused' | 'eol';
  risks: string[];
  network: AppChain;
  createdAt: number;
  stopLosses: number[];
  autoswapTokens?: string[];
};
