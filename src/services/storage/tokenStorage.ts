// JWT Token Manager for LiquidSync DeFi Frontend
'use client'

import { authAPI, AuthAPIError } from '@/services/api/auth.service'

export interface TokenPayload {
  sub: string // user ID
  email: string
  role: string
  iat: number // issued at
  exp: number // expiration
}

export class TokenManager {
  private accessToken: string | null = null
  private tokenRefreshPromise: Promise<string | null> | null = null
  private refreshTimeoutId: NodeJS.Timeout | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token')
      
      // Check if token is expired and try to refresh on initialization
      if (this.accessToken && this.isTokenExpired(this.accessToken)) {
        this.refreshToken()
      } else if (this.accessToken) {
        // Set up automatic refresh for valid token
        this.scheduleTokenRefresh()
      }
    }
  }

  /**
   * Set access token and schedule refresh
   */
  setAccessToken(token: string | null) {
    this.accessToken = token
    
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token)
        this.scheduleTokenRefresh()
      } else {
        localStorage.removeItem('access_token')
        this.clearRefreshTimeout()
      }
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken
  }

  /**
   * Parse JWT token without verification (client-side only for expiration check)
   */
  private parseToken(token: string): TokenPayload | null {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null

      const payload = JSON.parse(atob(parts[1]))
      return payload as TokenPayload
    } catch {
      return null
    }
  }

  /**
   * Check if token is expired or will expire soon (within 5 minutes)
   */
  private isTokenExpired(token: string, bufferMinutes: number = 5): boolean {
    const payload = this.parseToken(token)
    if (!payload || !payload.exp) return true

    const now = Math.floor(Date.now() / 1000)
    const bufferTime = bufferMinutes * 60
    return payload.exp <= (now + bufferTime)
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  private getTimeUntilExpiry(token: string): number {
    const payload = this.parseToken(token)
    if (!payload || !payload.exp) return 0

    const now = Math.floor(Date.now() / 1000)
    const expiresIn = payload.exp - now
    return Math.max(0, (expiresIn - 300) * 1000) // Refresh 5 minutes before expiry
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh() {
    this.clearRefreshTimeout()

    if (!this.accessToken) return

    const refreshTime = this.getTimeUntilExpiry(this.accessToken)
    
    if (refreshTime > 0) {
      this.refreshTimeoutId = setTimeout(() => {
        this.refreshToken()
      }, refreshTime)
    }
  }

  /**
   * Clear refresh timeout
   */
  private clearRefreshTimeout() {
    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId)
      this.refreshTimeoutId = null
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh requests
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise
    }

    this.tokenRefreshPromise = this._performTokenRefresh()

    try {
      const newToken = await this.tokenRefreshPromise
      return newToken
    } finally {
      this.tokenRefreshPromise = null
    }
  }

  /**
   * Internal method to perform token refresh
   */
  private async _performTokenRefresh(): Promise<string | null> {
    try {
      const response = await authAPI.refreshToken()
      
      if (response.success && response.data.accessToken) {
        this.setAccessToken(response.data.accessToken)
        
        // Emit token refresh event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:token-refreshed', { 
            detail: { source: 'manual-refresh' } 
          }))
        }
        
        return response.data.accessToken
      }
      
      // Refresh failed, clear tokens
      this.clearTokens()
      return null
    } catch (error) {
      console.warn('Token refresh failed:', error)
      this.clearTokens()
      
      // If refresh fails with 401, redirect to login
      if (error instanceof AuthAPIError && error.statusCode === 401) {
        this.handleAuthenticationError()
      }
      
      return null
    }
  }

  /**
   * Get valid access token, refreshing if necessary
   */
  async getValidAccessToken(): Promise<string | null> {
    if (!this.accessToken) {
      return null
    }

    // If token is expired or will expire soon, refresh it
    if (this.isTokenExpired(this.accessToken)) {
      const newToken = await this.refreshToken()
      return newToken
    }

    return this.accessToken
  }

  /**
   * Make authenticated request with automatic token refresh
   */
  async makeAuthenticatedRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getValidAccessToken()
    
    if (!token) {
      throw new AuthAPIError('No valid access token available')
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    // Check if we got a new token in response headers (auto-refresh by backend middleware)
    const newAccessToken = response.headers.get('X-New-Access-Token')
    if (newAccessToken) {
      this.setAccessToken(newAccessToken)
      
      // Emit token refresh event for components that need to react
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:token-refreshed', { 
          detail: { source: 'auto-refresh-header' } 
        }))
      }
    }

    // If we get 401, try to refresh token once
    if (response.status === 401 && !(options.headers as Record<string, string>)?.['X-Retry-After-Refresh']) {
      const refreshedToken = await this.refreshToken()
      
      if (refreshedToken) {
        // Retry request with new token
        return this.makeAuthenticatedRequest(url, {
          ...options,
          headers: {
            ...options.headers,
            'X-Retry-After-Refresh': 'true', // Prevent infinite retry
          },
        })
      }
    }

    return response
  }

  /**
   * Clear all tokens and cleanup
   */
  clearTokens() {
    this.accessToken = null
    this.clearRefreshTimeout()
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }
  }

  /**
   * Handle authentication errors (redirect to login)
   */
  private handleAuthenticationError() {
    this.clearTokens()
    
    // Only redirect if we're not already on login page
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      // Store current path to redirect back after login
      const currentPath = window.location.pathname + window.location.search
      localStorage.setItem('redirect_after_login', currentPath)
      
      // Redirect to login
      window.location.href = '/login'
    }
  }

  /**
   * Check if user is authenticated with valid token
   */
  isAuthenticated(): boolean {
    if (!this.accessToken) return false
    return !this.isTokenExpired(this.accessToken, 0) // No buffer for authentication check
  }

  /**
   * Get user information from token payload
   */
  getUserFromToken(): TokenPayload | null {
    if (!this.accessToken) return null
    return this.parseToken(this.accessToken)
  }

  /**
   * Cleanup when component unmounts or page is unloaded
   */
  cleanup() {
    this.clearRefreshTimeout()
  }
}

// Export singleton instance
export const tokenManager = new TokenManager()

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    tokenManager.cleanup()
  })
}

export default TokenManager