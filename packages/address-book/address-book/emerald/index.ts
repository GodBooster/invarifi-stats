import { cubera } from './platforms/cubera';
import { valleyswap } from './platforms/valleyswap';
import { yuzu } from './platforms/yuzu';
import { tokens } from './tokens/tokens';
import { convertSymbolTokenMapToAddressTokenMap } from '../../util/convertSymbolTokenMapToAddressTokenMap';
import Chain from '../../types/chain';
import { ConstInterface } from '../../types/const';

const _emerald = {
  platforms: {
    cubera,
    valleyswap,
    yuzu,
  },
  tokens,
  tokenAddressMap: convertSymbolTokenMapToAddressTokenMap(tokens),
} as const;

export const emerald: ConstInterface<typeof _emerald, Chain> = _emerald;
