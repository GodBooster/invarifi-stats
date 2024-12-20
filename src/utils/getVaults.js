import { appFetch } from './fetch';

const getVaults = async (vaultsEndpoint, includeGov = false) => {
  try {
    let vaults = await appFetch(vaultsEndpoint);
    vaults = includeGov ? vaults : vaults.filter(vault => !vault.isGovVault);
    return vaults;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

module.exports = getVaults;

// 55.28
