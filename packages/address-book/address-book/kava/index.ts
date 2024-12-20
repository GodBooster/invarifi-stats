import { cubera } from './platforms/cubera';
import { equilibre } from './platforms/equilibre';
import { sushiKava } from './platforms/sushiKava';
import { tokens } from './tokens/tokens';
import { convertSymbolTokenMapToAddressTokenMap } from '../../util/convertSymbolTokenMapToAddressTokenMap';
import Chain from '../../types/chain';
import { ConstInterface } from '../../types/const';

const _kava = {
  platforms: {
    cubera,
    equilibre,
    sushiKava,
  },
  tokens,
  tokenAddressMap: convertSymbolTokenMapToAddressTokenMap(tokens),
} as const;
export const kava: ConstInterface<typeof _kava, Chain> = _kava;
