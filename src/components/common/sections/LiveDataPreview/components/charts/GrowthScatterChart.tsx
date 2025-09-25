'use client';

import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { GrowthChartData } from '../../types/api.types';
import { formatTVL, formatPercentage, formatTooltipValue } from '../../utils/numberFormatters';

interface GrowthScatterChartProps {
  data: GrowthChartData[];
  loading?: boolean;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: GrowthChartData;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg min-w-[220px]">
        <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">7-Day Growth:</span>
            <span className={`text-sm font-medium ${
              data.x > 0 ? 'text-emerald-600' : data.x < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {formatPercentage(data.x)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">1-Day Growth:</span>
            <span className={`text-sm font-medium ${
              data.y > 0 ? 'text-emerald-600' : data.y < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {formatPercentage(data.y)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Market Share:</span>
            <span className="text-sm font-medium">{formatTooltipValue(data.marketShare, 'percentage')}</span>
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
    <div className="space-y-4 text-center">
      <div className="w-64 h-64 border rounded-lg bg-muted/20 animate-pulse flex items-center justify-center mx-auto">
        <div className="grid grid-cols-6 gap-2 w-48 h-48">
          {Array.from({ length: 36 }).map((_, i) => (
            <div 
              key={i}
              className="w-2 h-2 rounded-full bg-muted animate-pulse"
              style={{ 
                animationDelay: `${i * 50}ms`,
                opacity: Math.random() * 0.5 + 0.3 
              }}
            />
          ))}
        </div>
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
        <TrendingUp className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">No growth data available</p>
      <p className="text-xs text-muted-foreground">Only protocols with &gt;$1B TVL are shown</p>
    </div>
  </div>
);

const GrowthScatterChart: React.FC<GrowthScatterChartProps> = ({
  data,
  loading = false
}) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  // Calculate axis domains with padding
  const xValues = data.map(d => d.x);
  const yValues = data.map(d => d.y);
  
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  
  const xPadding = Math.abs(xMax - xMin) * 0.1;
  const yPadding = Math.abs(yMax - yMin) * 0.1;
  
  const xDomain = [xMin - xPadding, xMax + xPadding];
  const yDomain = [yMin - yPadding, yMax + yPadding];

  // Format tick labels
  const formatTick = (value: number) => `${value.toFixed(1)}%`;

  // Quadrant analysis
  const quadrants = {
    strongGrowth: data.filter(d => d.x > 0 && d.y > 0).length,
    recovering: data.filter(d => d.x > 0 && d.y < 0).length,
    declining: data.filter(d => d.x < 0 && d.y < 0).length,
    volatile: data.filter(d => d.x < 0 && d.y > 0).length
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          Growth Analysis for {data.length} Major Protocols (&gt;$1B TVL)
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>X-Axis: 7-Day Growth</span>
          <span>•</span>
          <span>Y-Axis: 1-Day Growth</span>
          <span>•</span>
          <span>Bubble Size: TVL</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 30,
              bottom: 20,
              left: 20,
            }}
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              type="number"
              dataKey="x"
              domain={xDomain}
              tickFormatter={formatTick}
              tick={{ fontSize: 11 }}
              label={{ value: '7-Day Growth (%)', position: 'insideBottom', offset: -10, fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={yDomain}
              tickFormatter={formatTick}
              tick={{ fontSize: 11 }}
              label={{ value: '1-Day Growth (%)', angle: -90, position: 'insideLeft', fontSize: 12 }}
            />
            
            {/* Reference lines for quadrants */}
            <ReferenceLine x={0} stroke="#666" strokeDasharray="2 2" opacity={0.5} />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" opacity={0.5} />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Scatter
              dataKey="y"
              fill="#FF8A66"
              opacity={0.7}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <circle
                  key={`cell-${index}`}
                  r={Math.max(3, Math.min(15, entry.size))}
                  fill={entry.color}
                  opacity={0.7}
                  className="hover:opacity-100 transition-opacity cursor-pointer"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Quadrant Analysis */}
      <div className="pt-4 border-t space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Market Quadrant Analysis</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="text-lg font-bold text-emerald-700">{quadrants.strongGrowth}</div>
            <div className="text-xs text-emerald-600 font-medium">Strong Growth</div>
            <div className="text-xs text-emerald-600/80">7d+ & 1d+</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-lg font-bold text-blue-700">{quadrants.recovering}</div>
            <div className="text-xs text-blue-600 font-medium">Recovering</div>
            <div className="text-xs text-blue-600/80">7d+ & 1d-</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="text-lg font-bold text-red-700">{quadrants.declining}</div>
            <div className="text-xs text-red-600 font-medium">Declining</div>
            <div className="text-xs text-red-600/80">7d- & 1d-</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="text-lg font-bold text-yellow-700">{quadrants.volatile}</div>
            <div className="text-xs text-yellow-600 font-medium">Volatile</div>
            <div className="text-xs text-yellow-600/80">7d- & 1d+</div>
          </div>
        </div>
      </div>

      {/* Top Performers by Quadrant */}
      {quadrants.strongGrowth > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-muted-foreground">Top Strong Growth Protocols</h5>
          <div className="flex flex-wrap gap-2">
            {data
              .filter(d => d.x > 0 && d.y > 0)
              .sort((a, b) => (b.x + b.y) - (a.x + a.y))
              .slice(0, 5)
              .map((protocol, index) => (
                <Badge key={protocol.name} variant="outline" className="text-xs">
                  {protocol.name} (+{formatPercentage(protocol.x + protocol.y)})
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthScatterChart;