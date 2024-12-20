import {
  createPublicClient,
  getContract,
  http,
  HttpTransport,
  HttpTransportConfig,
  PublicClient,
} from 'viem';
import { Abi } from 'abitype';
import { getChain } from './chains';
import { ChainId } from '../../../packages/address-book/address-book';
import { rateLimitedHttp } from './transport';
import PQueue from 'p-queue';
import { envBoolean, envNumber } from '../../utils/env';
import { MULTICHAIN_FORK_CHAIN_IDS, MULTICHAIN_RPC } from '../../constants';

const multicallClientsByChain: Record<number, PublicClient> = {};
const singleCallClientsByChain: Record<number, PublicClient> = {};
const queueByDomain: Record<string, PQueue> = {};

/**
 * Return a new queue per domain
 * @param rpcUrl
 */
function getQueueFor(rpcUrl: string): PQueue {
  const { hostname } = new URL(rpcUrl);
  if (!queueByDomain[hostname]) {
    // Default: Max 5 requests per second with 2 active requests
    queueByDomain[hostname] = new PQueue({
      concurrency: envNumber('RPC_RATE_LIMIT_CONCURRENCY', 2),
      intervalCap: envNumber('RPC_RATE_LIMIT_INTERVAL_CAP', 5),
      interval: envNumber('RPC_RATE_LIMIT_INTERVAL', 1000),
      carryoverConcurrencyCount: true,
      autoStart: true,
      timeout: 30 * 1000,
      throwOnTimeout: true,
    });
  }

  return queueByDomain[hostname];
}

function makeHttpTransport(url: string, config: HttpTransportConfig = {}): HttpTransport {
  // Default: disable rate limiting
  if (envBoolean('RPC_RATE_LIMIT', false)) {
    const queue = getQueueFor(url);
    return rateLimitedHttp(queue, url, config);
  }

  return http(url, config);
}

const getTransport = (chainId: ChainId) => {
  const chain = getChain[chainId];
  if (!chain) throw new Error('Unknown chainId ' + chainId);
  const url = MULTICHAIN_RPC[chainId];

  const isFork = url.includes('localhost') || url.includes('127.0.0.1');

  const realChainId = isFork ? MULTICHAIN_FORK_CHAIN_IDS[chainId] : chain.id;

  if (isFork) {
    console.log('Fork chain id to use: ', realChainId);
  }

  return {
    chain: {
      ...chain,
      id: realChainId,
    },
    transport: makeHttpTransport(url, {
      timeout: 15000,
      retryCount: 5,
      retryDelay: 100,
    }),
  };
};

const getMulticallClientForChain = (chainId: ChainId): PublicClient => {
  if (!multicallClientsByChain[chainId]) {
    multicallClientsByChain[chainId] = createPublicClient({
      batch: {
        multicall: {
          batchSize: parseInt(process.env.BATCH_SIZE ?? '1000'),
          wait: parseInt(process.env.BATCH_WAIT ?? '1500'),
        },
      },
      ...getTransport(chainId),
    });
  }
  return multicallClientsByChain[chainId];
};

const getSingleCallClientForChain = (chainId: ChainId): PublicClient => {
  if (!singleCallClientsByChain[chainId]) {
    singleCallClientsByChain[chainId] = createPublicClient({
      ...getTransport(chainId),
    });
  }
  return singleCallClientsByChain[chainId];
};

export const fetchContract = <ContractAbi extends Abi>(
  address: string,
  abi: ContractAbi,
  chainId: ChainId
) => {
  const publicClient = getMulticallClientForChain(chainId);
  return getContract({ address: address as `0x${string}`, abi, publicClient });
};

export const fetchNoMulticallContract = <ContractAbi extends Abi>(
  address: string,
  abi: ContractAbi,
  chainId: ChainId
) => {
  const publicClient = getSingleCallClientForChain(chainId);
  return getContract({ address: address as `0x${string}`, abi, publicClient });
};

export const getRPCClient = (chainId: ChainId): PublicClient => getMulticallClientForChain(chainId);
