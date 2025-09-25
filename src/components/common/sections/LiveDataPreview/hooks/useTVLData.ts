'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TVLOverviewResponse, APIFilters } from '../types/api.types';
import { defiAPI, DefiAPIError } from '../services/defi-api.service';

interface UseTVLDataOptions {
  /** Auto-refresh interval in seconds (default: 60) */
  refreshInterval?: number;
  /** Enable automatic polling (default: true) */
  enablePolling?: boolean;
  /** Initial filters to apply */
  initialFilters?: APIFilters;
  /** Retry configuration */
  retryAttempts?: number;
  /** Enable query when component mounts (default: true) */
  enabled?: boolean;
}

interface UseTVLDataReturn {
  /** Current data from the API */
  data: TVLOverviewResponse | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: DefiAPIError | null;
  /** Last successful update timestamp */
  lastUpdated: Date | null;
  /** Response time for last request in ms */
  responseTime: number | null;
  /** Current filters applied */
  filters: APIFilters | null;
  /** Update filters and refetch data */
  updateFilters: (newFilters: APIFilters) => void;
  /** Manually refetch data */
  refetch: () => Promise<void>;
  /** Clear error state */
  clearError: () => void;
  /** Check if data is considered fresh */
  isDataFresh: boolean;
  /** Get health check status */
  healthStatus: 'healthy' | 'unhealthy' | 'checking' | 'unknown';
}

const useTVLData = (options: UseTVLDataOptions = {}): UseTVLDataReturn => {
  const {
    refreshInterval = 60,
    enablePolling = true,
    initialFilters = null,
    retryAttempts = 3,
    enabled = true
  } = options;

  // State management
  const [filters, setFilters] = useState<APIFilters | null>(initialFilters);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'unhealthy' | 'checking' | 'unknown'>('unknown');
  
  // Refs for performance tracking
  const requestStartTime = useRef<number>(0);
  
  // Query key that includes filters for proper caching
  const queryKey = ['tvl-overview', filters];

  // Main data fetching query
  const {
    data,
    isLoading,
    error,
    refetch: queryRefetch,
  } = useQuery({
    queryKey,
    queryFn: async (): Promise<TVLOverviewResponse> => {
      requestStartTime.current = Date.now();
      
      try {
        const result = await defiAPI.getTVLOverview(filters || undefined);
        
        // Track response time
        const responseTimeMs = Date.now() - requestStartTime.current;
        setResponseTime(responseTimeMs);
        setLastUpdated(new Date());
        
        return result;
      } catch (error) {
        // Track failed response time
        const responseTimeMs = Date.now() - requestStartTime.current;
        setResponseTime(responseTimeMs);
        
        if (error instanceof DefiAPIError) {
          throw error;
        }
        throw new DefiAPIError('Failed to fetch TVL data');
      }
    },
    enabled,
    refetchInterval: enablePolling ? refreshInterval * 1000 : false,
    retry: retryAttempts,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Health check query
  const { refetch: checkHealth } = useQuery({
    queryKey: ['api-health'],
    queryFn: async () => {
      setHealthStatus('checking');
      try {
        const healthData = await defiAPI.getHealthCheck();
        setHealthStatus(healthData.status === 'healthy' ? 'healthy' : 'unhealthy');
        return healthData;
      } catch (error) {
        setHealthStatus('unhealthy');
        throw error;
      }
    },
    enabled: false, // Only run manually
    retry: 1
  });

  // Update filters and trigger refetch
  const updateFilters = useCallback((newFilters: APIFilters) => {
    setFilters(newFilters);
    // The query will automatically refetch due to queryKey change
  }, []);

  // Manual refetch function
  const refetch = useCallback(async () => {
    await queryRefetch();
  }, [queryRefetch]);

  // Clear error state
  const clearError = useCallback(() => {
    // Clear error is handled automatically by react-query on successful refetch
    queryRefetch();
  }, [queryRefetch]);

  // Check if data is fresh (less than 5 minutes old)
  const isDataFresh = lastUpdated ? (Date.now() - lastUpdated.getTime()) < 5 * 60 * 1000 : false;

  // Run health check on mount and periodically
  useEffect(() => {
    if (enabled) {
      checkHealth();
      
      // Check health every 5 minutes
      const healthInterval = setInterval(() => {
        checkHealth();
      }, 5 * 60 * 1000);

      return () => clearInterval(healthInterval);
    }
  }, [enabled, checkHealth]);

  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && data && responseTime) {
      console.log('🚀 TVL Data Performance:', {
        responseTime: `${responseTime}ms`,
        dataSize: JSON.stringify(data).length,
        lastUpdated: lastUpdated?.toISOString(),
        filters: filters,
        isDataFresh
      });
    }
  }, [data, responseTime, lastUpdated, filters, isDataFresh]);

  return {
    data: data || null,
    loading: isLoading,
    error: error instanceof DefiAPIError ? error : null,
    lastUpdated,
    responseTime,
    filters,
    updateFilters,
    refetch,
    clearError,
    isDataFresh,
    healthStatus
  };
};

export default useTVLData;