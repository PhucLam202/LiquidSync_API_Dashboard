'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Cell
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ProtocolChartData } from '../../types/api.types';
import { formatTVL, formatTooltipValue, formatPercentage } from '../../utils/numberFormatters';

interface ProtocolBarChartProps {
  data: ProtocolChartData[];
  loading?: boolean;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ProtocolChartData;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg min-w-[200px]">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">TVL:</span>
            <span className="text-sm font-medium">{formatTooltipValue(data.tvl, 'currency')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Market Share:</span>
            <span className="text-sm font-medium">{formatTooltipValue(data.marketShare, 'percentage')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">7d Growth:</span>
            <div className="flex items-center gap-1">
              {data.growth7d > 0.5 ? (
                <TrendingUp className="w-3 h-3 text-emerald-500" />
              ) : data.growth7d < -0.5 ? (
                <TrendingDown className="w-3 h-3 text-red-500" />
              ) : (
                <Minus className="w-3 h-3 text-gray-400" />
              )}
              <span className={`text-sm font-medium ${
                data.growth7d > 0.5 ? 'text-emerald-600' : 
                data.growth7d < -0.5 ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {formatPercentage(data.growth7d)}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Category:</span>
            <Badge variant="secondary" className="text-xs">{data.category}</Badge>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const LoadingSkeleton: React.FC = () => (
  <div className="h-96 flex items-center justify-center">
    <div className="space-y-4 text-center w-full">
      <div className="grid grid-cols-8 gap-2 h-64 items-end">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className="bg-muted animate-pulse rounded-t"
            style={{ height: `${Math.random() * 80 + 20}%` }}
          />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-48 mx-auto animate-pulse" />
        <div className="h-3 bg-muted rounded w-32 mx-auto animate-pulse" />
      </div>
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="h-96 flex items-center justify-center">
    <div className="text-center space-y-2">
      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto">
        <BarChart className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">No protocol data available</p>
      <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
    </div>
  </div>
);

const ProtocolBarChart: React.FC<ProtocolBarChartProps> = ({
  data,
  loading = false,
  limit = 10,
  onLimitChange
}) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  // Limit options
  const limitOptions = [5, 10, 15, 20];

  // Format tick labels for Y-axis (TVL values)
  const formatYAxisTick = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  // Calculate max value for Y-axis domain
  const maxValue = Math.max(...data.map(d => d.tvl));
  const yAxisMax = maxValue * 1.1; // Add 10% padding

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing top {Math.min(limit, data.length)} protocols
          </p>
          <p className="text-xs text-muted-foreground">
            Total TVL: {formatTVL(data.reduce((sum, item) => sum + item.tvl, 0))}
          </p>
        </div>

        {onLimitChange && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-2">Show:</span>
            {limitOptions.map(option => (
              <Button
                key={option}
                variant={limit === option ? "default" : "outline"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onLimitChange(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60, // Extra space for rotated labels
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 11 }}
              className="text-xs"
            />
            <YAxis
              tickFormatter={formatYAxisTick}
              domain={[0, yAxisMax]}
              tick={{ fontSize: 11 }}
              className="text-xs"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="tvl"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              animationBegin={100}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || '#FF8A66'}
                  opacity={0.8}
                  className="hover:opacity-100 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Protocol Performance Summary */}
      {data.length > 0 && (
        <div className="pt-4 border-t space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Top Performers</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.slice(0, 3).map((protocol, index) => (
              <div key={protocol.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">#{index + 1}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{protocol.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {protocol.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatTVL(protocol.tvl)}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    {protocol.growth7d > 0.5 ? (
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    ) : protocol.growth7d < -0.5 ? (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    ) : (
                      <Minus className="w-3 h-3 text-gray-400" />
                    )}
                    <span className={`text-xs ${
                      protocol.growth7d > 0.5 ? 'text-emerald-600' : 
                      protocol.growth7d < -0.5 ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {formatPercentage(protocol.growth7d)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolBarChart;