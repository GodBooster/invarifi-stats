const devMultisig = '0x1db98f5D37E6e0E53DCb24F558F0410086920a6e';
const treasuryMultisig = '0x3E7F60B442CEAE0FE5e48e07EB85Cfb1Ed60e81A';

export const cubera = {
  devMultisig,
  treasuryMultisig,
  strategyOwner: '0xfcDD5a02C611ba6Fe2802f885281500EC95805d7',
  vaultOwner: '0xc8F3D9994bb1670F5f3d78eBaBC35FA8FdEEf8a2',
  keeper: '0x4fED5491693007f0CD49f4614FFC38Ab6A04B619',
  treasurer: treasuryMultisig,
  launchpoolOwner: devMultisig,
  rewardPool: '0x1198f78efd67DFc917510aaA07d49545f4B24f11',
  treasury: treasuryMultisig,
  feeRecipient: '0x00AeC34489A7ADE91A0507B6b9dBb0a50938B7c0',
  multicall: '0xC9F6b1B53E056fd04bE5a197ce4B2423d456B982',
  bifiMaxiStrategy: '0xb25eB9105549627050AAB3A1c909fBD454014beA',
  voter: '0x5e1caC103F943Cd84A1E92dAde4145664ebf692A',
  feeConfig: '0xeEaFF5116C09ECc20Ab72b53860A7ceAd97F0Ab4',
  vaultFactory: '0x6f6CE0f48481962599DdC6FDb0358c5849F06350',
} as const;
