'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  Filter, 
  RefreshCw,
  Info 
} from 'lucide-react';

import { TVLOverviewResponse, APIFilters } from '../types/api.types';
import { 
  aggregateByCategory,
  transformProtocolsForBarChart,
  transformProtocolsForGrowthChart,
  filterProtocolsByCategory,
  filterProtocolsByGrowth,
  getUniqueCategories
} from '../utils/dataTransformers';

// Individual chart components
import CategoryDonutChart from './charts/CategoryDonutChart';
import ProtocolBarChart from './charts/ProtocolBarChart';
import GrowthScatterChart from './charts/GrowthScatterChart';
import MarketTrendsChart from './charts/MarketTrendsChart';

interface InteractiveChartsProps {
  data: TVLOverviewResponse | null;
  loading?: boolean;
  onFiltersChange?: (filters: APIFilters) => void;
  currentFilters?: APIFilters | null;
}

type ChartType = 'category' | 'protocols' | 'growth' | 'trends';

interface ChartFilter {
  category: string;
  growth: string;
  timeframe: string;
  limit: number;
}

const InteractiveCharts: React.FC<InteractiveChartsProps> = ({
  data,
  loading = false,
  onFiltersChange,
  currentFilters
}) => {
  const [activeChart, setActiveChart] = useState<ChartType>('category');
  const [localFilters, setLocalFilters] = useState<ChartFilter>({
    category: currentFilters?.category || 'all',
    growth: currentFilters?.growth || 'all',
    timeframe: currentFilters?.timeframe || '7d',
    limit: currentFilters?.limit || 10
  });

  // Process data based on filters
  const processedData = useMemo(() => {
    if (!data?.data) return null;

    const protocols = data.data.topProtocols || [];
    
    // Apply category filter
    const categoryFiltered = filterProtocolsByCategory(protocols, localFilters.category);
    
    // Apply growth filter
    const growthFiltered = filterProtocolsByGrowth(categoryFiltered, localFilters.growth as any);

    return {
      originalProtocols: protocols,
      filteredProtocols: growthFiltered,
      categoryData: aggregateByCategory(growthFiltered, data.data.totalTvl),
      barChartData: transformProtocolsForBarChart(growthFiltered, localFilters.limit),
      scatterData: transformProtocolsForGrowthChart(growthFiltered),
      categories: getUniqueCategories(protocols),
      totalTvl: data.data.totalTvl,
      intelligence: data.intelligence
    };
  }, [data, localFilters]);

  // Update filters and notify parent
  const handleFilterChange = (key: keyof ChartFilter, value: string | number) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    if (onFiltersChange) {
      onFiltersChange({
        category: newFilters.category !== 'all' ? newFilters.category : undefined,
        growth: newFilters.growth !== 'all' ? newFilters.growth : undefined,
        timeframe: newFilters.timeframe !== '7d' ? newFilters.timeframe : undefined,
        limit: newFilters.limit !== 10 ? newFilters.limit : undefined
      });
    }
  };

  // Chart configurations
  const chartConfigs = {
    category: {
      title: 'TVL by Category',
      description: 'Distribution of total value locked across DeFi categories',
      icon: <PieChart className="w-4 h-4" />
    },
    protocols: {
      title: 'Top Protocols',
      description: 'Leading protocols by total value locked',
      icon: <BarChart3 className="w-4 h-4" />
    },
    growth: {
      title: 'Growth Analysis',
      description: 'Protocol performance and growth correlation',
      icon: <TrendingUp className="w-4 h-4" />
    },
    trends: {
      title: 'Market Trends',
      description: 'Historical performance and market intelligence',
      icon: <TrendingUp className="w-4 h-4" />
    }
  };

  const currentConfig = chartConfigs[activeChart];

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Live Market Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Interactive data visualization powered by real-time DeFi API
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className="gap-1">
            <Filter className="w-3 h-3" />
            Filters
          </Badge>
          
          <Select 
            value={localFilters.category} 
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {processedData?.categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={localFilters.growth} 
            onValueChange={(value) => handleFilterChange('growth', value)}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Growth" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Growth</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={localFilters.timeframe} 
            onValueChange={(value) => handleFilterChange('timeframe', value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1D</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart Container */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentConfig.icon}
              <div>
                <CardTitle className="text-base">
                  {currentConfig.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentConfig.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {processedData && (
                <Badge variant="secondary" className="text-xs">
                  {processedData.filteredProtocols.length} protocols
                </Badge>
              )}
              
              {loading && (
                <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeChart} onValueChange={(value) => setActiveChart(value as ChartType)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="category" className="text-xs">
                Categories
              </TabsTrigger>
              <TabsTrigger value="protocols" className="text-xs">
                Protocols
              </TabsTrigger>
              <TabsTrigger value="growth" className="text-xs">
                Growth
              </TabsTrigger>
              <TabsTrigger value="trends" className="text-xs">
                Trends
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="category" className="mt-0">
                <CategoryDonutChart 
                  data={processedData?.categoryData || []}
                  loading={loading}
                  totalTvl={processedData?.totalTvl || 0}
                />
              </TabsContent>

              <TabsContent value="protocols" className="mt-0">
                <ProtocolBarChart 
                  data={processedData?.barChartData || []}
                  loading={loading}
                  limit={localFilters.limit}
                  onLimitChange={(limit) => handleFilterChange('limit', limit)}
                />
              </TabsContent>

              <TabsContent value="growth" className="mt-0">
                <GrowthScatterChart 
                  data={processedData?.scatterData || []}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="trends" className="mt-0">
                <MarketTrendsChart 
                  data={data?.intelligence}
                  loading={loading}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Chart Insights */}
      {processedData && !loading && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Market Insight</p>
                <p className="text-blue-700 mt-1">
                  {activeChart === 'category' && processedData.categoryData.length > 0 && 
                    `${processedData.categoryData[0].name} dominates with ${processedData.categoryData[0].percentage.toFixed(1)}% market share.`}
                  
                  {activeChart === 'protocols' && processedData.barChartData.length > 0 &&
                    `Top protocol ${processedData.barChartData[0].name} holds ${processedData.barChartData[0].marketShare.toFixed(2)}% of total market.`}
                  
                  {activeChart === 'growth' && 
                    `Analyzing ${processedData.scatterData.length} major protocols (>$1B TVL) for growth correlations.`}
                  
                  {activeChart === 'trends' && data?.intelligence &&
                    `Market shows ${data.intelligence.marketSentiment} sentiment with ${data.intelligence.volatilityIndex.toFixed(1)} volatility index.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveCharts;