const devMultisig = '0x7cA9E76141493Fd3B12C0376130158779fB9f8b9';
const treasuryMultisig = '0x088C70Ddff3a3774825dd5e5EaDB356404248d83';

export const cubera = {
  devMultisig,
  treasuryMultisig,
  strategyOwner: '0x2d04969ED7D1b186797C44dF5F5634Eb9C89aF6b',
  vaultOwner: '0x19642aDA958632f5e574A6d13eAd0679BD435c20',
  keeper: '0x4fED5491693007f0CD49f4614FFC38Ab6A04B619',
  treasurer: treasuryMultisig,
  launchpoolOwner: devMultisig,
  rewardPool: '0xE6ab45f5e93FA377D0c4cC097187Ab7256c2AEBf',
  treasury: '0x8c2d54BA94f4638f1bb91f623F378B66d6023324',
  feeRecipient: '0x9dA9f3C6c45F1160b53D395b0A982aEEE1D212fE',
  multicall: '0x1198f78efd67DFc917510aaA07d49545f4B24f11',
  bifiMaxiStrategy: '0x22b3d90BDdC3Ad5F2948bE3914255C64Ebc8c9b3',
  voter: '0x5e1caC103F943Cd84A1E92dAde4145664ebf692A',
  feeConfig: '0xD5431d39858A86c78d72541a58acFC37b793b91d',
} as const;
