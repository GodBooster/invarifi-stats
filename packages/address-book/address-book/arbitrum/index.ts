import { cubera } from './platforms/cubera';
import { sushi } from './platforms/sushi';
import { swapfish } from './platforms/swapfish';
import { balancer } from './platforms/balancer';
import { solidlizard } from './platforms/solidlizard';
import { ramses } from './platforms/ramses';
import { arbidex } from './platforms/arbidex';
import { chronos } from './platforms/chronos';
import { tokens } from './tokens/tokens';
import { convertSymbolTokenMapToAddressTokenMap } from '../../util/convertSymbolTokenMapToAddressTokenMap';
import Chain from '../../types/chain';
import { ConstInterface } from '../../types/const';

const _arbitrum = {
  platforms: {
    cubera,
    sushi,
    swapfish,
    balancer,
    solidlizard,
    ramses,
    arbidex,
    chronos,
  },
  tokens,
  tokenAddressMap: convertSymbolTokenMapToAddressTokenMap(tokens),
} as const;

export const arbitrum: ConstInterface<typeof _arbitrum, Chain> = _arbitrum;
