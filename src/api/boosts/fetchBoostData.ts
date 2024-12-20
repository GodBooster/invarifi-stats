import { ChainId } from '../../../packages/address-book/address-book';
import BigNumber from 'bignumber.js';
import { ApiChain } from '../../utils/chain';
import { fetchContract } from '../rpc/client';
import BoostAbi from '../../abis/Boost';
import { convertFromChainTemplate } from '../../utils/templates';
import { appFetch } from '../../utils/fetch';

const BOOST_TEMPLATE_PATH = process.env.BOOST_TEMPLATE_PATH;

export const getBoosts = async chain => {
  const boostsEndpoint = convertFromChainTemplate(
    BOOST_TEMPLATE_PATH ??
      'https://raw.githubusercontent.com/RedDuck-Software/cubera-contracts/staging/configs/boost/{chain}.json',
    chain
  );

  try {
    let boosts = await appFetch(boostsEndpoint);
    return boosts;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getBoostPeriodFinish = async (chain: ApiChain, boosts: any[]) => {
  const chainId = ChainId[chain];

  const boostAddresses = boosts.map(v => v.earnContractAddress);
  const periodFinishCalls = boostAddresses.map(boostAddress => {
    const boostContract = fetchContract(boostAddress, BoostAbi, chainId);
    return boostContract.read.periodFinish();
  });

  const res = await Promise.all(periodFinishCalls);

  const periodFinishes = res.map(v => new BigNumber(v.toString()).toNumber());

  for (let i = 0; i < periodFinishes.length; i++) {
    boosts[i].periodFinish = periodFinishes[i];
  }

  return boosts;
};
