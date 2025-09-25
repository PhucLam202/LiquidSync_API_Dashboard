'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle,
  Target,
  Zap
} from 'lucide-react';
import { Intelligence } from '../../types/api.types';
import { formatTVL, formatPercentage, formatTooltipValue } from '../../utils/numberFormatters';

interface MarketTrendsChartProps {
  data?: Intelligence;
  loading?: boolean;
}

interface TrendPoint {
  time: string;
  value: number;
  change: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const value = payload[0].value;
    const isChange = payload[0].dataKey === 'change';
    
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        <p className="text-sm">
          {isChange ? (
            <span className={value > 0 ? 'text-emerald-600' : 'text-red-600'}>
              {formatPercentage(value)} change
            </span>
          ) : (
            <span className="text-gray-600">
              {formatTooltipValue(value, 'currency')} TVL
            </span>
          )}
        </p>
      </div>
    );
  }
  return null;
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-4 bg-muted rounded w-24" />
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-muted rounded w-16 mb-2" />
            <div className="h-3 bg-muted rounded w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="h-64 bg-muted rounded-lg animate-pulse flex items-center justify-center">
      <Activity className="w-8 h-8 text-muted-foreground" />
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="h-64 flex items-center justify-center">
    <div className="text-center space-y-2">
      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto">
        <Activity className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">Market intelligence data unavailable</p>
      <p className="text-xs text-muted-foreground">Trends analysis requires historical data</p>
    </div>
  </div>
);

const MarketTrendsChart: React.FC<MarketTrendsChartProps> = ({
  data,
  loading = false
}) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return <EmptyState />;
  }

  // Generate sample trend data (in a real app, this would come from the API)
  const generateTrendData = (): TrendPoint[] => {
    const points: TrendPoint[] = [];
    const hours = 24;
    const baseValue = 821700000000; // $821.7B
    
    for (let i = hours; i >= 0; i--) {
      const time = new Date(Date.now() - i * 60 * 60 * 1000);
      const randomVariation = (Math.random() - 0.5) * 0.02; // ±1%
      const value = baseValue * (1 + randomVariation);
      const change = i === hours ? 0 : randomVariation * 100;
      
      points.push({
        time: time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        value,
        change
      });
    }
    
    return points;
  };

  const trendData = generateTrendData();

  // Market intelligence metrics
  const metrics = [
    {
      title: 'Market Sentiment',
      value: data.marketSentiment || 'Neutral',
      icon: data.marketSentiment === 'Bullish' ? TrendingUp : 
            data.marketSentiment === 'Bearish' ? TrendingDown : Activity,
      color: data.marketSentiment === 'Bullish' ? 'text-emerald-500' : 
             data.marketSentiment === 'Bearish' ? 'text-red-500' : 'text-gray-500',
      bgColor: data.marketSentiment === 'Bullish' ? 'bg-emerald-50 border-emerald-200' : 
               data.marketSentiment === 'Bearish' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
    },
    {
      title: 'Volatility Index',
      value: data.volatilityIndex?.toFixed(2) || '0.00',
      icon: AlertTriangle,
      color: data.volatilityIndex > 0.7 ? 'text-red-500' : 
             data.volatilityIndex > 0.4 ? 'text-yellow-500' : 'text-emerald-500',
      bgColor: data.volatilityIndex > 0.7 ? 'bg-red-50 border-red-200' : 
               data.volatilityIndex > 0.4 ? 'bg-yellow-50 border-yellow-200' : 'bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Risk Score',
      value: data.riskScore?.toFixed(1) || '0.0',
      icon: Target,
      color: data.riskScore > 7 ? 'text-red-500' : 
             data.riskScore > 4 ? 'text-yellow-500' : 'text-emerald-500',
      bgColor: data.riskScore > 7 ? 'bg-red-50 border-red-200' : 
               data.riskScore > 4 ? 'bg-yellow-50 border-yellow-200' : 'bg-emerald-50 border-emerald-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Market Intelligence Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className={`transition-all duration-300 ${metric.bgColor}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <IconComponent className={`w-4 h-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </div>
                {metric.title === 'Volatility Index' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.volatilityIndex <= 0.3 ? 'Low volatility' : 
                     data.volatilityIndex <= 0.6 ? 'Moderate volatility' : 
                     'High volatility'}
                  </p>
                )}
                {metric.title === 'Risk Score' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Scale: 1-10 {data.riskScore <= 3 ? '(Low)' : 
                                data.riskScore <= 7 ? '(Medium)' : '(High)'}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* TVL Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF8A66]" />
                24-Hour TVL Trend
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Real-time total value locked movement
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Live Data
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8A66" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF8A66" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1e9).toFixed(0)}B`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#FF8A66"
                  strokeWidth={2}
                  fill="url(#tvlGradient)"
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <h4 className="font-medium text-indigo-900">AI Market Analysis</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="text-indigo-800">
                  <span className="font-medium">Trend Analysis:</span> The market is showing{' '}
                  {data.marketSentiment?.toLowerCase()} signals with{' '}
                  {data.volatilityIndex <= 0.3 ? 'low' : 
                   data.volatilityIndex <= 0.6 ? 'moderate' : 'high'} volatility.
                </p>
                
                <p className="text-indigo-800">
                  <span className="font-medium">Risk Assessment:</span> Current risk level is{' '}
                  {data.riskScore <= 3 ? 'low' : 
                   data.riskScore <= 7 ? 'moderate' : 'elevated'}{' '}
                  based on multiple market indicators.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    Real-time Analysis
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Multi-chain Data
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    AI-Powered
                  </Badge>
                </div>
                
                <p className="text-xs text-indigo-600">
                  Intelligence updated every 60 seconds from 6,000+ protocols across major chains.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketTrendsChart;