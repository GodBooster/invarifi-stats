import { compound } from './compound';

export const getFarmWithTradingFeesApy = (
  farmApr,
  tradingApr: number | undefined,
  compoundingsPerYear,
  t,
  shareAfterPerformanceFee
) => {
  const farmApy = farmApr ? compound(farmApr, compoundingsPerYear, t, shareAfterPerformanceFee) : 0;
  const finalAPY = (1 + farmApy) * (1 + Number(tradingApr || 0)) - 1;
  return finalAPY;
};
