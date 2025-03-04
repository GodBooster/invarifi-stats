import { cubera } from './platforms/cubera';
import { quickswap } from './platforms/quickswap';
import { balancer } from './platforms/balancer';
import { tokens } from './tokens/tokens';
import { convertSymbolTokenMapToAddressTokenMap } from '../../util/convertSymbolTokenMapToAddressTokenMap';
import Chain from '../../types/chain';
import { ConstInterface } from '../../types/const';

const _zkevm = {
  platforms: {
    cubera,
    quickswap,
    balancer,
  },
  tokens,
  tokenAddressMap: convertSymbolTokenMapToAddressTokenMap(tokens),
} as const;

export const zkevm: ConstInterface<typeof _zkevm, Chain> = _zkevm;
