/**
 * LST (Liquid Staking) Focused Types for TVL Dashboard
 * Handles Ethereum liquid staking protocol data processing
 */

import { Protocol, TVLData } from './api.types';

// LST Protocol with Ethereum-specific calculations
export interface LSTProtocol {
  id: string;
  name: string;
  category: string;
  /** Total TVL across all chains */
  totalTvl: number;
  /** TVL specifically on Ethereum */
  ethereumTvl: number;
  /** Market share percentage */
  marketShare: number;
  /** 7-day growth percentage */
  growth7d: number;
  /** 1-day growth percentage */
  growth_1d: number;
  /** Whether protocol is multi-chain */
  isMultiChain: boolean;
  /** All supported chains */
  chains: string[];
  /** Chain-specific TVL breakdown */
  chainTvls: Array<{
    chain: string;
    tvl: number;
    percentage: number;
  }>;
}

// Aggregated LST market data for Ethereum
export interface LSTMarketData {
  /** Total TVL on Ethereum (all protocols) */
  ethereumTotalTvl: number;
  /** Total LST TVL on Ethereum */
  lstTotalTvl: number;
  /** LST percentage of Ethereum TVL */
  lstMarketShare: number;
  /** Top 3 LST protocols on Ethereum */
  topProtocols: LSTProtocol[];
  /** Other LST protocols aggregated */
  otherProtocols: {
    count: number;
    totalTvl: number;
    marketShare: number;
  };
  /** Best performing LST protocol by 7d growth */
  topMover: LSTProtocol | null;
  /** Market metrics */
  totalProtocols: number;
  lastUpdated?: Date;
}

// Chart data for donut visualization
export interface LSTChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
  isOther?: boolean;
}

// Display formatting options
export interface LSTDisplayOptions {
  /** Number format: compact (K, M, B) or full */
  numberFormat: 'compact' | 'full';
  /** Decimal places for percentages */
  percentDecimals: number;
  /** Decimal places for currency */
  currencyDecimals: number;
  /** Show growth indicators with colors */
  showGrowthColors: boolean;
}

// Utility functions return types
export interface FormattedCurrency {
  value: string;
  prefix: string;
  suffix: string;
}

export interface FormattedPercentage {
  value: string;
  isPositive: boolean;
  colorClass: string;
}

// LST category detection constants
export const LST_CATEGORIES = [
  'Liquid Staking',
  'Liquid Restaking',
  'Staking',
  'Restaking'
] as const;

export type LSTCategory = typeof LST_CATEGORIES[number];

// Protocol name mappings for known LST providers
export const LST_PROTOCOL_NAMES = {
  'lido': 'Lido',
  'binance': 'Binance staked ETH', 
  'ether.fi': 'ether.fi Stake',
  'rocket-pool': 'Rocket Pool',
  'frax': 'Frax Ether',
  'mantle': 'Mantle LSP',
  'coinbase': 'Coinbase Wrapped Staked ETH'
} as const;