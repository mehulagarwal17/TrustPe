export type GiftStatus = 'Locked' | 'Released' | 'Cancelled';
export type CardTheme = 'neon-purple' | 'cyber-gold' | 'emerald-builder' | 'sakura-frost';

export interface MilestoneStage {
  id: number;
  title: string;
  percentage: number; // e.g. 30 for 30%
  amountMon: string;
  isCompleted: boolean;
  completedAt?: number;
  txHash?: string;
  confirmationTimeMs?: number;
}

export interface GiftItem {
  id: string; // BigInt serialized as string for safe state handling
  creator: `0x${string}`;
  recipient: `0x${string}`;
  triggerAuthority: `0x${string}`;
  amount: string; // formatted in MON (e.g. "2.5")
  amountWei: string;
  description: string;
  status: GiftStatus;
  createdAt: number; // unix timestamp
  releasedAt: number; // unix timestamp
  creationTxHash?: string;
  releaseTxHash?: string;
  confirmationTimeMs?: number; // Monad sub-second latency in ms
  blockNumber?: number;
  theme?: CardTheme;
  deadlineTimestamp?: number; // optional unix timestamp
  stages?: MilestoneStage[]; // optional progressive tranches
  category?: 'hackathon' | 'opensource' | 'education' | 'grant' | 'personal';
}

export interface DemoPersona {
  name: string;
  role: 'mentor' | 'student' | 'judge';
  title: string;
  address: `0x${string}`;
  balance: string;
  avatar: string;
}

export interface NetworkStats {
  chainId: number;
  blockNumber: number;
  gasPriceGwei: string;
  slotTimeSec: number;
  tpsPeak: string;
  rpcStatus: 'online' | 'syncing' | 'offline';
  lastPingMs: number;
}

export interface TxSpeedRecord {
  type: 'create' | 'release';
  giftId: string;
  txHash: string;
  durationMs: number;
  blockNumber: number;
  timestamp: number;
  amountMon: string;
}
