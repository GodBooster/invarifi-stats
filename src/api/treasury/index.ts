import { getTreasury } from './getTreasury';

export const getApiTreasury = ctx => {
  const chainTokens = getTreasury();
  if (chainTokens) {
    ctx.status = 200;
    ctx.body = chainTokens;
  } else {
    ctx.status = 500;
    ctx.body = 'Not available yet';
  }
};
