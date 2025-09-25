'use client';

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Activity,
  Zap,
  BarChart3
} from 'lucide-react';
import { TVLData } from '../types/api.types';
import { LSTMarketData } from '../types/lst.types';
import {
  processLSTMarketData,
  formatCompactCurrency,
  formatGrowthPercentage,
  generateLSTChartData,
  getDisplayProtocolName,
  validateLSTMarketData,
  generateProtocolTooltipContent
} from '../utils/lst-utils';
import LSTMiniDonutChart from './LSTMiniDonutChart';

interface LSTOverviewProps {
  data: TVLData | null;
  loading: boolean;
  lastUpdated?: Date;
  className?: string;
}

const LSTOverview: React.FC<LSTOverviewProps> = ({
  data,
  loading,
  lastUpdated,
  className = ''
}) => {
  // Process LST market data
  const lstMarketData: LSTMarketData | null = useMemo(() => {
    if (!data || loading) return null;
    try {
      const processed = processLSTMarketData(data, lastUpdated);
      return validateLSTMarketData(processed) ? processed : null;
    } catch (error) {
      console.warn('Failed to process LST market data:', error);
      return null;
    }
  }, [data, loading, lastUpdated]);

  // Generate chart data
  const chartData = useMemo(() => {
    if (!lstMarketData) return [];
    return generateLSTChartData(lstMarketData);
  }, [lstMarketData]);

  // Loading skeleton
  if (loading) {
    return (
      <section className={`ios18 lst-overview ${className}`}>
        <div className="space-y-4">
          {/* Row 1: Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-20">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-16 animate-pulse" />
                    <div className="h-5 bg-muted rounded w-20 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Row 2: Content */}
          <div className="grid grid-cols-5 gap-4 h-32">
            <div className="col-span-3 bg-muted rounded animate-pulse" />
            <div className="col-span-2 bg-muted rounded animate-pulse" />
          </div>
          
          {/* Footer */}
          <div className="h-4 bg-muted rounded w-48 animate-pulse" />
        </div>
      </section>
    );
  }

  // No data state
  if (!lstMarketData) {
    return (
      <section className={`ios18 lst-overview ${className}`}>
        <div className="text-center py-8">
          <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            LST data not available
          </p>
          <p className="text-xs text-gray-400 mt-1">
            No Ethereum liquid staking protocols found
          </p>
        </div>
      </section>
    );
  }

  // Format data for display
  const ethereumTvl = formatCompactCurrency(lstMarketData.ethereumTotalTvl);
  const lstTvl = formatCompactCurrency(lstMarketData.lstTotalTvl);
  const lstMarketShare = lstMarketData.lstMarketShare.toFixed(1);
  const topMoverGrowth = lstMarketData.topMover 
    ? formatGrowthPercentage(lstMarketData.topMover.growth7d, 1, true)
    : null;

  return (
    <section className={`ios18 lst-overview ${className}`}>
      <div className="space-y-4">
        {/* Row 1: Three compact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card A: Ethereum TVL */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">Ethereum TVL</span>
                </div>
                <div className="text-lg font-bold text-blue-900">
                  {ethereumTvl.prefix}{ethereumTvl.value}{ethereumTvl.suffix}
                </div>
                <div className="text-xs text-blue-600">
                  {data?.dominantChain === 'Ethereum' ? 'Dominant chain' : 'Ethereum only'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card B: LST on Ethereum (Highlight) */}
          <Card className="border-[#FF8A66] bg-gradient-to-br from-[#FF8A66]/10 to-orange-50 ring-2 ring-[#FF8A66]/20">
            <CardContent className="pt-4 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#FF8A66]" />
                  <span className="text-xs font-medium text-orange-800">LST (ETH)</span>
                </div>
                <div className="text-lg font-bold text-orange-900">
                  {lstTvl.prefix}{lstTvl.value}{lstTvl.suffix}
                </div>
                <div className="text-xs text-orange-700 font-medium">
                  {lstMarketShare}% of ETH TVL
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card C: Top LST mover */}
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-800">Top Mover</span>
                </div>
                <div className="text-sm font-bold text-emerald-900 truncate">
                  {lstMarketData.topMover ? getDisplayProtocolName(lstMarketData.topMover) : 'N/A'}
                </div>
                {topMoverGrowth && (
                  <div className={`text-xs font-medium ${topMoverGrowth.colorClass}`}>
                    {topMoverGrowth.value} 7d
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Top 3 list + Mini chart */}
        <div className="grid grid-cols-5 gap-4">
          {/* Left 60%: Top 3 list */}
          <div className="col-span-3">
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FF8A66]" />
                    Top LST Protocols
                  </h4>
                  
                  <div className="space-y-2">
                    {lstMarketData.topProtocols.map((protocol, index) => {
                      const protocolTvl = formatCompactCurrency(protocol.ethereumTvl, 1);
                      const growth7d = formatGrowthPercentage(protocol.growth7d, 1, true);
                      
                      return (
                        <div
                          key={protocol.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group min-h-[40px]"
                          title={generateProtocolTooltipContent(protocol)}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="text-xs font-medium text-gray-500 w-4 flex-shrink-0">
                              #{index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {getDisplayProtocolName(protocol)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {protocolTvl.prefix}{protocolTvl.value}{protocolTvl.suffix}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs text-gray-600">
                              {protocol.marketShare.toFixed(1)}%
                            </div>
                            <div className={`text-xs font-medium ${growth7d.colorClass}`}>
                              {growth7d.value}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right 40%: Mini donut chart */}
          <div className="col-span-2">
            <Card className="h-full">
              <CardContent className="pt-4 pb-3 h-full flex items-center justify-center">
                <LSTMiniDonutChart 
                  data={chartData}
                  size={100}
                  strokeWidth={10}
                  className="scale-90 sm:scale-100"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer: Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <span>{lstMarketData.totalProtocols.toLocaleString()} protocols tracked</span>
            {data?.dominantChain === 'Ethereum' && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 border-blue-200 text-blue-700">
                Dominant chain: Ethereum
              </Badge>
            )}
          </div>
          
          {lstMarketData.lastUpdated && (
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>Updated {lstMarketData.lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LSTOverview;