import { appFetch } from './fetch';

const getEarnPools = async poolsEndpoint => {
  try {
    return await appFetch(poolsEndpoint);
  } catch (err) {
    console.error(err);
    return 0;
  }
};

module.exports = getEarnPools;
