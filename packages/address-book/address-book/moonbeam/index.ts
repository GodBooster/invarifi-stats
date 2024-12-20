import { cubera } from './platforms/cubera';
import { beamswap } from './platforms/beamswap';
import { stellaswap } from './platforms/stellaswap';
import { solarflare } from './platforms/solarflare';
import { tokens } from './tokens/tokens';
import { convertSymbolTokenMapToAddressTokenMap } from '../../util/convertSymbolTokenMapToAddressTokenMap';
import Chain from '../../types/chain';
import { ConstInterface } from '../../types/const';

const _moonbeam = {
  platforms: {
    cubera,
    beamswap,
    solarflare,
    stellaswap,
  },
  tokens,
  tokenAddressMap: convertSymbolTokenMapToAddressTokenMap(tokens),
} as const;

export const moonbeam: ConstInterface<typeof _moonbeam, Chain> = _moonbeam;
