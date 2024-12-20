const MasterChefJoeV3 = [
  {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [
      {
        type: 'address',
        name: '_MASTER_CHEF_V2',
        internalType: 'contract IMasterChef',
      },
      {
        type: 'address',
        name: '_joe',
        internalType: 'contract IERC20',
      },
      {
        type: 'uint256',
        name: '_MASTER_PID',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'event',
    name: 'Add',
    inputs: [
      {
        type: 'uint256',
        name: 'pid',
        internalType: 'uint256',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'allocPoint',
        internalType: 'uint256',
        indexed: false,
      },
      {
        type: 'address',
        name: 'lpToken',
        internalType: 'contract IERC20',
        indexed: true,
      },
      {
        type: 'address',
        name: 'rewarder',
        internalType: 'contract IRewarder',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Deposit',
    inputs: [
      {
        type: 'address',
        name: 'user',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'pid',
        internalType: 'uint256',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EmergencyWithdraw',
    inputs: [
      {
        type: 'address',
        name: 'user',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'pid',
        internalType: 'uint256',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Harvest',
    inputs: [
      {
        type: 'address',
        name: 'user',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'pid',
        internalType: 'uint256',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Init',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        type: 'address',
        name: 'previousOwner',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'address',
        name: 'newOwner',
        internalType: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Set',
    inputs: [
      {
        type: 'uint256',
        name: 'pid',
        internalType: 'uint256',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'allocPoint',
        internalType: 'uint256',
        indexed: false,
      },
      {
        type: 'address',
        name: 'rewarder',
        internalType: 'contract IRewarder',
        indexed: true,
      },
      {
        type: 'bool',
        name: 'overwrite',
        internalType: 'bool',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UpdatePool',
    inputs: [
      {
        type: 'uint256',
        name: 'pid',
        internalType: 'uint256',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'lastRewardTimestamp',
        internalType: 'uint256',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'lpSupply',
        internalType: 'uint256',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'accJoePerShare',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Withdraw',
    inputs: [
      {
        type: 'address',
        name: 'user',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'pid',
        internalType: 'uint256',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'contract IERC20',
      },
    ],
    name: 'JOE',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'contract IMasterChef',
      },
    ],
    name: 'MASTER_CHEF_V2',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'MASTER_PID',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'add',
    inputs: [
      {
        type: 'uint256',
        name: 'allocPoint',
        internalType: 'uint256',
      },
      {
        type: 'address',
        name: '_lpToken',
        internalType: 'contract IERC20',
      },
      {
        type: 'address',
        name: '_rewarder',
        internalType: 'contract IRewarder',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'deposit',
    inputs: [
      {
        type: 'uint256',
        name: 'pid',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'emergencyWithdraw',
    inputs: [
      {
        type: 'uint256',
        name: 'pid',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'harvestFromMasterChef',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'init',
    inputs: [
      {
        type: 'address',
        name: 'dummyToken',
        internalType: 'contract IERC20',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
    ],
    name: 'joePerSec',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'massUpdatePools',
    inputs: [
      {
        type: 'uint256[]',
        name: 'pids',
        internalType: 'uint256[]',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    name: 'owner',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: 'pendingJoe',
        internalType: 'uint256',
      },
      {
        type: 'address',
        name: 'bonusTokenAddress',
        internalType: 'address',
      },
      {
        type: 'string',
        name: 'bonusTokenSymbol',
        internalType: 'string',
      },
      {
        type: 'uint256',
        name: 'pendingBonusToken',
        internalType: 'uint256',
      },
    ],
    name: 'pendingTokens',
    inputs: [
      {
        type: 'uint256',
        name: '_pid',
        internalType: 'uint256',
      },
      {
        type: 'address',
        name: '_user',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: 'lpToken',
        internalType: 'contract IERC20',
      },
      {
        type: 'uint256',
        name: 'accJoePerShare',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'lastRewardTimestamp',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'allocPoint',
        internalType: 'uint256',
      },
      {
        type: 'address',
        name: 'rewarder',
        internalType: 'contract IRewarder',
      },
    ],
    name: 'poolInfo',
    inputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: 'pools',
        internalType: 'uint256',
      },
    ],
    name: 'poolLength',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'renounceOwnership',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'set',
    inputs: [
      {
        type: 'uint256',
        name: '_pid',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: '_allocPoint',
        internalType: 'uint256',
      },
      {
        type: 'address',
        name: '_rewarder',
        internalType: 'contract IRewarder',
      },
      {
        type: 'bool',
        name: 'overwrite',
        internalType: 'bool',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'totalAllocPoint',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'transferOwnership',
    inputs: [
      {
        type: 'address',
        name: 'newOwner',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updatePool',
    inputs: [
      {
        type: 'uint256',
        name: 'pid',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'rewardDebt',
        internalType: 'uint256',
      },
    ],
    name: 'userInfo',
    inputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'withdraw',
    inputs: [
      {
        type: 'uint256',
        name: 'pid',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
    ],
  },
] as const;

export default MasterChefJoeV3;
