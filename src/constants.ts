import { ChainId } from '../packages/address-book/address-book';
import { ApiChain, fromChainId, selectSupportedChains, toAppChain } from './utils/chain';
import ReadOnlyDict = NodeJS.ReadOnlyDict;
import { convertFromChainTemplate } from './utils/templates';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const BASE_HPY = 2190;
const MINUTELY_HPY = 525600;
const HOURLY_HPY = 8760;
const DAILY_HPY = 365;
const ETH_HPY = DAILY_HPY / 3;
const WEEKLY_HPY = 52;

const FORTUBE_REQ_TOKENS = 'https://bsc.for.tube/api/v2/bank_tokens';
const FORTUBE_REQ_MARKETS = 'https://bsc.for.tube/api/v1/bank/markets?mode=extended';
const FORTUBE_API_TOKEN = process.env.FORTUBE_API_TOKEN;

const MAINNET_BSC_RPC_ENDPOINTS = [
  'https://bsc-dataseed.binance.org',
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed1.ninicoin.io',
  'https://bsc-dataseed2.defibit.io',
  'https://bsc-dataseed3.defibit.io',
  'https://bsc-dataseed4.defibit.io',
  'https://bsc-dataseed2.ninicoin.io',
  'https://bsc-dataseed3.ninicoin.io',
  'https://bsc-dataseed4.ninicoin.io',
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
  'https://bsc-dataseed4.binance.org',
];

const CUSTOM_BSC_RPC_ENDPOINTS = [process.env.BSC_RPC].filter(item => item);

const BSC_RPC_ENDPOINTS = CUSTOM_BSC_RPC_ENDPOINTS.length
  ? CUSTOM_BSC_RPC_ENDPOINTS
  : MAINNET_BSC_RPC_ENDPOINTS;

const BSC_RPC = process.env.BSC_RPC || BSC_RPC_ENDPOINTS[0];
const HECO_RPC = process.env.HECO_RPC || 'https://http-mainnet.hecochain.com';
const AVAX_RPC = process.env.AVAX_RPC || 'https://rpc.ankr.com/avalanche';
const POLYGON_RPC = process.env.POLYGON_RPC || 'https://polygon-rpc.com/';
const FANTOM_RPC = process.env.FANTOM_RPC || 'https://rpc.ankr.com/fantom';
const ONE_RPC = process.env.ONE_RPC || 'https://api.harmony.one/';
const ARBITRUM_RPC = process.env.ARBITRUM_RPC || 'https://arb1.arbitrum.io/rpc';
const CELO_RPC = process.env.CELO_RPC || 'https://forno.celo.org';
const MOONRIVER_RPC = process.env.MOONRIVER_RPC || 'https://rpc.api.moonriver.moonbeam.network';
const CRONOS_RPC = process.env.CRONOS_RPC || 'https://cronos.blockpi.network/v1/rpc/public';
const AURORA_RPC =
  process.env.AURORA_RPC ||
  'https://mainnet.aurora.dev/Fon6fPMs5rCdJc4mxX4kiSK1vsKdzc3D8k6UF8aruek';
const FUSE_RPC = process.env.FUSE_RPC || 'https://rpc.fuse.io';
const METIS_RPC = process.env.METIS_RPC || 'https://andromeda.metis.io/?owner=1088';
const MOONBEAM_RPC = process.env.MOONBEAM_RPC || 'https://rpc.api.moonbeam.network';
const EMERALD_RPC = process.env.EMERALD_RPC || 'https://emerald.oasis.dev';
const OPTIMISM_RPC = process.env.OPTIMISM_RPC || 'https://rpc.ankr.com/optimism';
const KAVA_RPC = process.env.KAVA_RPC || 'https://evm.kava.io';
const ETH_RPC = process.env.ETH_RPC || 'https://rpc.ankr.com/eth';
const CANTO_RPC = process.env.CANTO_RPC || 'https://canto.slingshot.finance';
const ZKSYNC_RPC = process.env.ZKSYNC_RPC || 'https://mainnet.era.zksync.io';
const ZKEVM_RPC = process.env.ZKEVM_RPC || 'https://zkevm-rpc.com';
const BASE_RPC = process.env.BASE_RPC || 'https://mainnet.base.org';

const CHAINS_TO_USE = process.env.CHAINS ?? '1';

const SUPPORTED_CHAINS_IDS: readonly ChainId[] = CHAINS_TO_USE.split(';').map(v => parseInt(v));

const SUPPORTED_CHAINS: ApiChain[] = SUPPORTED_CHAINS_IDS.map(v => fromChainId(v));
console.log({ SUPPORTED_CHAINS });

const BSC_CHAIN_ID = ChainId.bsc;
const HECO_CHAIN_ID = ChainId.heco;
const POLYGON_CHAIN_ID = ChainId.polygon;
const AVAX_CHAIN_ID = ChainId.avax;
const FANTOM_CHAIN_ID = ChainId.fantom;
const ONE_CHAIN_ID = ChainId.one;
const ARBITRUM_CHAIN_ID = ChainId.arbitrum;
const CELO_CHAIN_ID = ChainId.celo;
const MOONRIVER_CHAIN_ID = ChainId.moonriver;
const CRONOS_CHAIN_ID = ChainId.cronos;
const AURORA_CHAIN_ID = ChainId.aurora;
const FUSE_CHAIN_ID = ChainId.fuse;
const METIS_CHAIN_ID = ChainId.metis;
const MOONBEAM_CHAIN_ID = ChainId.moonbeam;
const EMERALD_CHAIN_ID = ChainId.emerald;
const OPTIMISM_CHAIN_ID = ChainId.optimism;
const KAVA_CHAIN_ID = ChainId.kava;
const ETH_CHAIN_ID = ChainId.ethereum;
const CANTO_CHAIN_ID = ChainId.canto;
const ZKSYNC_CHAIN_ID = ChainId.zksync;
const ZKEVM_CHAIN_ID = ChainId.zkevm;
const BASE_CHAIN_ID = ChainId.base;

const DFYN_LPF = 0.003;
const SUSHI_LPF = 0.003;
const SPIRIT_LPF = 0.003;
const QUICK_LPF = 0.003;
const APEPOLY_LPF = 0.002;
const COMETH_LPF = 0.005;
const PCS_LPF = 0.0017;
const APE_LPF = 0.002;
const SPOOKY_LPF = 0.002;
const JOE_LPF = 0.003;
const SOLAR_LPF = 0.0025;
const FUSEFI_LPF = 0.003;
const NET_LPF = 0.003;
const PANGOLIN_LPF = 0.003;
const TETHYS_LPF = 0.002;
const BEAMSWAP_LPF = 0.0017;
const TOMBSWAP_LPF = 0.005;
const BISWAP_LPF = 0.0005;
const HOP_LPF = 0.0004;

const MULTICHAIN_RPC: Record<ChainId, string> = {
  [ChainId.bsc]: BSC_RPC,
  [ChainId.heco]: HECO_RPC,
  [ChainId.polygon]: POLYGON_RPC,
  [ChainId.avax]: AVAX_RPC,
  [ChainId.fantom]: FANTOM_RPC,
  [ChainId.one]: ONE_RPC,
  [ChainId.arbitrum]: ARBITRUM_RPC,
  [ChainId.celo]: CELO_RPC,
  [ChainId.moonriver]: MOONRIVER_RPC,
  [ChainId.cronos]: CRONOS_RPC,
  [ChainId.aurora]: AURORA_RPC,
  [ChainId.fuse]: FUSE_RPC,
  [ChainId.metis]: METIS_RPC,
  [ChainId.moonbeam]: MOONBEAM_RPC,
  [ChainId.emerald]: EMERALD_RPC,
  [ChainId.optimism]: OPTIMISM_RPC,
  [ChainId.kava]: KAVA_RPC,
  [ChainId.ethereum]: ETH_RPC,
  [ChainId.canto]: CANTO_RPC,
  [ChainId.zksync]: ZKSYNC_RPC,
  [ChainId.zkevm]: ZKEVM_RPC,
  [ChainId.base]: BASE_RPC,
};

const MULTICHAIN_FORK_CHAIN_IDS: Record<ChainId, number> = {
  [ChainId.ethereum]: 31337,
  [ChainId.bsc]: 31338,
  [ChainId.polygon]: 31339,
  [ChainId.arbitrum]: 31340,
  [ChainId.optimism]: 31341,
  [ChainId.avax]: 31342,
  [ChainId.base]: 31343,
  [ChainId.heco]: 31337,
  [ChainId.fantom]: 31337,
  [ChainId.one]: 31337,
  [ChainId.celo]: 31337,
  [ChainId.moonriver]: 31337,
  [ChainId.cronos]: 31337,
  [ChainId.aurora]: 31337,
  [ChainId.fuse]: 31337,
  [ChainId.metis]: 31337,
  [ChainId.moonbeam]: 31337,
  [ChainId.emerald]: 31337,
  [ChainId.kava]: 31337,
  [ChainId.canto]: 31337,
  [ChainId.zksync]: 31337,
  [ChainId.zkevm]: 31337,
};

const defaultRemoteUrlTemplate =
  'https://raw.githubusercontent.com/RedDuck-Software/cubera-contracts/staging/configs/vault/{chain}.json';

const defaultRemoteUrlEarnTemplate =
  'https://raw.githubusercontent.com/RedDuck-Software/cubera-contracts/staging/configs/earn/{chain}.json';

const endpointTemplate = process.env.TEMPLATE_VAULTS;
const earnPoolsEndpointTemplate = process.env.TEMPLATE_EARN_POOLS;

const getVaultEndpoint = (chain: string) => {
  const vaultEndpoint = process.env[`${chain.toUpperCase()}_VAULTS_ENDPOINT`];

  return (
    vaultEndpoint ?? convertFromChainTemplate(endpointTemplate ?? defaultRemoteUrlTemplate, chain)
  );
};

const getEarnPoolEndpoint = (chain: string) => {
  const earnEndpoint = process.env[`${chain.toUpperCase()}_EARN_POOLS`];

  return (
    earnEndpoint ??
    convertFromChainTemplate(earnPoolsEndpointTemplate ?? defaultRemoteUrlEarnTemplate, chain)
  );
};

const BSC_VAULTS_ENDPOINT = getVaultEndpoint('bsc');
const HECO_VAULTS_ENDPOINT = getVaultEndpoint('heco');
const AVAX_VAULTS_ENDPOINT = getVaultEndpoint('avax');
const POLYGON_VAULTS_ENDPOINT = getVaultEndpoint('polygon');
const FANTOM_VAULTS_ENDPOINT = getVaultEndpoint('fantom');
const ONE_VAULTS_ENDPOINT = getVaultEndpoint('harmony');
const ARBITRUM_VAULTS_ENDPOINT = getVaultEndpoint('arbitrum');
const CELO_VAULTS_ENDPOINT = getVaultEndpoint('celo');
const MOONRIVER_VAULTS_ENDPOINT = getVaultEndpoint('moonriver');
const CRONOS_VAULTS_ENDPOINT = getVaultEndpoint('cronos');
const AURORA_VAULTS_ENDPOINT = getVaultEndpoint('aurora');
const FUSE_VAULTS_ENDPOINT = getVaultEndpoint('fuse');
const METIS_VAULTS_ENDPOINT = getVaultEndpoint('metis');
const MOONBEAM_VAULTS_ENDPOINT = getVaultEndpoint('moonbeam');
const EMERALD_VAULTS_ENDPOINT = getVaultEndpoint('emerald');
const OPTIMISM_VAULTS_ENDPOINT = getVaultEndpoint('optimism');
const KAVA_VAULTS_ENDPOINT = getVaultEndpoint('kava');
const ETHEREUM_VAULTS_ENDPOINT = getVaultEndpoint('ethereum');
const CANTO_VAULTS_ENDPOINT = getVaultEndpoint('canto');
const ZKSYNC_VAULTS_ENDPOINT = getVaultEndpoint('zksync');
const ZKEVM_VAULTS_ENDPOINT = getVaultEndpoint('zkevm');
const BASE_VAULTS_ENDPOINT = getVaultEndpoint('base');

const MULTICHAIN_ENDPOINTS: Partial<Record<ApiChain, string>> = selectSupportedChains({
  ethereum: ETHEREUM_VAULTS_ENDPOINT,
  bsc: BSC_VAULTS_ENDPOINT,
  avax: AVAX_VAULTS_ENDPOINT,
  polygon: POLYGON_VAULTS_ENDPOINT,
  fantom: FANTOM_VAULTS_ENDPOINT,
  one: ONE_VAULTS_ENDPOINT,
  arbitrum: ARBITRUM_VAULTS_ENDPOINT,
  celo: CELO_VAULTS_ENDPOINT,
  moonriver: MOONRIVER_VAULTS_ENDPOINT,
  cronos: CRONOS_VAULTS_ENDPOINT,
  aurora: AURORA_VAULTS_ENDPOINT,
  fuse: FUSE_VAULTS_ENDPOINT,
  metis: METIS_VAULTS_ENDPOINT,
  moonbeam: MOONBEAM_VAULTS_ENDPOINT,
  emerald: EMERALD_VAULTS_ENDPOINT,
  optimism: OPTIMISM_VAULTS_ENDPOINT,
  heco: HECO_VAULTS_ENDPOINT,
  kava: KAVA_VAULTS_ENDPOINT,
  canto: CANTO_VAULTS_ENDPOINT,
  zksync: ZKSYNC_VAULTS_ENDPOINT,
  zkevm: ZKEVM_VAULTS_ENDPOINT,
  base: BASE_VAULTS_ENDPOINT,
} as const);

const BSC_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('bsc');
const HECO_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('heco');
const AVAX_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('avax');
const POLYGON_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('polygon');
const FANTOM_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('fantom');
const ONE_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('harmony');
const ARBITRUM_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('arbitrum');
const CELO_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('celo');
const MOONRIVER_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('moonriver');
const CRONOS_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('cronos');
const AURORA_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('aurora');
const FUSE_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('fuse');
const METIS_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('metis');
const MOONBEAM_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('moonbeam');
const EMERALD_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('emerald');
const OPTIMISM_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('optimism');
const KAVA_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('kava');
const ETHEREUM_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('ethereum');
const CANTO_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('canto');
const ZKSYNC_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('zksync');
const ZKEVM_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('zkevm');
const BASE_EARN_POOL_ENDPOINT = getEarnPoolEndpoint('base');

const MULTICHAIN_EARN_POOLS_ENDPOINTS: Partial<Record<ApiChain, string>> = selectSupportedChains({
  ethereum: ETHEREUM_EARN_POOL_ENDPOINT,
  bsc: BSC_EARN_POOL_ENDPOINT,
  avax: AVAX_EARN_POOL_ENDPOINT,
  polygon: POLYGON_EARN_POOL_ENDPOINT,
  fantom: FANTOM_EARN_POOL_ENDPOINT,
  one: ONE_EARN_POOL_ENDPOINT,
  arbitrum: ARBITRUM_EARN_POOL_ENDPOINT,
  celo: CELO_EARN_POOL_ENDPOINT,
  moonriver: MOONRIVER_EARN_POOL_ENDPOINT,
  cronos: CRONOS_EARN_POOL_ENDPOINT,
  aurora: AURORA_EARN_POOL_ENDPOINT,
  fuse: FUSE_EARN_POOL_ENDPOINT,
  metis: METIS_EARN_POOL_ENDPOINT,
  moonbeam: MOONBEAM_EARN_POOL_ENDPOINT,
  emerald: EMERALD_EARN_POOL_ENDPOINT,
  optimism: OPTIMISM_EARN_POOL_ENDPOINT,
  heco: HECO_EARN_POOL_ENDPOINT,
  kava: KAVA_EARN_POOL_ENDPOINT,
  canto: CANTO_EARN_POOL_ENDPOINT,
  zksync: ZKSYNC_EARN_POOL_ENDPOINT,
  zkevm: ZKEVM_EARN_POOL_ENDPOINT,
  base: BASE_EARN_POOL_ENDPOINT,
} as const);

const EXCLUDED_IDS_FROM_TVL = ['venus-wbnb'];

export {
  MULTICHAIN_EARN_POOLS_ENDPOINTS,
  API_BASE_URL,
  BSC_RPC,
  BSC_RPC_ENDPOINTS,
  BSC_CHAIN_ID,
  BSC_VAULTS_ENDPOINT,
  HECO_RPC,
  HECO_CHAIN_ID,
  HECO_VAULTS_ENDPOINT,
  AVAX_RPC,
  AVAX_CHAIN_ID,
  AVAX_VAULTS_ENDPOINT,
  POLYGON_RPC,
  POLYGON_CHAIN_ID,
  POLYGON_VAULTS_ENDPOINT,
  FANTOM_RPC,
  FANTOM_CHAIN_ID,
  FANTOM_VAULTS_ENDPOINT,
  ONE_RPC,
  ONE_CHAIN_ID,
  ONE_VAULTS_ENDPOINT,
  ARBITRUM_RPC,
  ARBITRUM_CHAIN_ID,
  ARBITRUM_VAULTS_ENDPOINT,
  CELO_RPC,
  CELO_CHAIN_ID,
  CELO_VAULTS_ENDPOINT,
  MOONRIVER_RPC,
  MOONRIVER_CHAIN_ID,
  MOONRIVER_VAULTS_ENDPOINT,
  CRONOS_RPC,
  CRONOS_CHAIN_ID,
  CRONOS_VAULTS_ENDPOINT,
  AURORA_RPC,
  AURORA_CHAIN_ID,
  AURORA_VAULTS_ENDPOINT,
  FUSE_RPC,
  FUSE_CHAIN_ID,
  FUSE_VAULTS_ENDPOINT,
  METIS_RPC,
  METIS_CHAIN_ID,
  METIS_VAULTS_ENDPOINT,
  MOONBEAM_RPC,
  MOONBEAM_CHAIN_ID,
  MOONBEAM_VAULTS_ENDPOINT,
  EMERALD_RPC,
  EMERALD_CHAIN_ID,
  EMERALD_VAULTS_ENDPOINT,
  OPTIMISM_RPC,
  OPTIMISM_CHAIN_ID,
  OPTIMISM_VAULTS_ENDPOINT,
  KAVA_RPC,
  KAVA_CHAIN_ID,
  KAVA_VAULTS_ENDPOINT,
  ETH_RPC,
  ETH_CHAIN_ID,
  ETHEREUM_VAULTS_ENDPOINT,
  CANTO_RPC,
  CANTO_CHAIN_ID,
  CANTO_VAULTS_ENDPOINT,
  ZKSYNC_RPC,
  ZKSYNC_CHAIN_ID,
  ZKSYNC_VAULTS_ENDPOINT,
  ZKEVM_RPC,
  ZKEVM_CHAIN_ID,
  ZKEVM_VAULTS_ENDPOINT,
  BASE_RPC,
  BASE_CHAIN_ID,
  BASE_VAULTS_ENDPOINT,
  BASE_HPY,
  MINUTELY_HPY,
  HOURLY_HPY,
  DAILY_HPY,
  WEEKLY_HPY,
  FORTUBE_REQ_TOKENS,
  FORTUBE_REQ_MARKETS,
  FORTUBE_API_TOKEN,
  MULTICHAIN_RPC,
  MULTICHAIN_ENDPOINTS,
  DFYN_LPF,
  SUSHI_LPF,
  SPIRIT_LPF,
  QUICK_LPF,
  APEPOLY_LPF,
  COMETH_LPF,
  PCS_LPF,
  APE_LPF,
  SPOOKY_LPF,
  JOE_LPF,
  SOLAR_LPF,
  FUSEFI_LPF,
  NET_LPF,
  PANGOLIN_LPF,
  TETHYS_LPF,
  BEAMSWAP_LPF,
  BISWAP_LPF,
  TOMBSWAP_LPF,
  HOP_LPF,
  EXCLUDED_IDS_FROM_TVL,
  MULTICHAIN_FORK_CHAIN_IDS,
  SUPPORTED_CHAINS_IDS,
  SUPPORTED_CHAINS,
};
