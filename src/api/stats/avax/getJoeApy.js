const BigNumber = require('bignumber.js');
const fetchPrice = require('../../../utils/fetchPrice');
const pool = require('../../../data/avax/joePool.json');
const { DAILY_HPY, AVAX_CHAIN_ID } = require('../../../constants');
const { compound } = require('../../../utils/compound');
const { getYearlyTradingFeesForSJOE } = require('../../../utils/getTradingFeeApr');
const { joeClient } = require('../../../apollo/client');
const { getTotalPerformanceFeeForVault } = require('../../vaults/getVaultFees');
const { default: StableJoeStaking } = require('../../../abis/avax/StableJoeStaking');
const { fetchContract } = require('../../rpc/client');

const oracle = 'tokens';
const JOE = 'JOE';
const joeDecimals = '1e18';

const liquidityProviderFee = 0.0005;

const getJoeApy = async () => {
  const joePrice = await fetchPrice({ oracle, id: JOE });

  const rewardPool = fetchContract(pool.rewardPool, StableJoeStaking, AVAX_CHAIN_ID);
  const [totalStaked, tradingAprs] = await Promise.all([
    rewardPool.read.internalJoeBalance().then(v => new BigNumber(v.toString())),
    getYearlyTradingFeesForSJOE(joeClient, liquidityProviderFee),
  ]);

  const totalStakedInUsd = totalStaked.times(joePrice).dividedBy(joeDecimals);

  const performanceFee = getTotalPerformanceFeeForVault(pool.name);
  const shareAfterPerformanceFee = 1 - performanceFee;

  const simpleApr = tradingAprs.dividedBy(totalStakedInUsd);
  const vaultApr = simpleApr.times(shareAfterPerformanceFee);
  const vaultApy = compound(simpleApr, DAILY_HPY, 1, shareAfterPerformanceFee);
  const apys = { [pool.name]: vaultApy };

  const apyBreakdowns = {
    [pool.name]: {
      vaultApr: vaultApr.toNumber(),
      compoundingsPerYear: DAILY_HPY,
      performanceFee,
      vaultApy: vaultApy,
      lpFee: liquidityProviderFee,
      tradingApr: 0,
      totalApy: vaultApy,
    },
  };

  return {
    apys,
    apyBreakdowns,
  };
};

module.exports = getJoeApy;
