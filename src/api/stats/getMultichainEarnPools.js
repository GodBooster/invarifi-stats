import BigNumber from 'bignumber.js';
import { isResultFulfilled, isResultRejected, withTimeout } from '../../utils/promise';
import { serviceEventBus } from '../../utils/ServiceEventBus';
import { keyBy, sumBy } from 'lodash';

const getPools = require('../../utils/getEarnPools');
const { MULTICHAIN_EARN_POOLS_ENDPOINTS } = require('../../constants');
const { getKey, setKey } = require('../../utils/cache');

const INIT_DELAY = process.env.VAULTS_INIT_DELAY || 2 * 1000;
const REFRESH_INTERVAL = 5 * 60 * 1000;
const LOG_PER_CHAIN = true;

let poolsByChain = {};

let multichainPools = [];
let multichainPoolsCounter = 0;
let multichainActivePoolsCounter = 0;
let poolsByID = {};

export function getMultichainPools() {
  return multichainPools;
}

export function getSingleChainPools(chain) {
  return [...(poolsByChain[chain] ?? [])];
}

export function getPoolByID(vaultId) {
  return poolsByID[vaultId];
}

async function updateMultichainEarnPools() {
  console.log('> updating vaults');

  try {
    const start = Date.now();
    const timeout = Math.floor(REFRESH_INTERVAL / 2);
    const results = await Promise.allSettled(
      Object.keys(MULTICHAIN_EARN_POOLS_ENDPOINTS).map(chain =>
        withTimeout(updateChainPools(chain), timeout)
      )
    );
    const fulfilled = results.filter(isResultFulfilled);

    if (fulfilled.length) {
      // TODO: add TTL so entries are removed if not updated (e.g. chain rpc is down)
      buildFromChains();
      await saveToRedis();
    }

    console.log(
      `> Earn pools for ${fulfilled.length}/${
        results.length
      } chains updated: ${multichainPoolsCounter} pools (${multichainActivePoolsCounter} active) (${
        (Date.now() - start) / 1000
      }s)`
    );

    if (fulfilled.length < results.length) {
      const rejected = results.filter(isResultRejected);
      console.error(` - ${rejected.length} chains failed to update:`);
      rejected.forEach(result => console.error(`  - ${result.reason}`));
    }
  } catch (err) {
    console.error(`> earn pools update failed `, err);
  }

  setTimeout(updateMultichainEarnPools, REFRESH_INTERVAL);
}

function buildFromChains() {
  multichainPools = Object.values(poolsByChain).flat();

  multichainPoolsCounter = multichainPools.length;
  multichainActivePoolsCounter = sumBy(multichainPools, pool => (pool.status === 'active' ? 1 : 0));
  poolsByID = keyBy(multichainPools, 'id');

  Object.keys(poolsByChain).forEach(chain => serviceEventBus.emit(`earn/pools/${chain}/ready`));
  serviceEventBus.emit('earn/pools/updated');
}

async function updateChainPools(chain) {
  if (LOG_PER_CHAIN) {
    console.log(`> updating earn pools on ${chain}`);
  }

  const endpoint = MULTICHAIN_EARN_POOLS_ENDPOINTS[chain];
  let chainVaults = await getPools(endpoint);

  poolsByChain[chain] = chainVaults;

  if (LOG_PER_CHAIN) {
    console.log(`> updated earn pools on ${chain} - ${poolsByChain.length}`);
  }
}

async function loadFromRedis() {
  const cachedVaults = await getKey('EARN_POOLS_BY_CHAIN');

  if (cachedVaults && typeof cachedVaults === 'object') {
    let cachedCount = 0;

    Object.values(cachedVaults).forEach(vaults => {
      vaults.forEach(vault => {
        ++cachedCount;
      });
    });

    if (cachedCount > 0) {
      poolsByChain = cachedVaults;
      buildFromChains();
    }
  }
}

async function saveToRedis() {
  await setKey('EARN_POOLS_BY_CHAIN', poolsByChain);
}

export async function initPoolsService() {
  await loadFromRedis();
  setTimeout(updateMultichainEarnPools, INIT_DELAY);
}
