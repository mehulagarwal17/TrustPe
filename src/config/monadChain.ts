import { defineChain } from 'viem';
import { DemoPersona } from '../types';

// Monad Testnet Chain definition for Viem / Wagmi
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MonadVision Explorer',
      url: 'https://testnet.monadvision.com',
    },
  },
  testnet: true,
});

export const MONAD_CHAIN_ID = 10143;
export const MONAD_RPC_URL = 'https://testnet-rpc.monad.xyz';
export const MONAD_EXPLORER_URL = 'https://testnet.monadvision.com';
export const MONAD_FAUCET_URL = 'https://faucet.monad.xyz';

// Default Hackathon Deployed Contract (Monad Testnet)
export const DEFAULT_GIFT_LOCK_ADDRESS: `0x${string}` = '0x836EF910143B1172A4E0B4961556C4293Fa0B143';

// Complete GiftLock ABI
export const GIFT_LOCK_ABI = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createGift',
    inputs: [
      { name: 'recipient', type: 'address', internalType: 'address' },
      { name: 'description', type: 'string', internalType: 'string' },
      { name: 'customTrigger', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: 'giftId', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'createGift',
    inputs: [
      { name: 'recipient', type: 'address', internalType: 'address' },
      { name: 'description', type: 'string', internalType: 'string' },
    ],
    outputs: [{ name: 'giftId', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'markMilestoneComplete',
    inputs: [{ name: 'giftId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getGift',
    inputs: [{ name: 'giftId', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct GiftLock.Gift',
        components: [
          { name: 'id', type: 'uint256', internalType: 'uint256' },
          { name: 'creator', type: 'address', internalType: 'address' },
          { name: 'recipient', type: 'address', internalType: 'address' },
          { name: 'triggerAuthority', type: 'address', internalType: 'address' },
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
          { name: 'description', type: 'string', internalType: 'string' },
          { name: 'status', type: 'uint8', internalType: 'enum GiftLock.GiftStatus' },
          { name: 'createdAt', type: 'uint256', internalType: 'uint256' },
          { name: 'releasedAt', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getGiftsByAddress',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [
      { name: 'created', type: 'uint256[]', internalType: 'uint256[]' },
      { name: 'received', type: 'uint256[]', internalType: 'uint256[]' },
      { name: 'triggered', type: 'uint256[]', internalType: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalGifts',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'GiftCreated',
    inputs: [
      { name: 'giftId', type: 'uint256', indexed: true, internalType: 'uint256' },
      { name: 'creator', type: 'address', indexed: true, internalType: 'address' },
      { name: 'recipient', type: 'address', indexed: true, internalType: 'address' },
      { name: 'triggerAuthority', type: 'address', indexed: false, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'description', type: 'string', indexed: false, internalType: 'string' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GiftReleased',
    inputs: [
      { name: 'giftId', type: 'uint256', indexed: true, internalType: 'uint256' },
      { name: 'recipient', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
] as const;

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    name: 'Prof. Vikram (Mentor)',
    role: 'mentor',
    title: 'Hackathon Mentor & Funder',
    address: '0x71C8A9b0D6213A6f0C132E904B4b51A1865F3498',
    balance: '42.50',
    avatar: '👨‍🏫',
  },
  {
    name: 'Aanya (Student)',
    role: 'student',
    title: 'Monad Blitz Builder',
    address: '0x3AfE7820dC31F2A84c47864B29E3063548972219',
    balance: '15.20',
    avatar: '👩‍🎓',
  },
  {
    name: 'Monad Judge Council',
    role: 'judge',
    title: 'Independent Milestone Verifier',
    address: '0x89bA64A7E004bF28e18820B1309Ac566089333C1',
    balance: '100.00',
    avatar: '🏛️',
  },
];
