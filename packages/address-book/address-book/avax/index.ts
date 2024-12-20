import Chain from '../../types/chain';
import { ConstInterface } from '../../types/const';

import { cubera } from './platforms/cubera';
import { lydia } from './platforms/lydia';
import { pangolin } from './platforms/pangolin';
import { joe } from './platforms/joe';
import { synapse } from './platforms/synapse';
import { mai } from './platforms/mai';
import { solisnek } from './platforms/solisnek';
import { balancer } from './platforms/balancer';

import { tokens } from './tokens/tokens';
import { convertSymbolTokenMapToAddressTokenMap } from '../../util/convertSymbolTokenMapToAddressTokenMap';

const _avax = {
  platforms: {
    cubera,
    lydia,
    pangolin,
    joe,
    synapse,
    mai,
    solisnek,
    balancer,
  },
  tokens,
  tokenAddressMap: convertSymbolTokenMapToAddressTokenMap(tokens),
};
export const avax: ConstInterface<typeof _avax, Chain> = _avax;
