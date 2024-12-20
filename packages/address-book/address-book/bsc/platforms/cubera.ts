import { readCuberaConfigFromFileIfExists } from '../../../scripts/addressLoader';

const devMultisig = '0x44b74ED902e6423B51Bd9e44B6e5646749376943';
const treasuryMultisig = '0x7C780b8A63eE9B7d0F985E8a922Be38a1F7B2141';

const _cubera = {
  devMultisig,
  treasuryMultisig,
  strategyOwner: '0x65CF7E8C0d431f59787D07Fa1A9f8725bbC33F7E',
  vaultOwner: '0xA2E6391486670D2f1519461bcc915E4818aD1c9a',
  keeper: '0x4fED5491693007f0CD49f4614FFC38Ab6A04B619',
  treasurer: treasuryMultisig,
  launchpoolOwner: devMultisig,
  voter: '0x5e1caC103F943Cd84A1E92dAde4145664ebf692A',
  feeRecipient: '0xAb4e8665E7b0E6D83B65b8FF6521E347ca93E4F8',

  rewardPool: '0x0d5761D9181C7745855FC985f646a842EB254eB9',
  treasury: '0x4A32De8c248533C28904b24B4cFCFE18E9F2ad01',
  multicall: '0xB94858b0bB5437498F5453A16039337e5Fdc269C',
  feeConfig: '0x97F86f2dC863D98e423E288938dF257D1b6e1553',
  vaultFactory: '0xe596eC590DE52C09c8D1C7A1294B32F957A7c94e',
  gasPrice: '0x16cD932c494Ac1B3452d6C8453fB7665aB49EC6b',

  wrapperFactory: '0x85B792C67cEe281064eb7A3AF0Fe2A76E9a7849e',
  bifiMaxiStrategy: '0xE91f846aaD5dd1Bf8357907C6C2E4B2B30188051',
} as const;

export const cubera = readCuberaConfigFromFileIfExists('bsc', _cubera);
