const { CANTO_CHAIN_ID } = require('../../../constants');
import { addressBook } from '../../../../packages/address-book/address-book';
import { getBifiGovApr } from '../common/getBifiGovApr';
const {
  canto: {
    platforms: { cubera },
    tokens: { BIFI },
  },
} = addressBook;

const REWARD_ORACLE = 'WCANTO';
const DECIMALS = '1e18';
const BLOCKS_PER_DAY = 28800;

const getCantoBifiGovApy = async () => {
  return await getBifiGovApr(
    CANTO_CHAIN_ID,
    'canto',
    REWARD_ORACLE,
    DECIMALS,
    cubera.rewardPool,
    BIFI.address,
    3 * 365,
    1,
    BLOCKS_PER_DAY
  );
};

module.exports = getCantoBifiGovApy;
