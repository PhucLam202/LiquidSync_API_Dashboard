// Authentication API Client for LiquidSync DeFi Frontend
'use client'

import {
  AuthResponse,
  FirstRegisterRequest,
  FirstRegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  CompleteProfileRequest,
  LoginRequest,
  Web3LoginRequest,
  Web3LoginResponse,
  UserProfile,
  ApiErrorResponse,
  RequestPasswordResetRequest,
  RequestPasswordResetResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  LinkEmailToWeb3Request,
  LinkEmailToWeb3Response
} from '@/types/auth'
import { getApiConfig } from '@/lib/api-config'

export class AuthAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'AuthAPIError'
  }

  /**
   * Get user-friendly error message based on error code
   */
  getUserFriendlyMessage(): string {
    if (!this.code) {
      return this.message
    }

    const errorMessages: Record<string, string> = {
      // Authentication Errors (401)
      'LOGIN_EMAIL_NOT_FOUND': 'No account found with this email address. Please check your email or create a new account.',
      'LOGIN_INVALID_PASSWORD': 'Incorrect password. Please try again or reset your password.',
      'TOKEN_EXPIRED': 'Your session has expired. Please log in again.',
      'INVALID_API_KEY': 'Invalid API key provided.',

      // Authorization Errors (403)
      'LOGIN_ACCOUNT_PENDING_VERIFICATION': 'Please verify your email address before logging in. Check your inbox for the verification email.',
      'LOGIN_ACCOUNT_SUSPENDED': 'Your account has been suspended. Please contact support for assistance.',
      'LOGIN_ACCOUNT_INACTIVE': 'Your account is inactive. Please contact support to reactivate your account.',
      'INSUFFICIENT_PERMISSIONS': 'You don\'t have permission to perform this action.',

      // Validation Errors (400)
      'VALIDATION_EMAIL_REQUIRED': 'Email address is required.',
      'VALIDATION_EMAIL_INVALID': 'Please enter a valid email address.',
      'PASSWORD_WEAK': 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
      'INVALID_OTP': 'Invalid or expired verification code. Please check your email for a new code.',
      'INVALID_USER_STATUS_FOR_EMAIL_VERIFICATION': 'This account has already been verified or is in an invalid state. Please try logging in or contact support.',

      // Rate Limiting (429)
      'RATE_LIMIT_EXCEEDED': 'Too many requests. Please wait a moment before trying again.',
      'SUBSCRIPTION_LIMIT_EXCEEDED': 'You\'ve reached your subscription limit. Please upgrade your plan or wait for the reset period.',
    }

    return errorMessages[this.code] || this.message
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(): boolean {
    return this.statusCode === 401 || [
      'LOGIN_EMAIL_NOT_FOUND',
      'LOGIN_INVALID_PASSWORD', 
      'TOKEN_EXPIRED',
      'INVALID_API_KEY'
    ].includes(this.code || '')
  }

  /**
   * Check if error is authorization related
   */
  isAuthzError(): boolean {
    return this.statusCode === 403 || [
      'LOGIN_ACCOUNT_PENDING_VERIFICATION',
      'LOGIN_ACCOUNT_SUSPENDED',
      'LOGIN_ACCOUNT_INACTIVE', 
      'INSUFFICIENT_PERMISSIONS'
    ].includes(this.code || '')
  }

  /**
   * Check if error is validation related
   */
  isValidationError(): boolean {
    return this.statusCode === 400 || [
      'VALIDATION_EMAIL_REQUIRED',
      'VALIDATION_EMAIL_INVALID',
      'PASSWORD_WEAK',
      'INVALID_OTP',
      'INVALID_USER_STATUS_FOR_EMAIL_VERIFICATION'
    ].includes(this.code || '')
  }

  /**
   * Check if error is rate limiting related
   */
  isRateLimitError(): boolean {
    return this.statusCode === 429 || [
      'RATE_LIMIT_EXCEEDED',
      'SUBSCRIPTION_LIMIT_EXCEEDED'
    ].includes(this.code || '')
  }

  /**
   * Check if user needs to verify email
   */
  needsEmailVerification(): boolean {
    return this.code === 'LOGIN_ACCOUNT_PENDING_VERIFICATION'
  }

  /**
   * Check if account is suspended/inactive
   */
  isAccountIssue(): boolean {
    return ['LOGIN_ACCOUNT_SUSPENDED', 'LOGIN_ACCOUNT_INACTIVE'].includes(this.code || '')
  }

  /**
   * Check if account status prevents verification
   */
  isAccountStatusIssue(): boolean {
    return this.code === 'INVALID_USER_STATUS_FOR_EMAIL_VERIFICATION'
  }
}

export class AuthAPIClient {
  private baseURL: string
  private accessToken: string | null = null

  constructor() {
    this.baseURL = this.getApiBaseUrl()
    // Only throw error in browser environment, not during build
    if (!this.baseURL && typeof window !== 'undefined') {
      throw new Error('API base URL could not be determined')
    }
    
    // Load access token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token')
    }
  }

  /**
   * Get API base URL based on environment
   */
  private getApiBaseUrl(): string {
    const config = getApiConfig()
    
    // Log configuration in development for debugging
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      console.log('🔗 AuthAPI Config:', {
        baseUrl: config.baseUrl,
        environment: config.environment,
        autoDetected: config.isAutoDetected
      })
    }
    
    return config.baseUrl
  }

  /**
   * Set access token for authenticated requests
   */
  setAccessToken(token: string | null) {
    this.accessToken = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token)
      } else {
        localStorage.removeItem('access_token')
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
   * Make HTTP request with error handling and token management
   */
  private async makeRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Runtime check for API base URL
    if (!this.baseURL) {
      throw new AuthAPIError('API base URL not configured. Please set NEXT_PUBLIC_API_BASE_URL environment variable.')
    }
    
    const url = `${this.baseURL}${endpoint}`
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Add authorization header if we have a token
    if (this.accessToken && !endpoint.includes('/auth/refresh-token')) {
      defaultHeaders.Authorization = `Bearer ${this.accessToken}`
    }

    const requestOptions: RequestInit = {
      ...options,
      headers: defaultHeaders,
      credentials: 'include', // Include cookies for refresh token
    }

    try {
      const response = await fetch(url, requestOptions)
      
      // Check for new access token in response headers
      const newAccessToken = response.headers.get('X-New-Access-Token')
      if (newAccessToken) {
        this.setAccessToken(newAccessToken)
      }

      if (!response.ok) {
        // Try to parse error response
        let errorData: ApiErrorResponse
        try {
          errorData = await response.json()
        } catch {
          throw new AuthAPIError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status
          )
        }

        // Handle new backend error format
        const errorMessage = errorData.data?.message || errorData.message || errorData.error || 'Request failed'
        const errorCode = errorData.data?.code || (typeof errorData.code === 'string' ? errorData.code : undefined)
        
        throw new AuthAPIError(
          errorMessage,
          response.status,
          errorCode
        )
      }

      // Handle empty responses (e.g., 204 No Content)
      if (response.status === 204) {
        return {} as T
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof AuthAPIError) {
        throw error
      }

      // Network or other errors
      throw new AuthAPIError(
        error instanceof Error ? error.message : 'Network request failed'
      )
    }
  }

  /**
   * Step 1: Send OTP to email for registration
   */
  async firstRegister(data: FirstRegisterRequest): Promise<FirstRegisterResponse> {
    return this.makeRequest<FirstRegisterResponse>('/api/v1/auth/first-register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Step 2: Verify OTP code
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    return this.makeRequest<VerifyOtpResponse>('/api/v1/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Step 3: Complete user profile and registration
   */
  async completeProfile(data: CompleteProfileRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/api/v1/auth/complete-profile', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Set access token from response
    if (response.success && response.data.accessToken) {
      this.setAccessToken(response.data.accessToken)
    }

    return response
  }

  /**
   * Email/Password login
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Set access token from response
    if (response.success && response.data.accessToken) {
      this.setAccessToken(response.data.accessToken)
    }

    return response
  }

  /**
   * Web3 wallet login
   */
  async loginWithWallet(data: Web3LoginRequest): Promise<Web3LoginResponse> {
    const response = await this.makeRequest<Web3LoginResponse>('/api/v1/auth/web3-login', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Set access token from response
    if (response.success && response.data.accessToken) {
      this.setAccessToken(response.data.accessToken)
    }

    return response
  }

  /**
   * Refresh access token using httpOnly refresh token
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/api/v1/auth/refresh-token', {
      method: 'POST',
    })

    // Set new access token from response
    if (response.success && response.data.accessToken) {
      this.setAccessToken(response.data.accessToken)
    }

    return response
  }

  /**
   * Logout user and clear tokens
   */
  async logout(): Promise<void> {
    try {
      await this.makeRequest('/api/v1/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      // Even if logout fails, clear local tokens
      console.warn('Logout request failed, but clearing local tokens:', error)
    } finally {
      this.setAccessToken(null)
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<{success: boolean, data: UserProfile}> {
    return this.makeRequest<{success: boolean, data: UserProfile}>('/api/v1/auth/profile')
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return this.makeRequest<UserProfile>('/api/v1/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * Get user API usage statistics
   */
  async getUsageStats(): Promise<unknown> {
    return this.makeRequest('/api/v1/users/usage')
  }

  /**
   * Request password reset - send OTP to email
   */
  async requestPasswordReset(data: RequestPasswordResetRequest): Promise<RequestPasswordResetResponse> {
    return this.makeRequest<RequestPasswordResetResponse>('/api/v1/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Reset password using OTP
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return this.makeRequest<ResetPasswordResponse>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Link email to Web3 account (hybrid authentication)
   */
  async linkEmailToWeb3(data: LinkEmailToWeb3Request): Promise<LinkEmailToWeb3Response> {
    const response = await this.makeRequest<LinkEmailToWeb3Response>('/api/v1/auth/link-email-to-web3', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Set access token if linking successful
    if (response.success && response.data.accessToken) {
      this.setAccessToken(response.data.accessToken)
    }

    return response
  }

  /**
   * Make authenticated request to any endpoint
   * Useful for making requests to other API endpoints
   */
  async makeAuthenticatedRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.accessToken) {
      throw new AuthAPIError('No access token available. Please login first.')
    }

    return this.makeRequest<T>(endpoint, options)
  }
}

// Export singleton instance
export const authAPI = new AuthAPIClient()

// Export for testing or custom instances
export default AuthAPIClient