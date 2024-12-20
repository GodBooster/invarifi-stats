import { cubera } from './platforms/cubera';
import { sushi } from './platforms/sushi';
import { tokens } from './tokens/tokens';
import { convertSymbolTokenMapToAddressTokenMap } from '../../util/convertSymbolTokenMapToAddressTokenMap';
import Chain from '../../types/chain';
import { ConstInterface } from '../../types/const';

const _one = {
  platforms: {
    cubera,
    sushi,
  },
  tokens,
  tokenAddressMap: convertSymbolTokenMapToAddressTokenMap(tokens),
} as const;

export const one: ConstInterface<typeof _one, Chain> = _one;
