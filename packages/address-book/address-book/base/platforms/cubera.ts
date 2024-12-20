import { readCuberaConfigFromFileIfExists } from '../../../scripts/addressLoader';

const devMultisig = '0x6FfaCA7C3B38Ec2d631D86e15f328ee6eF6C6226';
const treasuryMultisig = '0x1A07DceEfeEbBA3D1873e2B92BeF190d2f11C3cB';

const _cubera = {
  devMultisig: devMultisig,
  treasuryMultisig: treasuryMultisig,
  strategyOwner: '0x3B60F7f25b09E71356cdFFC6475c222A466a2AC9',
  vaultOwner: '0x09D19184F46A32213DF06b981122e06882B61309',
  keeper: '0x4fED5491693007f0CD49f4614FFC38Ab6A04B619',
  treasurer: treasuryMultisig,
  launchpoolOwner: devMultisig,
  voter: '0x5e1caC103F943Cd84A1E92dAde4145664ebf692A',
  feeRecipient: treasuryMultisig,

  rewardPool: '0x0000000000000000000000000000000000000000',
  treasury: treasuryMultisig,
  multicall: '0xbA790ec6F95D68123E772A43b314464585B311b4',
  feeConfig: '0xfc69704cC3cAac545cC7577009Ea4AA04F1a61Eb',

  vaultFactory: '0xBC4a342B0c057501E081484A2d24e576E854F823',

  maxiStrategy: '0x0000000000000000000000000000000000000000',
} as const;

export const cubera = readCuberaConfigFromFileIfExists('base', _cubera);
