import { cubera } from './platforms/cubera';
import { solarbeam } from './platforms/solarbeam';
import { sushi } from './platforms/sushi';
import { finn } from './platforms/finn';
import { tokens } from './tokens/tokens';
import { convertSymbolTokenMapToAddressTokenMap } from '../../util/convertSymbolTokenMapToAddressTokenMap';
import Chain from '../../types/chain';
import { ConstInterface } from '../../types/const';

const _moonriver = {
  platforms: {
    cubera,
    solarbeam,
    sushi,
    finn,
  },
  tokens,
  tokenAddressMap: convertSymbolTokenMapToAddressTokenMap(tokens),
} as const;

export const moonriver: ConstInterface<typeof _moonriver, Chain> = _moonriver;
