'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  TooltipProps
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { CategoryData } from '../../types/api.types';
import { formatTVL, formatTooltipValue, formatMarketShare } from '../../utils/numberFormatters';

interface CategoryDonutChartProps {
  data: CategoryData[];
  loading?: boolean;
  totalTvl: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: CategoryData;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{data.name}</p>
        <div className="space-y-1 mt-2">
          <p className="text-sm">
            <span className="text-gray-600">TVL:</span> {formatTooltipValue(data.value, 'currency')}
          </p>
          <p className="text-sm">
            <span className="text-gray-600">Market Share:</span> {formatMarketShare(data.percentage)}
          </p>
          <p className="text-sm">
            <span className="text-gray-600">Protocols:</span> {data.count}
          </p>
          <p className="text-sm">
            <span className="text-gray-600">Avg Growth:</span> {formatTooltipValue(data.avgGrowth, 'percentage')}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend: React.FC<{ payload?: Array<{ value: string; color: string; payload: CategoryData }> }> = ({ 
  payload 
}) => {
  if (!payload) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="truncate font-medium">{entry.value}</span>
              <Badge variant="secondary" className="text-xs ml-2">
                {formatMarketShare(entry.payload.percentage)}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {entry.payload.count} protocol{entry.payload.count !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="h-80 flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="w-32 h-32 rounded-full border-4 border-muted animate-pulse mx-auto" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse" />
        <div className="h-3 bg-muted rounded w-24 mx-auto animate-pulse" />
      </div>
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="h-80 flex items-center justify-center">
    <div className="text-center space-y-2">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
        <PieChart className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">No category data available</p>
      <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
    </div>
  </div>
);

const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  data,
  loading = false,
  totalTvl
}) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  // Calculate inner and outer radius for donut effect
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    if (percent < 0.05) return null; // Don't show label if less than 5%
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
        style={{ textShadow: '0 0 3px rgba(0,0,0,0.5)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          Total across {data.length} categories
        </p>
        <p className="text-2xl font-bold text-[#FF8A66]">
          {formatTVL(totalTvl)}
        </p>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top performers */}
      {data.length > 0 && (
        <div className="pt-4 border-t space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Top Categories</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.slice(0, 3).map((category, index) => (
              <div key={category.name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.count} protocol{category.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatTVL(category.value)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatMarketShare(category.percentage)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDonutChart;