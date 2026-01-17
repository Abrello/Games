
export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  password?: string;
  balance: number;
  role: 'PLAYER' | 'ADMIN';
  fullName?: string;
  lastActive?: number;
  profilePicture?: string;
  inviteCode?: string;
  isSuspended?: boolean;
  isVerified?: boolean;
  isWalletFrozen?: boolean;
  bettingLimit?: number;
  lastLogin?: number;
}

export enum VirtualGameType {
  DICE = 'Dice Duel',
  COLOR = 'Green/Yellow',
  AVIATOR = 'Aviator',
  JETX = 'JetX',
  WALKER = 'Walker Man'
}

export interface GameOutcome {
  id: string;
  gameType: VirtualGameType;
  timestamp: string;
  betAmount: number;
  payout: number;
  status: 'WIN' | 'LOSS';
  details: string;
}

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';
export type TransactionType = 'DEPOSIT' | 'WITHDRAW';

export interface Transaction {
  id: string;
  userId: string;
  userPhone: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: string;
  screenshot?: string;
  refId?: string;
  bankName?: string;
  accountNumber?: string;
  fullName?: string;
}

export type ViewState = 'GAMES' | 'WALLET' | 'AUTH' | 'HISTORY' | 'ADMIN' | 'PROFILE' | 'INVITE' | 'USERS' | 'LANDING';

export interface Game {
  id: string;
  sport: string;
  league: string;
  teamA: string;
  teamB: string;
  startTime: string;
  oddsA: number;
  oddsDraw?: number;
  oddsB: number;
  isDisabled?: boolean;
  isLocked?: boolean;
  margin?: number;
}

export interface Bet {
  id: string;
  selection: 'A' | 'Draw' | 'B';
  amount: number;
  odds: number;
  teamNames: string;
}
