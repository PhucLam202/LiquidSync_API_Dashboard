import { Protocol, CategoryData, ProtocolChartData, GrowthChartData } from '../types/api.types';
import { CATEGORY_COLORS } from '../types/chart.types';

/**
 * Get color for a given category
 */
export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
};

/**
 * Aggregate protocols by category for donut chart
 */
export const aggregateByCategory = (protocols: Protocol[], totalTvl: number): CategoryData[] => {
  const categoryMap = protocols.reduce((acc, protocol) => {
    const category = protocol.category;
    if (!acc[category]) {
      acc[category] = { 
        tvl: 0, 
        count: 0, 
        totalGrowth7d: 0,
        totalGrowth1d: 0
      };
    }
    acc[category].tvl += protocol.tvl;
    acc[category].count += 1;
    acc[category].totalGrowth7d += protocol.growth7d;
    acc[category].totalGrowth1d += protocol.growth_1d;
    return acc;
  }, {} as Record<string, { tvl: number; count: number; totalGrowth7d: number; totalGrowth1d: number }>);

  return Object.entries(categoryMap)
    .map(([name, data]) => ({
      name,
      value: data.tvl,
      percentage: (data.tvl / totalTvl) * 100,
      count: data.count,
      avgGrowth: data.totalGrowth7d / data.count,
      color: getCategoryColor(name)
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Transform protocols for bar chart display
 */
export const transformProtocolsForBarChart = (protocols: Protocol[], limit: number = 10): ProtocolChartData[] => {
  return protocols
    .slice(0, limit)
    .map(protocol => ({
      name: protocol.name.length > 20 ? `${protocol.name.substring(0, 20)}...` : protocol.name,
      tvl: protocol.tvl,
      marketShare: protocol.marketShare,
      growth7d: protocol.growth7d,
      growth_1d: protocol.growth_1d,
      category: protocol.category,
      color: getCategoryColor(protocol.category)
    }));
};

/**
 * Transform protocols for growth scatter plot
 */
export const transformProtocolsForGrowthChart = (protocols: Protocol[]): GrowthChartData[] => {
  return protocols
    .filter(protocol => protocol.tvl > 1000000000) // Only protocols with >$1B TVL
    .map(protocol => ({
      name: protocol.name,
      x: protocol.growth7d,      // 7-day growth (X-axis)
      y: protocol.growth_1d,     // 1-day growth (Y-axis) 
      size: Math.log10(protocol.tvl) * 10, // Logarithmic scaling for bubble size
      category: protocol.category,
      color: getCategoryColor(protocol.category),
      marketShare: protocol.marketShare
    }));
};

/**
 * Filter protocols based on growth criteria
 */
export const filterProtocolsByGrowth = (
  protocols: Protocol[], 
  growthFilter: 'all' | 'positive' | 'negative' | 'stable'
): Protocol[] => {
  if (growthFilter === 'all') return protocols;
  
  return protocols.filter(protocol => {
    const growth7d = protocol.growth7d;
    
    switch (growthFilter) {
      case 'positive':
        return growth7d > 2; // More than 2% growth
      case 'negative':
        return growth7d < -2; // More than 2% decline
      case 'stable':
        return Math.abs(growth7d) <= 2; // Between -2% and +2%
      default:
        return true;
    }
  });
};

/**
 * Filter protocols by category
 */
export const filterProtocolsByCategory = (protocols: Protocol[], category: string): Protocol[] => {
  if (category === 'all') return protocols;
  return protocols.filter(protocol => protocol.category.toLowerCase() === category.toLowerCase());
};

/**
 * Get unique categories from protocols
 */
export const getUniqueCategories = (protocols: Protocol[]): string[] => {
  const categories = [...new Set(protocols.map(p => p.category))];
  return categories.sort();
};

/**
 * Calculate category statistics
 */
export const getCategoryStats = (protocols: Protocol[], category: string) => {
  const categoryProtocols = filterProtocolsByCategory(protocols, category);
  
  if (categoryProtocols.length === 0) {
    return {
      totalTvl: 0,
      count: 0,
      avgGrowth7d: 0,
      avgGrowth1d: 0,
      topProtocol: null
    };
  }

  const totalTvl = categoryProtocols.reduce((sum, p) => sum + p.tvl, 0);
  const avgGrowth7d = categoryProtocols.reduce((sum, p) => sum + p.growth7d, 0) / categoryProtocols.length;
  const avgGrowth1d = categoryProtocols.reduce((sum, p) => sum + p.growth_1d, 0) / categoryProtocols.length;
  const topProtocol = categoryProtocols.reduce((top, current) => 
    current.tvl > top.tvl ? current : top
  );

  return {
    totalTvl,
    count: categoryProtocols.length,
    avgGrowth7d,
    avgGrowth1d,
    topProtocol
  };
};