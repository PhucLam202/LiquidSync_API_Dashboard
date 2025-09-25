'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  RefreshCw, 
  Eye,
  Copy,
  Download,
  DollarSign,
  Zap,
  Building2,
  AlertCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip } from 'recharts';

import { defiAPI } from '../services/defi-api.service';
import { TVLOverviewResponse } from '../types/api.types';

// Types
interface EndpointOption {
  id: string;
  label: string;
  path: string;
}

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  highlighted?: boolean;
}

interface APIInActionDashboardProps {
  className?: string;
}

// Available endpoints
const ENDPOINTS: EndpointOption[] = [
  { id: 'overview', label: 'Overview', path: '/api/v1/defi/tvl/overview' },
  { id: 'protocols', label: 'Protocols', path: '/api/v1/defi/tvl/protocols' },
  { id: 'categories', label: 'Categories', path: '/api/v1/defi/tvl/categories' },
  { id: 'trends', label: 'Trends', path: '/api/v1/defi/tvl/trends' }
];

// Chart colors
const CHART_COLORS = ['#FF8A66', '#FF6B47', '#E55A3C', '#CC4A31', '#B33A26'];

// KPI Card Component
const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, icon, highlighted = false }) => (
  <Card className={`${highlighted ? 'border-[#FF8A66] bg-[#FF8A66]/5' : ''}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          highlighted ? 'bg-[#FF8A66] text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Raw JSON Viewer Dialog Component
const RawJSONViewer: React.FC<{ 
  data: unknown; 
  endpoint: string; 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void;
}> = ({ data, endpoint, isOpen, onOpenChange }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `defi-data-${endpoint.replace(/\//g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col border-2 border-gray-300 shadow-2xl">
        <DialogHeader className="flex-shrink-0 bg-gradient-to-r from-slate-100 to-gray-200 -m-6 mb-4 p-6 border-b-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">Raw JSON Response</DialogTitle>
              <p className="text-sm text-gray-700 mt-2 font-medium">
                <code className="bg-gray-200 px-3 py-2 rounded-md text-sm font-mono border border-gray-300">{endpoint}</code>
                <Badge variant="outline" className="ml-3 text-green-700 border-green-300 bg-green-100 font-semibold px-3 py-1">
                  200 OK
                </Badge>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-9 px-4 border-2 border-gray-300 font-semibold"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-9 px-4 border-2 border-gray-300 font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 mt-2">
          <pre className="text-sm bg-slate-900 text-green-400 p-6 rounded-lg overflow-x-auto font-mono leading-relaxed border-2 border-gray-300 shadow-inner">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Top LST Protocols List Component
const TopLSTProtocolsList: React.FC<{ data: TVLOverviewResponse | null; loading: boolean }> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top LST Protocols on Ethereum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  // Filter LST protocols on Ethereum
  const lstProtocols = data.data.topProtocols
    .filter(protocol => 
      ['Liquid Staking', 'Liquid Restaking'].includes(protocol.category) &&
      (protocol.chain === 'Ethereum' || protocol.chains.includes('Ethereum'))
    )
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#FF8A66]" />
          Top LST Protocols on Ethereum
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lstProtocols.map((protocol, index) => {
          const ethTvl = protocol.chainTvls?.find(c => c.chain === 'Ethereum')?.tvl || protocol.tvl;
          const marketShare = (ethTvl / data.data.totalTvl) * 100;
          
          return (
            <div key={protocol.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#FF8A66]/10 flex items-center justify-center text-[#FF8A66] font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{protocol.name}</p>
                <p className="text-sm text-gray-600">
                  ${(ethTvl / 1e9).toFixed(2)}B TVL • {marketShare.toFixed(1)}% share
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  protocol.growth7d >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {protocol.growth7d >= 0 ? '+' : ''}{protocol.growth7d.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">7d growth</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const APIInActionDashboard: React.FC<APIInActionDashboardProps> = ({ className = '' }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('overview');
  const [data, setData] = useState<TVLOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawJsonOpen, setRawJsonOpen] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll use the overview endpoint for all cases
      // In a real implementation, you'd have different endpoints
      const response = await defiAPI.getTVLOverview();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refresh
  useEffect(() => {
    fetchData();
  }, [selectedEndpoint]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleEndpointChange = (endpoint: string) => {
    setSelectedEndpoint(endpoint);
  };

  // Calculate LST data
  const calculateLSTData = () => {
    if (!data) return { lstTvl: 0, lstPercentage: 0 };
    
    const lstTvl = data.data.topProtocols
      .filter(protocol => 
        ['Liquid Staking', 'Liquid Restaking'].includes(protocol.category) &&
        (protocol.chain === 'Ethereum' || protocol.chains.includes('Ethereum'))
      )
      .reduce((sum, protocol) => {
        const ethTvl = protocol.chainTvls?.find(c => c.chain === 'Ethereum')?.tvl || protocol.tvl;
        return sum + ethTvl;
      }, 0);

    const ethTotalTvl = data.data.topProtocols
      .filter(protocol => protocol.chain === 'Ethereum' || protocol.chains.includes('Ethereum'))
      .reduce((sum, protocol) => {
        const ethTvl = protocol.chainTvls?.find(c => c.chain === 'Ethereum')?.tvl || protocol.tvl;
        return sum + ethTvl;
      }, 0);

    const lstPercentage = ethTotalTvl > 0 ? (lstTvl / ethTotalTvl) * 100 : 0;
    
    return { lstTvl, lstPercentage };
  };

  const { lstTvl, lstPercentage } = calculateLSTData();

  // Prepare chart data
  const prepareChartData = () => {
    if (!data) return { defiDistribution: [], lstDistribution: [] };
    
    // DeFi Distribution (top 5 + others)
    const top5 = data.data.topProtocols.slice(0, 5);
    const others = data.data.topProtocols.slice(5);
    const othersTvl = others.reduce((sum, p) => sum + p.tvl, 0);
    
    const defiDistribution = [
      ...top5.map((protocol, index) => ({
        name: protocol.name,
        value: protocol.tvl,
        percentage: protocol.marketShare,
        color: CHART_COLORS[index]
      })),
      ...(othersTvl > 0 ? [{
        name: 'Others',
        value: othersTvl,
        percentage: (othersTvl / data.data.totalTvl) * 100,
        color: '#94A3B8'
      }] : [])
    ];

    // LST Distribution
    const lstProtocols = data.data.topProtocols
      .filter(protocol => ['Liquid Staking', 'Liquid Restaking'].includes(protocol.category))
      .slice(0, 5);
    
    const lstDistribution = lstProtocols.map((protocol, index) => ({
      name: protocol.name,
      value: protocol.tvl,
      percentage: (protocol.tvl / lstTvl) * 100,
      color: CHART_COLORS[index]
    }));

    return { defiDistribution, lstDistribution };
  };

  const { defiDistribution, lstDistribution } = prepareChartData();

  const currentEndpoint = ENDPOINTS.find(e => e.id === selectedEndpoint);

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-white ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Select value={selectedEndpoint} onValueChange={handleEndpointChange}>
            <SelectTrigger className="w-[220px] border-2 border-gray-300 bg-white font-semibold text-gray-800 h-10">
              <SelectValue placeholder="Select endpoint" />
            </SelectTrigger>
            <SelectContent className="border-2 border-gray-300">
              {ENDPOINTS.map((endpoint) => (
                <SelectItem key={endpoint.id} value={endpoint.id} className="font-semibold">
                  {endpoint.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="h-10 px-4 border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-100"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* View Raw Button - visible on both desktop and mobile */}
        <Button
          variant="secondary"
          onClick={() => setRawJsonOpen(true)}
          disabled={!data}
          className="lg:hidden w-full h-10 border-2 border-gray-300 font-semibold bg-gray-100 hover:bg-gray-200"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Raw JSON
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => setRawJsonOpen(true)}
          disabled={!data}
          className="hidden lg:flex h-10 px-4 border-2 border-gray-300 font-semibold bg-gray-100 hover:bg-gray-200"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Raw
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-2 border-red-300 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-700" />
              <div className="flex-1">
                <p className="text-base font-bold text-red-900">Failed to load data</p>
                <p className="text-sm text-red-800 mt-1 font-semibold">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="border-2 border-red-300 hover:bg-red-100 font-semibold"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - UI Summary (Mobile: full width, Desktop: 8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard
              title="Total TVL"
              value={loading ? '...' : data ? `$${(data.data.totalTvl / 1e9).toFixed(1)}B` : '$0B'}
              icon={<DollarSign className="w-5 h-5" />}
            />
            
            <KPICard
              title="LST TVL"
              value={loading ? '...' : `$${(lstTvl / 1e9).toFixed(1)}B`}
              subtitle={`${lstPercentage.toFixed(1)}% of ETH TVL`}
              icon={<Zap className="w-5 h-5" />}
              highlighted
            />
            
            <KPICard
              title="Top App ETH"
              value={loading ? '...' : data ? data.data.topProtocols[0]?.name || 'N/A' : 'N/A'}
              subtitle={data ? `$${(data.data.topProtocols[0]?.tvl / 1e9).toFixed(1)}B • +${data.data.topProtocols[0]?.growth7d.toFixed(1)}%` : undefined}
              icon={<Building2 className="w-5 h-5" />}
            />
          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* All DeFi Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All DeFi Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Skeleton className="w-32 h-32 rounded-full" />
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={defiDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {defiDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          formatter={(value: number) => [`$${(value / 1e9).toFixed(2)}B`, 'TVL']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* LST Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">LST Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Skeleton className="w-32 h-32 rounded-full" />
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={lstDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {lstDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          formatter={(value: number) => [`$${(value / 1e9).toFixed(2)}B`, 'TVL']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top LST Protocols List */}
          <TopLSTProtocolsList data={data} loading={loading} />
        </div>

        {/* Right Column - Raw JSON Viewer (Desktop only) */}
        <div className="hidden lg:block lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Raw JSON Response</CardTitle>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  200 OK
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {currentEndpoint?.path}
                </code>
              </p>
            </CardHeader>
            <CardContent className="h-[600px]">
              <ScrollArea className="h-full">
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                ) : data ? (
                  <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <code>{JSON.stringify(data, null, 2)}</code>
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No data available</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Raw JSON Dialog for Mobile */}
      <RawJSONViewer
        data={data}
        endpoint={currentEndpoint?.path || ''}
        isOpen={rawJsonOpen}
        onOpenChange={setRawJsonOpen}
      />
    </div>
  );
};

export default APIInActionDashboard;