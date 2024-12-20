import { cubera } from './platforms/cubera';
import { vvs } from './platforms/vvs';
import { crona } from './platforms/crona';
import { tokens } from './tokens/tokens';
import { convertSymbolTokenMapToAddressTokenMap } from '../../util/convertSymbolTokenMapToAddressTokenMap';
import Chain from '../../types/chain';
import { ConstInterface } from '../../types/const';

const _cronos = {
  platforms: {
    cubera,
    vvs,
    crona,
  },
  tokens,
  tokenAddressMap: convertSymbolTokenMapToAddressTokenMap(tokens),
} as const;

export const cronos: ConstInterface<typeof _cronos, Chain> = _cronos;
