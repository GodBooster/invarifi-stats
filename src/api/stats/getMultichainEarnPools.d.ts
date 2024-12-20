import { Vault } from '../vaults/types';
import { ApiChain } from '../../utils/chain';

export declare function getMultichainPools(): EarnPool[];
export declare function getSingleChainPools(chain: ApiChain): EarnPool[] | undefined;
export declare function getPoolByID(vaultId: string): EarnPool | undefined;
export declare function initPoolsService(): Promise<void>;
