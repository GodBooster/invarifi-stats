import { readCuberaConfigFromFileIfExists } from '../../../scripts/addressLoader';

const devMultisig = '0x09dc95959978800E57464E962724a34Bb4Ac1253';
const treasuryMultisig = '0xe37dD9A535c1D3c9fC33e3295B7e08bD1C42218D';

const _cubera = {
  devMultisig,
  treasuryMultisig,
  strategyOwner: '0x6fd13191539e0e13B381e1a3770F28D96705ce91',
  vaultOwner: '0x94A9D4d38385C7bD5715A2068D69B87FF81F4BF3',
  keeper: '0x4fED5491693007f0CD49f4614FFC38Ab6A04B619',
  treasurer: treasuryMultisig,
  launchpoolOwner: devMultisig,
  rewardPool: '0xDeB0a777ba6f59C78c654B8c92F80238c8002DD2',
  treasury: '0x09EF0e7b555599A9F810789FfF68Db8DBF4c51a0',
  feeRecipient: '0x7313533ed72D2678bFD9393480D0A30f9AC45c1f',
  multicall: '0xC3821F0b56FA4F4794d5d760f94B812DE261361B',
  bifiMaxiStrategy: '0x65490c2de729016621d6F6cf583d20dD9288580A',
  feeConverterETHtoWMATIC: '0x166Ea67fA3F2257B9bafF28AaF006D33674acA7e',
  vaultRegistry: '0x820cE73c7F15C2b828aBE79670D7e61731AB93Be',
  voter: '0x5e1caC103F943Cd84A1E92dAde4145664ebf692A',
  gaugeStaker: '0xe37dD9A535c1D3c9fC33e3295B7e08bD1C42218D',
  feeConfig: '0x8E98004FE65A2eAdA63AD1DE0F5ff76d845f14E7',
  vaultFactory: '0x5a7Bdd60d6004aaED4C06cA16434f4b657d76C3D',
  wrapperFactory: '0x7e778f4cF8c7C43FB2F3C9C0b4Ce7CB7c2bad978',
} as const;

export const cubera = readCuberaConfigFromFileIfExists('polygon', _cubera);
