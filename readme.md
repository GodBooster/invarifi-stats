# Cubera API

---

## To Run.

```
yarn install-all 
yarn start
```

Note: After you start the API it can take a minute or two before you can fetch the APYs. We currently log `getApys()` to the console when all the data is available.

Optional environment vars:

`BSC_RPC` - A custom RPC endpoint that you want to use.
`HECO_RPC` - A custom RPC endpoint for HECO. You can just leave the default one otherwise.
`FORTUBE_API_TOKEN` - A token from Fortube to use their API. If you don't have a token you will get a console warning and the Fortube APYs will be slightly smaller than in production. Everything works fine otherwise. 

---

---

## Endpoints

http://localhost:3000/

---

#### **/apy**

The main endpoint used by the frontend. It returns the APY of all the vaults in the following format. 

```
{
	"bifi-maxi": 0.22448469479728606, // 22%
	"cake-cake": 2.8002377054263174, // 280%
	"cake-smart": 2.8002377054263174, // 280%
	"cake-swingby-bnb": 21.85102752680053 // 2185%
}
```

NB This is the legacy format. A new endpoint is being created at **/apy/breakdown** with a staggered migration.

#### **/apy/breakdown**

The new version of the APY endpoint, broken down into component parts when they are available. The endpoint moves to a new format, which is consistent whether or not the breakdown stats are possible to display. It has the following structure:

```json
{
  "bifi-maxi": {
    "totalApy": 0.07598675804818633
  },
  "cometh-must-eth": {
    "vaultApr": 1.186973388240745,
    "compoundingsPerYear": 2190,
    "performanceFee": 0.045,
    "vaultApy": 2.1057844292858614,
    "lpFee": 0.005,
    "tradingApr": 0.22324214039526927,
    "totalApy": 2.8825691266420788
  }
}
```

Note the endpoint exposes elements needed for the Total APY calculation. Where this is not possible, we just show the legacy Total APY. Note that the legacy Total APY -> totalApy does not include the trading fees.

Each of these fields within the structure are:

- **vaultApr** - Yearly rewards in USD divided by total staked in USD.
- **compoundingsPerYear** - The estimated compounding events. This is an internal field and references the value used within the calculation for this project.
- **performanceFee** - The flat Cubera performance fee included in the calculation. This is an internal field for reference.
- **vaultApy** - The vaultApr compounded, using compoundingsPerYear and performanceFee in the calculation.
- **lpFee** - The Liquidity Provider (LP) fee per trade. This is an internal field for reference.
- **tradingApr** - Annual interest from trading fees, not compounded.
- **totalApy** - The known Total APY. Where fields are available to calculate the Total APY including trading fees, this is calculated. The final calculation is totalApy = (1 + vaultApy) * (1 + tradingApr) - 1.


#### **/prices** All token prices under the same endpoint (crosschain).

#### **/lps**: All liquidity pair prices under a single endpoint (crosschain).

#### **/vaults**: TBD


---

#### **/earnings**: Used to display the total and daily earnings of the platform

#### **/holders**: Used to display the total number of holders. This calc takes into account users with 0 BIFI in their wallet, but BIFI staked in the reward pool

---

### Consumed by third party platforms

#### **/cmc**: Custom endpoint required by [CoinMarketCap](https://coinmarketcap.com/) to display our vaults in their yield farming section

#### **/supply**: Used by [Coingecko](https://coingecko.com) to display BIFI's total supply and circulating supply

---

---

## Further Information

---

---

---

## License

[MIT](LICENSE).
