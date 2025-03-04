const BigNumber = require('bignumber.js');
const { compound } = require('../../../utils/compound');
import { getEDecimals } from '../../../utils/getEDecimals';
const { FANTOM_CHAIN_ID: chainId, BASE_HPY } = require('../../../constants');
import { addressBook } from '../../../../packages/address-book/address-book';
import { getTotalPerformanceFeeForVault } from '../../vaults/getVaultFees';
import SolaceRewards from '../../../abis/aurora/SolaceRewards';
import { fetchContract } from '../../rpc/client';

const {
  fantom: {
    platforms: {
      solace: { rewards },
    },
    tokens: { SOLACE },
  },
} = addressBook;

const SECONDS_PER_DAY = 86400; // Per Second Rewards

const getSolaceApy = async () => {
  const [yearlyRewardsInUsd, totalStakedInUsd] = await Promise.all([
    getYearlyRewardsInUsd(),
    getTotalStakedInUsd(),
  ]);

  const apr = yearlyRewardsInUsd.dividedBy(totalStakedInUsd);
  const performanceFee = getTotalPerformanceFeeForVault('solace-ftm-solace');
  const shareAfterPerformanceFee = 1 - performanceFee;
  const apy = compound(apr, BASE_HPY, 1, shareAfterPerformanceFee);

  return {
    apys: {
      'solace-ftm-solace': apy,
    },
    apyBreakdowns: {
      'solace-ftm-solace': {
        vaultApr: apr,
        compoundingsPerYear: BASE_HPY,
        performanceFee,
        vaultApy: apy,
        totalApy: apy,
      },
    },
  };
};

const getYearlyRewardsInUsd = async () => {
  const rewardPool = fetchContract(rewards, SolaceRewards, chainId);
  const rewardRate = new BigNumber((await rewardPool.read.rewardPerSecond()).toString());
  const yearlyRewards = rewardRate.times(SECONDS_PER_DAY).times(365);
  const yearlyRewardsInUsd = yearlyRewards.dividedBy(getEDecimals(SOLACE.decimals));

  return yearlyRewardsInUsd;
};

const getTotalStakedInUsd = async () => {
  const rewardPool = fetchContract(rewards, SolaceRewards, chainId);
  const totalStaked = new BigNumber((await rewardPool.read.valueStaked()).toString());

  return totalStaked.dividedBy(getEDecimals(SOLACE.decimals));
};

module.exports = getSolaceApy;
