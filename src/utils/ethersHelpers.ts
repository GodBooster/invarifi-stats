import { ethers } from 'ethers';
import { addressBookByChainId, ChainId } from '../../packages/address-book/address-book';
import { Cubera } from '../../packages/address-book/types/cubera';

import {
  BSC_RPC_ENDPOINTS,
  HECO_RPC,
  AVAX_RPC,
  POLYGON_RPC,
  FANTOM_RPC,
  ONE_RPC,
  BSC_CHAIN_ID,
  HECO_CHAIN_ID,
  AVAX_CHAIN_ID,
  POLYGON_CHAIN_ID,
  FANTOM_CHAIN_ID,
  ONE_CHAIN_ID,
  ARBITRUM_RPC,
  ARBITRUM_CHAIN_ID,
  CELO_RPC,
  CELO_CHAIN_ID,
  MOONRIVER_RPC,
  MOONRIVER_CHAIN_ID,
  CRONOS_RPC,
  CRONOS_CHAIN_ID,
  AURORA_RPC,
  AURORA_CHAIN_ID,
  FUSE_RPC,
  FUSE_CHAIN_ID,
  METIS_RPC,
  METIS_CHAIN_ID,
  MOONBEAM_RPC,
  MOONBEAM_CHAIN_ID,
  EMERALD_RPC,
  EMERALD_CHAIN_ID,
  OPTIMISM_RPC,
  OPTIMISM_CHAIN_ID,
  KAVA_RPC,
  KAVA_CHAIN_ID,
  ETH_RPC,
  ETH_CHAIN_ID,
  CANTO_RPC,
  CANTO_CHAIN_ID,
  ZKSYNC_RPC,
  ZKSYNC_CHAIN_ID,
  ZKEVM_RPC,
  ZKEVM_CHAIN_ID,
  BASE_RPC,
  BASE_CHAIN_ID,
} from '../constants';

console.log(addressBookByChainId[ChainId.fantom].platforms.cubera.multicall);
const MULTICALLS: Record<ChainId, Pick<Cubera, 'multicall'>['multicall']> = {
  [ChainId.bsc]: addressBookByChainId[ChainId.bsc].platforms.cubera.multicall,
  [ChainId.heco]: addressBookByChainId[ChainId.heco].platforms.cubera.multicall,
  [ChainId.polygon]: addressBookByChainId[ChainId.polygon].platforms.cubera.multicall,
  [ChainId.fantom]: addressBookByChainId[ChainId.fantom].platforms.cubera.multicall,
  [ChainId.avax]: addressBookByChainId[ChainId.avax].platforms.cubera.multicall,
  [ChainId.one]: addressBookByChainId[ChainId.one].platforms.cubera.multicall,
  [ChainId.arbitrum]: addressBookByChainId[ChainId.arbitrum].platforms.cubera.multicall,
  [ChainId.celo]: addressBookByChainId[ChainId.celo].platforms.cubera.multicall,
  [ChainId.moonriver]: addressBookByChainId[ChainId.moonriver].platforms.cubera.multicall,
  [ChainId.cronos]: addressBookByChainId[ChainId.cronos].platforms.cubera.multicall,
  [ChainId.aurora]: addressBookByChainId[ChainId.aurora].platforms.cubera.multicall,
  [ChainId.fuse]: addressBookByChainId[ChainId.fuse].platforms.cubera.multicall,
  [ChainId.metis]: addressBookByChainId[ChainId.metis].platforms.cubera.multicall,
  [ChainId.moonbeam]: addressBookByChainId[ChainId.moonbeam].platforms.cubera.multicall,
  [ChainId.emerald]: addressBookByChainId[ChainId.emerald].platforms.cubera.multicall,
  [ChainId.optimism]: addressBookByChainId[ChainId.optimism].platforms.cubera.multicall,
  [ChainId.kava]: addressBookByChainId[ChainId.kava].platforms.cubera.multicall,
  [ChainId.ethereum]: addressBookByChainId[ChainId.ethereum].platforms.cubera.multicall,
  [ChainId.canto]: addressBookByChainId[ChainId.canto].platforms.cubera.multicall,
  [ChainId.zksync]: addressBookByChainId[ChainId.zksync].platforms.cubera.multicall,
  [ChainId.zkevm]: addressBookByChainId[ChainId.zkevm].platforms.cubera.multicall,
  [ChainId.base]: addressBookByChainId[ChainId.base].platforms.cubera.multicall,
};

const clients: Record<keyof typeof ChainId, ethers.providers.JsonRpcProvider[]> = {
  bsc: [],
  heco: [],
  avax: [],
  polygon: [],
  fantom: [],
  one: [],
  arbitrum: [],
  celo: [],
  moonriver: [],
  cronos: [],
  aurora: [],
  fuse: [],
  metis: [],
  moonbeam: [],
  emerald: [],
  optimism: [],
  kava: [],
  ethereum: [],
  canto: [],
  zksync: [],
  zkevm: [],
  base: [],
};
BSC_RPC_ENDPOINTS.forEach(endpoint => {
  clients.bsc.push(new ethers.providers.JsonRpcProvider(endpoint));
});
clients.heco.push(new ethers.providers.JsonRpcProvider(HECO_RPC));
clients.avax.push(new ethers.providers.JsonRpcProvider(AVAX_RPC));
clients.polygon.push(new ethers.providers.JsonRpcProvider(POLYGON_RPC));
clients.fantom.push(new ethers.providers.JsonRpcProvider(FANTOM_RPC));
clients.one.push(new ethers.providers.JsonRpcProvider(ONE_RPC));
clients.arbitrum.push(new ethers.providers.JsonRpcProvider(ARBITRUM_RPC));
clients.celo.push(new ethers.providers.JsonRpcProvider(CELO_RPC));
clients.moonriver.push(new ethers.providers.JsonRpcProvider(MOONRIVER_RPC));
clients.cronos.push(new ethers.providers.JsonRpcProvider(CRONOS_RPC));
clients.aurora.push(new ethers.providers.JsonRpcProvider(AURORA_RPC));
clients.fuse.push(new ethers.providers.JsonRpcProvider(FUSE_RPC));
clients.metis.push(new ethers.providers.JsonRpcProvider(METIS_RPC));
clients.moonbeam.push(new ethers.providers.JsonRpcProvider(MOONBEAM_RPC));
clients.emerald.push(new ethers.providers.JsonRpcProvider(EMERALD_RPC));
clients.optimism.push(new ethers.providers.JsonRpcProvider(OPTIMISM_RPC));
clients.kava.push(new ethers.providers.JsonRpcProvider(KAVA_RPC));
clients.ethereum.push(new ethers.providers.JsonRpcProvider(ETH_RPC));
clients.canto.push(new ethers.providers.JsonRpcProvider(CANTO_RPC));
clients.zksync.push(new ethers.providers.JsonRpcProvider(ZKSYNC_RPC));
clients.zkevm.push(new ethers.providers.JsonRpcProvider(ZKEVM_RPC));
clients.base.push(new ethers.providers.JsonRpcProvider(BASE_RPC));

export const chainRandomClients = {
  bscRandomClient: () => clients.bsc[~~(clients.bsc.length * Math.random())],
  hecoRandomClient: () => clients.heco[~~(clients.heco.length * Math.random())],
  avaxRandomClient: () => clients.avax[~~(clients.avax.length * Math.random())],
  polygonRandomClient: () => clients.polygon[~~(clients.polygon.length * Math.random())],
  fantomRandomClient: () => clients.fantom[~~(clients.fantom.length * Math.random())],
  oneRandomClient: () => clients.one[~~(clients.one.length * Math.random())],
  arbitrumRandomClient: () => clients.arbitrum[~~(clients.arbitrum.length * Math.random())],
  celoRandomClient: () => clients.celo[~~(clients.celo.length * Math.random())],
  moonriverRandomClient: () => clients.moonriver[~~(clients.moonriver.length * Math.random())],
  cronosRandomClient: () => clients.cronos[~~(clients.cronos.length * Math.random())],
  auroraRandomClient: () => clients.aurora[~~(clients.aurora.length * Math.random())],
  fuseRandomClient: () => clients.fuse[~~(clients.fuse.length * Math.random())],
  metisRandomClient: () => clients.metis[~~(clients.metis.length * Math.random())],
  moonbeamRandomClient: () => clients.moonbeam[~~(clients.moonbeam.length * Math.random())],
  emeraldRandomClient: () => clients.emerald[~~(clients.emerald.length * Math.random())],
  optimismRandomClient: () => clients.optimism[~~(clients.optimism.length * Math.random())],
  kavaRandomClient: () => clients.kava[~~(clients.kava.length * Math.random())],
  ethereumRandomClient: () => clients.ethereum[~~(clients.ethereum.length * Math.random())],
  cantoRandomClient: () => clients.canto[~~(clients.canto.length * Math.random())],
  zksyncRandomClient: () => clients.zksync[~~(clients.zksync.length * Math.random())],
  zkevmRandomClient: () => clients.zkevm[~~(clients.zkevm.length * Math.random())],
  baseRandomClient: () => clients.base[~~(clients.base.length * Math.random())],
};

export const _ethersFactory = (chainId: ChainId) => {
  switch (chainId) {
    case BSC_CHAIN_ID:
      return chainRandomClients.bscRandomClient();
    case HECO_CHAIN_ID:
      return chainRandomClients.hecoRandomClient();
    case AVAX_CHAIN_ID:
      return chainRandomClients.avaxRandomClient();
    case POLYGON_CHAIN_ID:
      return chainRandomClients.polygonRandomClient();
    case FANTOM_CHAIN_ID:
      return chainRandomClients.fantomRandomClient();
    case ONE_CHAIN_ID:
      return chainRandomClients.oneRandomClient();
    case ARBITRUM_CHAIN_ID:
      return chainRandomClients.arbitrumRandomClient();
    case CELO_CHAIN_ID:
      return chainRandomClients.celoRandomClient();
    case MOONRIVER_CHAIN_ID:
      return chainRandomClients.moonriverRandomClient();
    case CRONOS_CHAIN_ID:
      return chainRandomClients.cronosRandomClient();
    case AURORA_CHAIN_ID:
      return chainRandomClients.auroraRandomClient();
    case FUSE_CHAIN_ID:
      return chainRandomClients.fuseRandomClient();
    case METIS_CHAIN_ID:
      return chainRandomClients.metisRandomClient();
    case MOONBEAM_CHAIN_ID:
      return chainRandomClients.moonbeamRandomClient();
    case EMERALD_CHAIN_ID:
      return chainRandomClients.emeraldRandomClient();
    case OPTIMISM_CHAIN_ID:
      return chainRandomClients.optimismRandomClient();
    case KAVA_CHAIN_ID:
      return chainRandomClients.kavaRandomClient();
    case ETH_CHAIN_ID:
      return chainRandomClients.ethereumRandomClient();
    case CANTO_CHAIN_ID:
      return chainRandomClients.cantoRandomClient();
    case ZKSYNC_CHAIN_ID:
      return chainRandomClients.zksyncRandomClient();
    case ZKEVM_CHAIN_ID:
      return chainRandomClients.zkevmRandomClient();
    case BASE_CHAIN_ID:
      return chainRandomClients.baseRandomClient();
  }
};

export const _multicallAddress = (chainId: ChainId) => MULTICALLS[chainId];
