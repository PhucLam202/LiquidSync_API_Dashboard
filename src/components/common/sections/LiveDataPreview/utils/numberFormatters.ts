/**
 * Utility functions for formatting numbers, currencies, and percentages
 */

/**
 * Format large numbers with appropriate suffixes (K, M, B, T)
 */
export const formatLargeNumber = (num: number): string => {
  if (num === 0) return '0';
  
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (abs >= 1e12) {
    return `${sign}${(abs / 1e12).toFixed(1)}T`;
  } else if (abs >= 1e9) {
    return `${sign}${(abs / 1e9).toFixed(1)}B`;
  } else if (abs >= 1e6) {
    return `${sign}${(abs / 1e6).toFixed(1)}M`;
  } else if (abs >= 1e3) {
    return `${sign}${(abs / 1e3).toFixed(1)}K`;
  }
  
  return `${sign}${abs.toFixed(0)}`;
};

/**
 * Format currency values with $ prefix
 */
export const formatCurrency = (num: number, includeDecimals: boolean = false): string => {
  if (num === 0) return '$0';
  
  const formatted = formatLargeNumber(num);
  return `$${formatted}`;
};

/**
 * Format TVL specifically (always show as currency)
 */
export const formatTVL = (tvl: number): string => {
  return formatCurrency(tvl);
};

/**
 * Format percentage values
 */
export const formatPercentage = (num: number, decimals: number = 1): string => {
  if (num === 0) return '0%';
  
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(decimals)}%`;
};

/**
 * Format growth rates with color coding info
 */
export const formatGrowth = (growth: number): { 
  value: string; 
  isPositive: boolean; 
  isNeutral: boolean; 
} => {
  const isPositive = growth > 0.5;
  const isNeutral = Math.abs(growth) <= 0.5;
  
  return {
    value: formatPercentage(growth),
    isPositive,
    isNeutral
  };
};

/**
 * Format market share
 */
export const formatMarketShare = (share: number): string => {
  if (share < 0.01) return '<0.01%';
  return `${share.toFixed(2)}%`;
};

/**
 * Format number with commas for large integers
 */
export const formatWithCommas = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
};

/**
 * Format time duration (for data freshness)
 */
export const formatDataAge = (seconds: number): string => {
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} day ago`;
};

/**
 * Format response time in milliseconds
 */
export const formatResponseTime = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

/**
 * Format API coverage percentage
 */
export const formatCoverage = (coverage: number): string => {
  return `${(coverage * 100).toFixed(1)}%`;
};

/**
 * Get appropriate decimal places based on number magnitude
 */
export const getDecimalPlaces = (num: number): number => {
  if (num >= 1000) return 0;
  if (num >= 100) return 1;
  if (num >= 10) return 2;
  return 3;
};

/**
 * Format number for chart tooltips with full precision
 */
export const formatTooltipValue = (value: number, type: 'currency' | 'percentage' | 'number'): string => {
  switch (type) {
    case 'currency':
      return `$${value.toLocaleString('en-US', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2 
      })}`;
    case 'percentage':
      return `${value.toFixed(2)}%`;
    case 'number':
      return value.toLocaleString('en-US');
    default:
      return value.toString();
  }
};