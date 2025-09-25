'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertCircle,
  Zap
} from 'lucide-react';

import EnhancedAPIInActionDashboard from './EnhancedAPIInActionDashboard';

import useTVLData from '../hooks/useTVLData';

interface EnhancedLiveDataPreviewProps {
  className?: string;
}


const EnhancedLiveDataPreview: React.FC<EnhancedLiveDataPreviewProps> = ({
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before using queries
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch TVL data with auto-refresh (only after mounting)
  const {
    error,
    responseTime,
    clearError,
    healthStatus
  } = useTVLData({
    refreshInterval: 60, // Refresh every 60 seconds
    enablePolling: mounted, // Only poll when mounted
    enabled: mounted // Only enable query when mounted
  });

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

        {/* Main Content - Remove outer border wrapper */}
        <div className="bg-transparent">
          <EnhancedAPIInActionDashboard />
        </div>

      </div>
    </section>
  );
};

export default EnhancedLiveDataPreview;