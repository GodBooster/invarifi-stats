import { cubera } from './platforms/cubera';
import { balancer } from './platforms/balancer';
import { aura } from './platforms/aura';
import { sushi } from './platforms/sushi';
import { synapse } from './platforms/synapse';
import { solidly } from './platforms/solidly';
import { verse } from './platforms/verse';

import { tokens } from './tokens/tokens';
import { convertSymbolTokenMapToAddressTokenMap } from '../../util/convertSymbolTokenMapToAddressTokenMap';
import Chain from '../../types/chain';
import { ConstInterface } from '../../types/const';

const _ethereum = {
  platforms: {
    cubera,
    balancer,
    aura,
    sushi,
    synapse,
    solidly,
    verse,
  },
  tokens,
  tokenAddressMap: convertSymbolTokenMapToAddressTokenMap(tokens),
};
export const ethereum: ConstInterface<typeof _ethereum, Chain> = _ethereum;
