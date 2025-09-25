/**
 * DeFi API Client for Live Data Preview
 * Handles fetching and caching of DeFi TVL and protocol data
 */
'use client';

import { TVLOverviewResponse, APIFilters } from '../types/api.types';
import { getApiConfig } from '@/lib/api-config';

export class DefiAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'DefiAPIError';
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(): string {
    if (this.statusCode === 404) {
      return 'DeFi data not found. Please try again later.';
    }
    if (this.statusCode === 429) {
      return 'Too many requests. Please wait a moment before trying again.';
    }
    if (this.statusCode === 500) {
      return 'DeFi data service is temporarily unavailable. Please try again later.';
    }
    return this.message || 'Failed to fetch DeFi data. Please try again.';
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return this.statusCode === 500 || this.statusCode === 503 || this.statusCode === 429;
  }
}

export class DefiAPIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = this.getApiBaseUrl();
    
    // Only throw error in browser environment, not during build
    if (!this.baseURL && typeof window !== 'undefined') {
      throw new Error('API base URL could not be determined');
    }
  }

  /**
   * Get API base URL based on environment
   */
  private getApiBaseUrl(): string {
    const config = getApiConfig();
    
    // Log configuration in development for debugging
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      console.log('🔗 DefiAPI Config:', {
        baseUrl: config.baseUrl,
        environment: config.environment,
        autoDetected: config.isAutoDetected
      });
    }
    
    return config.baseUrl;
  }

  /**
   * Make HTTP request with error handling and retry logic
   */
  private async makeRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    // Runtime check for API base URL
    if (!this.baseURL) {
      throw new DefiAPIError('API base URL not configured. Please set NEXT_PUBLIC_API_BASE_URL environment variable.');
    }
    
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const requestOptions: RequestInit = {
      ...options,
      headers: defaultHeaders,
      // Add cache control for better performance
      cache: 'no-store', // Always get fresh data for live demo
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorMessage = `Failed to fetch from ${endpoint}`;
        const error = new DefiAPIError(errorMessage, response.status, endpoint);
        
        // Retry logic for retryable errors
        if (error.isRetryable() && retryCount < 3) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.makeRequest<T>(endpoint, options, retryCount + 1);
        }
        
        throw error;
      }

      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof DefiAPIError) {
        throw error;
      }

      // Network or other errors
      throw new DefiAPIError(
        error instanceof Error ? error.message : 'Network request failed',
        undefined,
        endpoint
      );
    }
  }

  /**
   * Build query string from filters
   */
  private buildQueryString(filters?: APIFilters): string {
    if (!filters) return '';
    
    const params = new URLSearchParams();
    
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters.growth && filters.growth !== 'all') {
      params.append('growth', filters.growth);
    }
    if (filters.timeframe && filters.timeframe !== '7d') {
      params.append('timeframe', filters.timeframe);
    }
    if (filters.limit && filters.limit !== 50) {
      params.append('limit', filters.limit.toString());
    }
    if (filters.chain && filters.chain !== 'all') {
      params.append('chain', filters.chain);
    }
    
    return params.toString() ? `?${params.toString()}` : '';
  }

  /**
   * Get TVL overview data with optional filters
   */
  async getTVLOverview(filters?: APIFilters): Promise<TVLOverviewResponse> {
    const queryString = this.buildQueryString(filters);
    const endpoint = `/api/v1/defi/tvl/overview${queryString}`;
    
    return this.makeRequest<TVLOverviewResponse>(endpoint);
  }

  /**
   * Generate API call example for given filters
   */
  generateAPIExample(filters?: APIFilters, format: 'curl' | 'axios' | 'fetch' = 'curl'): string {
    const queryString = this.buildQueryString(filters);
    const url = `${this.baseURL}/api/v1/defi/tvl/overview${queryString}`;
    
    switch (format) {
      case 'curl':
        return `curl -X GET "${url}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;
      
      case 'axios':
        return `const response = await axios.get('${url}', {
  headers: { 
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});`;
      
      case 'fetch':
        return `const response = await fetch('${url}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();`;
      
      default:
        return url;
    }
  }

  /**
   * Get supported categories (for filter dropdown)
   */
  async getSupportedCategories(): Promise<string[]> {
    // This could be a separate endpoint, but for now we'll derive from overview data
    const data = await this.getTVLOverview();
    const categories = [...new Set(data.data.topProtocols.map(p => p.category))];
    return categories.sort();
  }

  /**
   * Get health check for API status
   */
  async getHealthCheck(): Promise<{ status: string; timestamp: string; responseTime: number }> {
    const startTime = Date.now();
    
    try {
      await this.makeRequest('/api/v1/health');
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        responseTime
      };
    } catch {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        responseTime
      };
    }
  }
}

// Export singleton instance
export const defiAPI = new DefiAPIClient();

// Export for testing or custom instances
export default DefiAPIClient;