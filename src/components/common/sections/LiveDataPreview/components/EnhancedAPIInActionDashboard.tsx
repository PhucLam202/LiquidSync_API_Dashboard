'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Eye,
  Copy,
  Download,
  DollarSign,
  Zap,
  Building2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Activity,
  RefreshCw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip, Legend } from 'recharts';

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

interface ChartSegmentData {
  name: string;
  value: number;
  percentage?: number;
  color: string;
}

interface EnhancedAPIInActionDashboardProps {
  className?: string;
}

// Available endpoints
const ENDPOINTS: EndpointOption[] = [
  { id: 'overview', label: 'Overview', path: '/api/v1/defi/tvl/overview' },
  { id: 'protocols', label: 'Protocols', path: '/api/v1/defi/tvl/protocols' },
  { id: 'categories', label: 'Categories', path: '/api/v1/defi/tvl/categories' },
  { id: 'trends', label: 'Trends', path: '/api/v1/defi/tvl/trends' }
];

// Enhanced chart colors with more variety for better visual distinction
const CHART_COLORS = [
  '#FFBE98', // Peach fuzz - primary
  '#FF9B66', // Peach deep - secondary  
  '#FF8A80', // Coral accent - tertiary
  '#FFD9C4', // Peach soft - quaternary
  '#8B7D7B', // Warm gray - quinary
  '#A78BFA', // Purple accent
  '#34D399', // Emerald accent
  '#60A5FA', // Blue accent
  '#F59E0B', // Amber accent
  '#EF4444'  // Red accent
];

// Compact KPI Card Component with Peach Theme and Orange Hover
const EnhancedKPICard: React.FC<KPICardProps> = ({ title, value, subtitle, icon, highlighted = false }) => (
  <Card className={`
    group cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.01]
    border shadow-sm hover:shadow-md
    ${highlighted 
      ? 'border-peach-fuzz bg-gradient-to-br from-peach-light to-white hover:border-peach-deep hover:shadow-peach-deep/20' 
      : 'border-peach-soft bg-gradient-to-br from-peach-light to-white hover:border-peach-fuzz hover:shadow-peach-soft/20'
    }
  `}>
    <CardContent className="p-3">
      <div className="flex items-center gap-3">
        <div className={`
          w-10 h-10 rounded-md flex items-center justify-center border transition-all duration-300
          ${highlighted 
            ? 'bg-gradient-to-br from-peach-fuzz to-peach-deep text-white border-peach-deep group-hover:shadow-md group-hover:shadow-peach-deep/30' 
            : 'bg-gradient-to-br from-peach-soft to-peach-fuzz text-charcoal border-peach-fuzz group-hover:bg-gradient-to-br group-hover:from-peach-fuzz group-hover:to-peach-deep group-hover:text-white'
          }
        `}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-charcoal group-hover:text-orange-600 transition-colors leading-tight">
            {value}
          </p>
          <p className="text-xs font-semibold text-warm-gray group-hover:text-orange-500 mt-0.5">{title}</p>
          {subtitle && <p className="text-xs text-warm-gray group-hover:text-orange-400 mt-0.5 font-medium">{subtitle}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Enhanced JSON Viewer with Syntax Highlighting
const EnhancedJSONViewer: React.FC<{ 
  data: unknown; 
  className?: string;
}> = ({ data, className = '' }) => {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  
  const formatJSON = (obj: unknown, indent = 0, path = ''): React.ReactNode => {
    if (obj === null) return <span className="text-gray-500">null</span>;
    if (typeof obj === 'boolean') return <span className="text-blue-400">{obj.toString()}</span>;
    if (typeof obj === 'number') return <span className="text-yellow-400">{obj}</span>;
    if (typeof obj === 'string') return <span className="text-green-400">&quot;{obj}&quot;</span>;
    
    if (Array.isArray(obj)) {
      const isCollapsed = collapsed.has(path);
      return (
        <div>
          <span 
            className="text-gray-300 cursor-pointer hover:text-white"
            onClick={() => {
              const newCollapsed = new Set(collapsed);
              if (isCollapsed) newCollapsed.delete(path);
              else newCollapsed.add(path);
              setCollapsed(newCollapsed);
            }}
          >
            [{isCollapsed ? '...' : ''}
          </span>
          {!isCollapsed && (
            <div className="ml-4">
              {obj.map((item, index) => (
                <div key={index}>
                  {formatJSON(item, indent + 1, `${path}[${index}]`)}
                  {index < obj.length - 1 && <span className="text-gray-300">,</span>}
                </div>
              ))}
            </div>
          )}
          <span className="text-gray-300">]</span>
        </div>
      );
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const entries = Object.entries(obj);
      const isCollapsed = collapsed.has(path);
      return (
        <div>
          <span 
            className="text-gray-300 cursor-pointer hover:text-white"
            onClick={() => {
              const newCollapsed = new Set(collapsed);
              if (isCollapsed) newCollapsed.delete(path);
              else newCollapsed.add(path);
              setCollapsed(newCollapsed);
            }}
          >
            {'{'}
            {isCollapsed ? '...' : ''}
          </span>
          {!isCollapsed && (
            <div className="ml-4">
              {entries.map(([key, value], index) => (
                <div key={key} className="flex">
                  <span className="text-cyan-400">&quot;{key}&quot;</span>
                  <span className="text-gray-300">: </span>
                  {formatJSON(value, indent + 1, `${path}.${key}`)}
                  {index < entries.length - 1 && <span className="text-gray-300">,</span>}
                </div>
              ))}
            </div>
          )}
          <span className="text-gray-300">{'}'}</span>
        </div>
      );
    }
    
    return <span>{String(obj)}</span>;
  };

  return (
    <div className={`font-mono text-sm leading-relaxed ${className}`}>
      {formatJSON(data)}
    </div>
  );
};

// Resizable JSON Panel Component
const ResizableJSONPanel: React.FC<{
  data: unknown;
  endpoint: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  width: number;
  onWidthChange: (width: number) => void;
}> = ({ data, endpoint, isCollapsed, onToggleCollapse, width, onWidthChange }) => {
  const [copied, setCopied] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

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

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeRef.current) return;
    
    const container = resizeRef.current.parentElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newWidth = ((containerRect.right - e.clientX) / containerRect.width) * 100;
    
    // Constrain width between 20% and 60%
    const constrainedWidth = Math.max(20, Math.min(60, newWidth));
    onWidthChange(constrainedWidth);
  }, [isResizing, onWidthChange]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (isCollapsed) {
    return (
      <div className="w-12 flex flex-col items-center bg-gray-100 border-l-2 border-gray-300">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-12 w-12 p-0 rounded-none border-b border-gray-300"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 flex items-center justify-center">
          <div className="writing-mode-vertical text-xs font-semibold text-gray-600 transform rotate-180">
            JSON
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full box-border min-w-0 max-w-full overflow-hidden" style={{ width: `${width}%` }}>
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className="w-2 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex items-center justify-center group transition-colors"
        onMouseDown={handleMouseDown}
      >
        <GripVertical className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
      </div>
      
      {/* JSON Panel */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        <Card className="h-full max-w-full overflow-hidden border-2 border-gray-300 shadow-xl bg-gradient-to-br from-slate-50 to-gray-100">
          <CardHeader className="bg-gradient-to-r from-slate-100 to-gray-200 border-b-2 border-gray-300 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <CardTitle className="text-lg font-bold text-gray-800 truncate">Raw JSON Response</CardTitle>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="outline" className="text-green-700 border-green-300 bg-green-100 font-semibold px-2 py-1">
                  200 OK
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-3 border font-semibold transition-all duration-200 border-border text-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span className="whitespace-nowrap">{copied ? 'Copied!' : 'Copy'}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 px-3 border font-semibold transition-all duration-200 border-border text-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <Download className="w-3 h-3 mr-1" />
                  <span className="whitespace-nowrap">JSON</span>
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-700 font-medium mt-2">
              <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono border border-gray-300">
                {endpoint}
              </code>
            </p>
          </CardHeader>
          
          <CardContent className="p-0 h-[calc(70vh-120px)] max-w-full overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="bg-slate-900 p-4 rounded-lg border-2 border-gray-300 shadow-inner">
                <EnhancedJSONViewer 
                  data={data} 
                  className="text-sm"
                />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


// Enhanced Chart with Peach Theme and Dropdown Filter
const EnhancedChart: React.FC<{
  title: string;
  data: Array<{ name: string; value: number; color: string; percentage?: number }>;
  loading: boolean;
  onSegmentClick?: (data: ChartSegmentData) => void;
  chartType: 'lst' | 'defi';
  onChartTypeChange: (type: 'lst' | 'defi') => void;
}> = ({ title, data, loading, onSegmentClick, chartType, onChartTypeChange }) => {
  const [showLegend, setShowLegend] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  
  const colorClasses = 'from-peach-light to-white border-peach-soft';
  const headerColorClasses = 'from-peach-soft to-peach-light';

  const exportChart = (format: 'png' | 'csv') => {
    if (format === 'csv') {
      const csvContent = [
        ['Name', 'Value', 'Percentage'].join(','),
        ...data.map(item => [
          item.name,
          item.value,
          item.percentage || ((item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(2)
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className={`
      group border shadow-md hover:shadow-lg transition-all duration-300 
      bg-gradient-to-br ${colorClasses}
      hover:border-peach-fuzz hover:shadow-peach-soft/30
    `}>
      <CardHeader className={`bg-gradient-to-r ${headerColorClasses} border-b border-peach-soft p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-bold text-charcoal">{title}</CardTitle>
            <Select value={chartType} onValueChange={onChartTypeChange}>
              <SelectTrigger className="w-32 h-8 border-peach-soft bg-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="defi">All DeFi TVL</SelectItem>
                <SelectItem value="lst">LST TVL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => exportChart('csv')}
              className="h-8 w-8 p-0"
              title="Export CSV"
            >
              <Download className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLegend(!showLegend)}
              className="h-8 w-8 p-0"
              title="Toggle Legend"
            >
              <Eye className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="space-y-3 w-full">
              <Skeleton className="w-32 h-32 rounded-full mx-auto" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24 mx-auto" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  dataKey="value"
                  animationDuration={800}
                  onClick={(data) => {
                    setSelectedSegment(data.name);
                    onSegmentClick?.(data);
                  }}
                  labelLine
                  label={({ name, value, percent }) => `${name}: ${(value / 1e9).toFixed(1)}B • ${(percent * 100).toFixed(1)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={selectedSegment === entry.name ? '#2D2D2D' : 'none'}
                      strokeWidth={selectedSegment === entry.name ? 2 : 0}
                      style={{ 
                        cursor: 'pointer',
                        filter: selectedSegment && selectedSegment !== entry.name ? 'brightness(0.8)' : 'brightness(1)'
                      }}
                    />
                  ))}
                </Pie>
                <ChartTooltip 
                  formatter={(value: number, name: string, props: { payload?: ChartSegmentData }) => {
                    const percentage = props.payload?.percentage || ((value / data.reduce((sum, d) => sum + d.value, 0)) * 100);
                    return [
                      `$${(value / 1e9).toFixed(2)}B (${percentage.toFixed(1)}%)`,
                      name
                    ];
                  }}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid var(--peach-soft)',
                    borderRadius: '8px',
                    color: 'var(--charcoal)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                {showLegend && (
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                    formatter={(value) => <span className="text-charcoal font-medium text-xs">{value}</span>}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Compact LST Protocols Marquee Component
const CompactLSTProtocolsList: React.FC<{ data: TVLOverviewResponse | null; loading: boolean }> = ({ data, loading }) => {
  const [isPaused, setIsPaused] = useState(false);
  
  if (loading) {
    return (
      <Card className="border border-peach-soft shadow-sm bg-gradient-to-r from-peach-light to-white">
        <CardHeader className="bg-gradient-to-r from-peach-soft to-peach-fuzz border-b border-peach-soft p-3">
          <CardTitle className="text-sm font-bold text-charcoal flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-peach-deep" />
            Top LST Protocols on Ethereum
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2" style={{ height: '50px' }}>
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-shrink-0 h-10 bg-peach-light rounded border border-peach-soft animate-pulse" style={{ width: '180px' }} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const lstProtocols = data.data.topProtocols
    .filter(protocol => 
      ['Liquid Staking', 'Liquid Restaking'].includes(protocol.category) &&
      (protocol.chain === 'Ethereum' || protocol.chains.includes('Ethereum'))
    )
    .slice(0, 12); // Show up to 12 protocols

  return (
    <Card className="
      group border border-peach-soft shadow-sm hover:shadow-md transition-all duration-300 
      bg-gradient-to-r from-peach-light to-white
      hover:border-peach-fuzz
    ">
      <CardHeader className="bg-gradient-to-r from-peach-soft to-peach-fuzz border-b border-peach-soft p-3">
        <CardTitle className="text-sm font-bold text-charcoal flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-peach-deep" />
          Top LST Protocols on Ethereum
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 overflow-hidden" style={{ height: '50px' }}>
        <div 
          className="flex gap-3 animate-marquee hover:animate-pause cursor-pointer"
          style={{
            animation: isPaused ? 'none' : 'marquee 30s linear infinite',
            width: 'max-content'
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Duplicate items for seamless loop */}
          {[...lstProtocols, ...lstProtocols].map((protocol, index) => {
            const ethTvl = protocol.chainTvls?.find(c => c.chain === 'Ethereum')?.tvl || protocol.tvl;
            
            return (
              <div 
                key={`${protocol.id}-${index}`} 
                className="
                  flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200
                  bg-white border border-peach-soft hover:border-peach-fuzz hover:bg-peach-light
                  hover:scale-105 hover:shadow-sm
                "
                style={{ width: '180px' }}
                title={`${protocol.name} - $${(ethTvl / 1e9).toFixed(2)}B TVL`}
              >
                <div className="w-6 h-6 rounded bg-gradient-to-br from-peach-fuzz to-peach-deep flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {(index % lstProtocols.length) + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-charcoal truncate">
                    {protocol.name}
                  </p>
                  <p className="text-xs text-warm-gray">
                    ${(ethTvl / 1e9).toFixed(1)}B
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs font-bold ${
                    protocol.growth7d >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {protocol.growth7d >= 0 ? '+' : ''}{protocol.growth7d.toFixed(1)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Enhanced Dashboard Component
const EnhancedAPIInActionDashboard: React.FC<EnhancedAPIInActionDashboardProps> = ({ className = '' }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('overview');
  const [data, setData] = useState<TVLOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonPanelCollapsed, setJsonPanelCollapsed] = useState(false);
  const [jsonPanelWidth, setJsonPanelWidth] = useState(50);
  const [selectedChartFilter, setSelectedChartFilter] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'lst' | 'defi'>('defi');
  const [isDataFresh] = useState(true); // Add this for the Live badge
  const [mobileJsonOpen, setMobileJsonOpen] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await defiAPI.getTVLOverview();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and refresh
  useEffect(() => {
    fetchData();
  }, [selectedEndpoint, fetchData]);


  const handleRefresh = () => {
    fetchData();
  };

  const handleEndpointChange = (endpoint: string) => {
    setSelectedEndpoint(endpoint);
  };

  const handleChartSegmentClick = (segmentData: ChartSegmentData) => {
    setSelectedChartFilter(prevFilter => prevFilter === segmentData.name ? null : segmentData.name);
  };

  // Note: selectedChartFilter will be used for filtering functionality in future iterations
  console.log('Chart filter:', selectedChartFilter);

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
    <div className={`bg-gradient-to-br from-gray-50 to-white min-h-screen ${className}`}>
      {/* Integrated Header with Dropdown */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-peach-soft shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-peach-fuzz/20 border border-peach-soft flex items-center justify-center">
            <Activity className="w-4 h-4 text-peach-fuzz" />
          </div>
          <h1 className="text-xl font-bold text-charcoal">DeFi Market Dashboard</h1>
          <Select value={selectedEndpoint} onValueChange={handleEndpointChange}>
            <SelectTrigger className="w-[180px] border border-peach-soft bg-white font-medium text-charcoal h-9 hover:border-peach-fuzz transition-colors">
              <SelectValue placeholder="Select API View" />
            </SelectTrigger>
            <SelectContent className="border border-peach-soft">
              {ENDPOINTS.map((endpoint) => (
                <SelectItem key={endpoint.id} value={endpoint.id} className="font-medium hover:bg-peach-light">
                  {endpoint.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {isDataFresh && (
            <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-100 font-medium text-xs px-2 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse" />
              Live
            </Badge>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="h-8 px-3 border border-peach-soft font-medium text-charcoal hover:bg-peach-light hover:border-peach-fuzz transition-all"
          >
            <RefreshCw className={`w-3 h-3 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-xs">Refresh</span>
          </Button>
          
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-2 border-red-300 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg hover:shadow-xl transition-shadow">
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
                className="border-2 border-red-300 hover:bg-red-100 font-semibold transition-all"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Layout - Horizontal with KPI Cards on top */}
      <div className=" mx-auto space-y-3">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <EnhancedKPICard
              title="Total TVL"
              value={loading ? '...' : data ? `$${(data.data.totalTvl / 1e9).toFixed(1)}B` : '$0B'}
              icon={<DollarSign className="w-4 h-4" />}
            />
            
            <EnhancedKPICard
              title="LST TVL"
              value={loading ? '...' : `$${(lstTvl / 1e9).toFixed(1)}B`}
              subtitle={`${lstPercentage.toFixed(1)}% of ETH TVL`}
              icon={<Zap className="w-4 h-4" />}
            />
            
            <EnhancedKPICard
              title="Binance CEX"
              value={loading ? '...' : data ? data.data.topProtocols[0]?.name || 'N/A' : 'N/A'}
              subtitle={data ? `$${(data.data.topProtocols[0]?.tvl / 1e9).toFixed(1)}B • +${data.data.topProtocols[0]?.growth7d.toFixed(1)}%` : undefined}
              icon={<Building2 className="w-4 h-4" />}
            />
          </div>

        {/* Compact LST Protocols List */}
        <div>
          <CompactLSTProtocolsList data={data} loading={loading} />
        </div>

        {/* Main Dashboard Content - Horizontal Layout (Desktop) */}
        <div className="lg:flex h-[70vh]">
          {/* Left Side - Chart and Content */}
          <div className={`flex flex-col min-w-0 space-y-6 transition-all duration-300 ${
            jsonPanelCollapsed ? 'flex-1' : `flex-1`
          }`} style={{ width: jsonPanelCollapsed ? 'calc(100% - 48px)' : `${100 - jsonPanelWidth}%` }}>
            
            {/* Chart Section */}
            <Card className="rounded-xl border border-peach-soft shadow-md bg-white">
              <CardContent className="p-6">
                <EnhancedChart
                  title="Distribution Analysis"
                  data={chartType === 'defi' ? defiDistribution : lstDistribution}
                  loading={loading}
                  onSegmentClick={handleChartSegmentClick}
                  chartType={chartType}
                  onChartTypeChange={setChartType}
                />
              </CardContent>
            </Card>
            
          </div>

          {/* Right Side - Resizable JSON Panel */}
          <ResizableJSONPanel
            data={data}
            endpoint={currentEndpoint?.path || ''}
            isCollapsed={jsonPanelCollapsed}
            onToggleCollapse={() => setJsonPanelCollapsed(!jsonPanelCollapsed)}
            width={jsonPanelWidth}
            onWidthChange={setJsonPanelWidth}
          />
        </div>

        {/* Mobile Layout - Vertical Stack */}
        <div className="lg:hidden space-y-6">
          {/* Chart Section */}
          <Card className="rounded-xl border border-peach-soft shadow-md bg-white">
            <CardContent className="p-6">
              <EnhancedChart
                title="Distribution Analysis"
                data={chartType === 'defi' ? defiDistribution : lstDistribution}
                loading={loading}
                onSegmentClick={handleChartSegmentClick}
                chartType={chartType}
                onChartTypeChange={setChartType}
              />
            </CardContent>
          </Card>

          {/* Mobile JSON Dialog Trigger */}
          <Card className="rounded-xl border border-peach-soft shadow-md bg-white">
            <CardContent className="p-6">
              <Dialog open={mobileJsonOpen} onOpenChange={setMobileJsonOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full border border-peach-soft font-medium hover:bg-peach-light transition-all"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Raw JSON Response
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-peach-fuzz" />
                      Raw JSON Response
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <ScrollArea className="h-[60vh] p-4">
                      <div className="bg-slate-900 p-4 rounded-lg">
                        <EnhancedJSONViewer data={data} />
                      </div>
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default EnhancedAPIInActionDashboard;