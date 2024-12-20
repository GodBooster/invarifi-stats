const { getMultichainPools, getSingleChainPools } = require('../stats/getMultichainEarnPools');

async function multichainPools(ctx) {
  try {
    const multichainPools = getMultichainPools();
    ctx.status = 200;
    ctx.body = [...multichainPools];
  } catch (err) {
    console.error(err);
    ctx.status = 500;
  }
}

async function singleChainPools(ctx) {
  try {
    const chainPools = getSingleChainPools(ctx.params.chainId);
    ctx.status = 200;
    ctx.body = chainPools ? [...chainPools] : [];
  } catch (err) {
    console.error(err);
    ctx.status = 500;
  }
}

module.exports = {
  multichainPools,
  singleChainPools,
};
