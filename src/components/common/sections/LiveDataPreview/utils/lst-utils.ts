/**
 * LST (Liquid Staking) Data Processing Utilities
 * Handles extraction, aggregation, and formatting of liquid staking data
 */

import { Protocol, TVLData } from '../types/api.types';
import { 
  LSTProtocol, 
  LSTMarketData, 
  LSTChartData, 
  LST_CATEGORIES,
  FormattedCurrency,
  FormattedPercentage,
  LSTDisplayOptions 
} from '../types/lst.types';

/**
 * Check if a protocol is LST-related based on category
 */
export function isLSTProtocol(protocol: Protocol): boolean {
  if (!protocol.category) return false;
  
  const category = protocol.category.toLowerCase();
  return LST_CATEGORIES.some(lstCategory => 
    category.includes(lstCategory.toLowerCase())
  );
}

/**
 * Extract Ethereum TVL from protocol's chainTvls
 */
export function getEthereumTvl(protocol: Protocol): number {
  if (!protocol.chainTvls || protocol.chainTvls.length === 0) {
    // Fallback: if no chainTvls and chain is Ethereum, use total TVL
    return protocol.chain === 'Ethereum' ? protocol.tvl : 0;
  }
  
  const ethereumChain = protocol.chainTvls.find(
    chainTvl => chainTvl.chain.toLowerCase() === 'ethereum'
  );
  
  return ethereumChain?.tvl || 0;
}

/**
 * Convert Protocol to LSTProtocol with Ethereum calculations
 */
export function convertToLSTProtocol(protocol: Protocol): LSTProtocol {
  const ethereumTvl = getEthereumTvl(protocol);
  const isMultiChain = protocol.chains && protocol.chains.length > 1;
  
  return {
    id: protocol.id,
    name: protocol.name,
    category: protocol.category,
    totalTvl: protocol.tvl,
    ethereumTvl,
    marketShare: protocol.marketShare,
    growth7d: protocol.growth7d || 0,
    growth_1d: protocol.growth_1d || 0,
    isMultiChain: isMultiChain || false,
    chains: protocol.chains || [protocol.chain],
    chainTvls: protocol.chainTvls || []
  };
}

/**
 * Extract and process LST protocols from TVL data
 */
export function extractLSTProtocols(tvlData: TVLData): LSTProtocol[] {
  if (!tvlData.topProtocols) return [];
  
  return tvlData.topProtocols
    .filter(isLSTProtocol)
    .map(convertToLSTProtocol)
    .filter(protocol => protocol.ethereumTvl > 0) // Only protocols with Ethereum TVL
    .sort((a, b) => b.ethereumTvl - a.ethereumTvl); // Sort by Ethereum TVL descending
}

/**
 * Calculate total Ethereum TVL across all protocols
 */
export function calculateEthereumTotalTvl(tvlData: TVLData): number {
  // If dominant chain is Ethereum, use total TVL as approximation
  if (tvlData.dominantChain === 'Ethereum') {
    return tvlData.totalTvl;
  }
  
  // Otherwise, sum up all Ethereum TVL from protocols
  if (!tvlData.topProtocols) return 0;
  
  return tvlData.topProtocols
    .map(getEthereumTvl)
    .reduce((sum, tvl) => sum + tvl, 0);
}

/**
 * Process TVL data into LST market overview
 */
export function processLSTMarketData(tvlData: TVLData, lastUpdated?: Date): LSTMarketData {
  const lstProtocols = extractLSTProtocols(tvlData);
  const ethereumTotalTvl = calculateEthereumTotalTvl(tvlData);
  
  // Calculate total LST TVL on Ethereum
  const lstTotalTvl = lstProtocols
    .reduce((sum, protocol) => sum + protocol.ethereumTvl, 0);
  
  // Get top 3 and others
  const top3Protocols = lstProtocols.slice(0, 3);
  const otherProtocols = lstProtocols.slice(3);
  const otherTotalTvl = otherProtocols.reduce((sum, p) => sum + p.ethereumTvl, 0);
  
  // Find best performer by 7d growth
  const topMover = lstProtocols.length > 0 
    ? lstProtocols.reduce((best, current) => 
        current.growth7d > best.growth7d ? current : best
      )
    : null;
  
  return {
    ethereumTotalTvl,
    lstTotalTvl,
    lstMarketShare: ethereumTotalTvl > 0 ? (lstTotalTvl / ethereumTotalTvl) * 100 : 0,
    topProtocols: top3Protocols,
    otherProtocols: {
      count: otherProtocols.length,
      totalTvl: otherTotalTvl,
      marketShare: lstTotalTvl > 0 ? (otherTotalTvl / lstTotalTvl) * 100 : 0
    },
    topMover,
    totalProtocols: tvlData.totalProtocols,
    lastUpdated
  };
}

/**
 * Format currency with compact notation (K, M, B)
 */
export function formatCompactCurrency(
  amount: number, 
  decimals: number = 1
): FormattedCurrency {
  if (amount === 0) {
    return { value: '0', prefix: '$', suffix: '' };
  }
  
  const absAmount = Math.abs(amount);
  let value: string;
  let suffix: string;
  
  if (absAmount >= 1e9) {
    value = (amount / 1e9).toFixed(decimals);
    suffix = 'B';
  } else if (absAmount >= 1e6) {
    value = (amount / 1e6).toFixed(decimals);
    suffix = 'M';
  } else if (absAmount >= 1e3) {
    value = (amount / 1e3).toFixed(decimals);
    suffix = 'K';
  } else {
    value = amount.toFixed(decimals);
    suffix = '';
  }
  
  // Remove unnecessary trailing zeros
  value = parseFloat(value).toString();
  
  return {
    value,
    prefix: '$',
    suffix
  };
}

/**
 * Format percentage with growth indicators
 */
export function formatGrowthPercentage(
  percentage: number, 
  decimals: number = 1,
  showColors: boolean = true
): FormattedPercentage {
  const isPositive = percentage >= 0;
  const sign = isPositive ? '+' : '';
  const value = `${sign}${percentage.toFixed(decimals)}%`;
  
  let colorClass = '';
  if (showColors) {
    colorClass = isPositive ? 'text-emerald-600' : 'text-red-600';
  }
  
  return {
    value,
    isPositive,
    colorClass
  };
}

/**
 * Generate chart data for donut visualization
 */
export function generateLSTChartData(
  lstMarketData: LSTMarketData,
  colors: string[] = ['#FF8A66', '#FF6B47', '#FF4C28', '#E0E7FF']
): LSTChartData[] {
  const { topProtocols, otherProtocols, lstTotalTvl } = lstMarketData;
  
  const chartData: LSTChartData[] = [];
  
  // Add top 3 protocols
  topProtocols.forEach((protocol, index) => {
    if (protocol.ethereumTvl > 0) {
      chartData.push({
        name: protocol.name,
        value: protocol.ethereumTvl,
        percentage: (protocol.ethereumTvl / lstTotalTvl) * 100,
        color: colors[index] || colors[colors.length - 1],
        isOther: false
      });
    }
  });
  
  // Add "Other" if there are more protocols
  if (otherProtocols.count > 0 && otherProtocols.totalTvl > 0) {
    chartData.push({
      name: `Other (${otherProtocols.count})`,
      value: otherProtocols.totalTvl,
      percentage: (otherProtocols.totalTvl / lstTotalTvl) * 100,
      color: colors[colors.length - 1],
      isOther: true
    });
  }
  
  return chartData;
}

/**
 * Get display-friendly protocol name with fallbacks
 */
export function getDisplayProtocolName(protocol: LSTProtocol): string {
  // Handle specific known protocols
  const name = protocol.name.toLowerCase();
  
  if (name.includes('lido')) return 'Lido';
  if (name.includes('binance') && name.includes('staked')) return 'Binance staked ETH';
  if (name.includes('ether.fi')) return 'ether.fi Stake';
  if (name.includes('rocket')) return 'Rocket Pool';
  if (name.includes('frax')) return 'Frax Ether';
  if (name.includes('coinbase') && name.includes('wrapped')) return 'Coinbase Wrapped Staked ETH';
  
  // Fallback to original name
  return protocol.name;
}

/**
 * Default display options
 */
export const DEFAULT_LST_DISPLAY_OPTIONS: LSTDisplayOptions = {
  numberFormat: 'compact',
  percentDecimals: 1,
  currencyDecimals: 1,
  showGrowthColors: true
};

/**
 * Validate LST market data for display
 */
export function validateLSTMarketData(data: LSTMarketData): boolean {
  return (
    data.ethereumTotalTvl > 0 &&
    data.lstTotalTvl > 0 &&
    data.topProtocols.length > 0 &&
    data.lstMarketShare > 0
  );
}

/**
 * Generate tooltip content for protocol hover
 */
export function generateProtocolTooltipContent(protocol: LSTProtocol): string {
  const totalTvl = formatCompactCurrency(protocol.totalTvl);
  const growth1d = formatGrowthPercentage(protocol.growth_1d);
  const chains = protocol.chains.join(', ');
  
  return `
    <div class="text-sm">
      <div class="font-medium">${getDisplayProtocolName(protocol)}</div>
      <div class="text-xs text-muted-foreground mt-1">
        <div>Total TVL: ${totalTvl.prefix}${totalTvl.value}${totalTvl.suffix}</div>
        <div>Chains: ${chains}</div>
        <div>1d Growth: ${growth1d.value}</div>
      </div>
    </div>
  `.trim();
}