'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Activity, 
  BarChart3, 
  Code, 
  RefreshCw, 
  AlertCircle,
  TrendingUp,
  Zap
} from 'lucide-react';

import { APIFilters } from './types/api.types';
import useTVLData from './hooks/useTVLData';

// Component imports
import MetricCards from './components/MetricCards';
import InteractiveCharts from './components/InteractiveCharts';
import APIExamples from './components/APIExamples';
import LSTOverview from './components/LSTOverview';

interface LiveDataPreviewProps {
  className?: string;
}

type ActiveTab = 'lst' | 'overview' | 'charts' | 'examples';

const LiveDataPreview: React.FC<LiveDataPreviewProps> = ({
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lst');
  const [currentFilters, setCurrentFilters] = useState<APIFilters | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before using queries
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch TVL data with auto-refresh (only after mounting)
  const {
    data,
    loading,
    error,
    lastUpdated,
    responseTime,
    filters,
    updateFilters,
    refetch,
    clearError,
    isDataFresh,
    healthStatus
  } = useTVLData({
    refreshInterval: 60, // Refresh every 60 seconds
    enablePolling: mounted, // Only poll when mounted
    initialFilters: currentFilters || undefined,
    enabled: mounted // Only enable query when mounted
  });

  // Handle filter changes from charts
  const handleFiltersChange = (newFilters: APIFilters) => {
    setCurrentFilters(newFilters);
    updateFilters(newFilters);
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    await refetch();
  };

  // Show loading skeleton during SSR/mounting
  if (!mounted) {
    return (
      <section className={`py-16 bg-gradient-to-b from-white to-gray-50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <div className="h-8 bg-muted rounded w-48 mx-auto animate-pulse" />
            <div className="h-12 bg-muted rounded w-96 mx-auto animate-pulse" />
            <div className="h-6 bg-muted rounded w-[600px] mx-auto animate-pulse" />
          </div>
          <div className="h-96 bg-muted rounded-lg animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-gradient-to-b from-white to-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FF8A66]/10 rounded-full border border-[#FF8A66]/20">
            <Activity className="w-4 h-4 text-[#FF8A66]" />
            <span className="text-sm font-medium text-[#FF8A66]">Live Data Preview</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            See Our API in Action
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience real-time DeFi data with interactive visualizations. 
            Explore $800B+ TVL across 6,000+ protocols with instant API examples.
          </p>

          {/* Status Indicators */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                healthStatus === 'healthy' ? 'bg-emerald-500 animate-pulse' : 
                healthStatus === 'unhealthy' ? 'bg-red-500' : 
                'bg-yellow-500'
              }`} />
              <span className="text-sm text-gray-600">
                API Status: {healthStatus === 'healthy' ? 'Operational' : 
                           healthStatus === 'unhealthy' ? 'Issues Detected' : 
                           'Checking...'}
              </span>
            </div>
            
            {responseTime && (
              <div className="flex items-center gap-2">
                <Zap className={`w-4 h-4 ${
                  responseTime < 1000 ? 'text-emerald-500' : 
                  responseTime < 3000 ? 'text-yellow-500' : 
                  'text-red-500'
                }`} />
                <span className="text-sm text-gray-600">
                  Response: {responseTime}ms
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">
                    Failed to load live data
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    {error.getUserFriendlyMessage()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearError}
                  className="border-red-200 hover:bg-red-100"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF8A66]/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-[#FF8A66]" />
                </div>
                DeFi Market Dashboard
              </CardTitle>
              
              <div className="flex items-center gap-2">
                {isDataFresh && (
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                    Live
                  </Badge>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="h-8 px-3"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  <span className="text-xs">Refresh</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTab)}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="lst" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">LST</span>
                </TabsTrigger>
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="charts" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="examples" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  <span className="hidden sm:inline">API Code</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lst" className="mt-0">
                <LSTOverview 
                  data={data?.data || null}
                  loading={loading}
                  lastUpdated={lastUpdated || undefined}
                />
              </TabsContent>

              <TabsContent value="overview" className="mt-0 space-y-6">
                <MetricCards 
                  data={data}
                  loading={loading}
                  lastUpdated={lastUpdated || undefined}
                  responseTime={responseTime || undefined}
                />
                
                {/* Quick insights */}
                {data && !loading && (
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-900">Market Insights</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-blue-800">
                                <span className="font-medium">Market Leader:</span>{' '}
                                {data.data.topProtocols[0]?.name} dominates {data.data.topProtocols[0]?.category} 
                                with ${(data.data.topProtocols[0]?.tvl / 1e9).toFixed(1)}B TVL
                              </p>
                            </div>
                            <div>
                              <p className="text-blue-800">
                                <span className="font-medium">Growth Trend:</span>{' '}
                                {data.data.growth_7d != null ? (
                                  <>
                                    {data.data.growth_7d > 0 ? 'Positive' : 'Negative'} 7-day momentum 
                                    at {data.data.growth_7d.toFixed(1)}%
                                  </>
                                ) : (
                                  'Data unavailable'
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Badge variant="outline" className="text-xs">
                              Updated {lastUpdated?.toLocaleTimeString()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {data.data.totalProtocols.toLocaleString()} Protocols
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="charts" className="mt-0">
                <InteractiveCharts 
                  data={data}
                  loading={loading}
                  onFiltersChange={handleFiltersChange}
                  currentFilters={currentFilters}
                />
              </TabsContent>

              <TabsContent value="examples" className="mt-0">
                <APIExamples 
                  currentFilters={currentFilters}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-[#FF8A66] to-orange-500 text-white border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Ready to Build with Our API?
                  </h3>
                  <p className="text-white/90">
                    Access the same data powering this dashboard in your applications. 
                    Start with our free tier today.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-[#FF8A66] hover:bg-gray-100 font-medium"
                    onClick={() => {
                      // Navigate to signup/API docs
                      window.open('/signup', '_blank');
                    }}
                  >
                    Get Free API Key
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-medium"
                    onClick={() => {
                      window.open('https://docs.liquidsnc.com', '_blank');
                    }}
                  >
                    View Documentation
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-6 text-sm text-white/80">
                  <span>✓ Free tier included</span>
                  <span>✓ Real-time data</span>
                  <span>✓ 99.9% uptime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveDataPreview;