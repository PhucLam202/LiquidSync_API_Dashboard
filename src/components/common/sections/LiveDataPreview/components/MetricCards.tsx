'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Activity, Globe, DollarSign, Users, Zap } from 'lucide-react';
import { TVLOverviewResponse } from '../types/api.types';
import { 
  formatTVL, 
  formatWithCommas, 
  formatGrowth, 
  formatDataAge, 
  formatResponseTime 
} from '../utils/numberFormatters';

interface MetricCardsProps {
  data: TVLOverviewResponse | null;
  loading?: boolean;
  lastUpdated?: Date;
  responseTime?: number;
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  growth?: number;
  icon: React.ReactNode;
  loading?: boolean;
  highlight?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  growth, 
  icon, 
  loading = false,
  highlight = false 
}) => {
  const growthData = growth !== undefined ? formatGrowth(growth) : null;

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      highlight ? 'border-[#FF8A66] shadow-md' : 'hover:border-[#FF8A66]/50'
    } ${loading ? 'animate-pulse' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${highlight ? 'bg-[#FF8A66]/10' : 'bg-muted/50'}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {loading ? (
            <div className="h-8 bg-muted rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-bold tracking-tight">
              {value}
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
            
            {growthData && (
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  growthData.isPositive 
                    ? 'text-emerald-600 border-emerald-200 bg-emerald-50' 
                    : growthData.isNeutral
                    ? 'text-gray-600 border-gray-200 bg-gray-50'
                    : 'text-red-600 border-red-200 bg-red-50'
                }`}
              >
                {growthData.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : growthData.isNeutral ? (
                  <Minus className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {growthData.value}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MetricCards: React.FC<MetricCardsProps> = ({ 
  data, 
  loading = false, 
  lastUpdated, 
  responseTime 
}) => {
  // Calculate key metrics from the data
  const totalTVL = data?.data.totalTvl || 0;
  const totalProtocols = data?.data.totalProtocols || 0;
  const dominantChain = data?.data.dominantChain || 'Unknown';
  const chainDominance = data?.data.chainDominance || 0;
  const marketGrowth7d = data?.data.growth_7d || 0;
  const marketGrowth1d = data?.data.growth_1d || 0;
  
  // Calculate data freshness
  const dataAge = lastUpdated ? Math.floor((Date.now() - lastUpdated.getTime()) / 1000) : 0;
  const isDataFresh = dataAge < 300; // Fresh if less than 5 minutes old
  
  // Response time status
  const responseTimeStatus = responseTime ? (
    responseTime < 1000 ? 'excellent' : 
    responseTime < 3000 ? 'good' : 'slow'
  ) : 'unknown';

  const metrics: Array<MetricCardProps & { id: string }> = [
    {
      id: 'total-tvl',
      title: 'Total Value Locked',
      value: formatTVL(totalTVL),
      subtitle: 'Across all protocols',
      growth: marketGrowth7d,
      icon: <DollarSign className={`w-4 h-4 ${loading ? 'text-muted-foreground' : 'text-[#FF8A66]'}`} />,
      highlight: true,
      loading
    },
    {
      id: 'total-protocols',
      title: 'Active Protocols',
      value: formatWithCommas(totalProtocols),
      subtitle: 'Currently tracked',
      icon: <Users className={`w-4 h-4 ${loading ? 'text-muted-foreground' : 'text-blue-500'}`} />,
      loading
    },
    {
      id: 'dominant-chain',
      title: 'Dominant Chain',
      value: dominantChain,
      subtitle: `${chainDominance.toFixed(1)}% market share`,
      icon: <Globe className={`w-4 h-4 ${loading ? 'text-muted-foreground' : 'text-purple-500'}`} />,
      loading
    },
    {
      id: 'market-growth',
      title: '24h Market Growth',
      value: formatGrowth(marketGrowth1d).value,
      subtitle: 'Real-time performance',
      growth: marketGrowth1d,
      icon: <Activity className={`w-4 h-4 ${loading ? 'text-muted-foreground' : 'text-emerald-500'}`} />,
      loading
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-6">
          {/* Data Freshness */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isDataFresh ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-500'
            }`} />
            <span className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `Updated ${formatDataAge(dataAge)}`}
            </span>
          </div>

          {/* Response Time */}
          {responseTime && (
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${
                responseTimeStatus === 'excellent' ? 'text-emerald-500' :
                responseTimeStatus === 'good' ? 'text-yellow-500' : 'text-red-500'
              }`} />
              <span className="text-sm text-muted-foreground">
                {formatResponseTime(responseTime)}
              </span>
            </div>
          )}
        </div>

        {/* API Status */}
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`${
              loading ? 'text-yellow-600 border-yellow-200 bg-yellow-50' :
              isDataFresh ? 'text-emerald-600 border-emerald-200 bg-emerald-50' :
              'text-gray-600 border-gray-200 bg-gray-50'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              loading ? 'bg-yellow-500 animate-pulse' :
              isDataFresh ? 'bg-emerald-500' : 'bg-gray-400'
            }`} />
            {loading ? 'Updating' : isDataFresh ? 'Live' : 'Cached'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default MetricCards;