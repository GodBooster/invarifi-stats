import { addressBook } from '../../../../packages/address-book/address-book';
import { FUSE_CHAIN_ID } from '../../../constants';
import { getBifiGovApr } from '../common/getBifiGovApr';
const {
  fuse: {
    platforms: {
      cubera: { rewardPool },
    },
    tokens: { BIFI },
  },
} = addressBook;

const REWARDS = rewardPool;
const DECIMALS = '1e18';
const BLOCKS_PER_DAY = 28800;

const getFuseBifiGovApy = async () => {
  return await getBifiGovApr(
    FUSE_CHAIN_ID,
    'fuse',
    'WFUSE',
    DECIMALS,
    REWARDS,
    BIFI.address,
    3 * 365,
    1,
    BLOCKS_PER_DAY
  );
};

module.exports = getFuseBifiGovApy;
