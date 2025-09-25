// API Response Types for Live Data Preview

export interface ChainTVL {
  chain: string;
  tvl: number;
  percentage: number;
}

export interface Protocol {
  id: string;
  name: string;
  tvl: number;
  marketShare: number;
  rank: number;
  growth7d: number;
  growth_1d: number;
  dominanceReason: string;
  category: string;
  chain: string;
  chains: string[];
  chainTvls: ChainTVL[];
}

export interface Recommendation {
  type: 'opportunity' | 'warning';
  description: string;
  confidence: number;
}

export interface Intelligence {
  insights: string[];
  recommendations: Recommendation[];
  dominanceShift: string;
  marketPhase: 'growth' | 'consolidation' | 'decline';
  volatility: string;
  marketSentiment: 'Bullish' | 'Bearish' | 'Neutral';
  volatilityIndex: number;
  riskScore: number;
  innovationAreas: string[];
}

export interface SectorAverage {
  tvl: number;
  growth7d: number;
  protocolsPerChain: number;
}

export interface HistoricalContext {
  allTimeHigh: number;
  yearToDate: number;
  marketCyclePhase: string;
}

export interface Benchmarks {
  sectorAverage: SectorAverage;
  chainComparison: any[];
  historicalContext: HistoricalContext;
}

export interface Trends {
  tvlGrowth7d: number;
  protocolsAdded7d: number;
  dominanceShift: string;
}

export interface TVLData {
  totalTvl: number;
  totalProtocols: number;
  dominantChain: string;
  chainDominance: number;
  growth_7d: number;
  growth_1d: number;
  topProtocols: Protocol[];
  trends: Trends;
}

export interface ResponseMetadata {
  requestId: string;
  responseTime: number;
  dataSource: string;
  calculatedAt: string;
  dataFreshness: number;
  methodology: string;
  coverage: number;
}

export interface TVLOverviewResponse {
  success: boolean;
  data: TVLData;
  intelligence: Intelligence;
  benchmarks: Benchmarks;
  metadata: ResponseMetadata;
}

// Chart-specific types
export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  count: number;
  avgGrowth: number;
  color: string;
}

export interface ProtocolChartData {
  name: string;
  tvl: number;
  marketShare: number;
  growth7d: number;
  growth_1d: number;
  category: string;
  color: string;
}

export interface GrowthChartData {
  name: string;
  x: number; // 7d growth
  y: number; // 1d growth
  size: number; // TVL
  category: string;
  color: string;
  marketShare: number;
}

// Filter types
export interface FilterState {
  category: string;
  growth: 'all' | 'positive' | 'negative' | 'stable';
  timeframe: '1d' | '7d';
  limit: number;
  chartType: 'categories' | 'top-protocols' | 'growth-trends' | 'chain-distribution';
}

// API parameter types
export interface APIFilters {
  category?: string;
  growth?: string;
  timeframe?: string;
  limit?: number;
  chain?: string;
}