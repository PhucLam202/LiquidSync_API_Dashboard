'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI, AuthAPIError } from '@/services/api/auth.service'
import { tokenManager } from '@/services/storage/tokenStorage'
import {
  User,
  AuthContextType,
  CompleteProfileRequest,
  FirstRegisterRequest,
  VerifyOtpRequest,
  LoginRequest,
  Web3LoginRequest,
  LinkEmailToWeb3Request,
  LinkEmailToWeb3Response,
  RequestPasswordResetRequest,
  ResetPasswordRequest
} from '@/types/auth'

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  /**
   * Initialize authentication state from stored tokens
   */
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Check if we have a valid token
      const hasValidToken = tokenManager.isAuthenticated()
      
      if (hasValidToken) {
        // Try to get user profile
        await fetchUserProfile()
      } else {
        // No valid token, clear state
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      // Clear invalid auth state
      await handleAuthFailure()
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Initialize authentication state on mount
   */
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  /**
   * Fetch user profile from API
   */
  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile()
      if (response.success) {
        const profile = response.data
        setUser({
          id: profile.id,
          email: profile.email,
          fullName: profile.fullName,
          status: 'ACTIVE', // Assuming active if profile fetch succeeds
          role: profile.role,
          authType: profile.authType || 'EMAIL',
          isEmailVerified: profile.emailVerified,
          walletAddress: profile.walletAddress,
          createdAt: profile.createdAt,
          updatedAt: profile.createdAt, // Use createdAt as updatedAt if not available
          subscription: {
            plan: profile.subscription,
            requestsLimit: 1000, // Default values - these should come from API
            requestsUsed: 0,
            resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          }
        })
        setIsAuthenticated(true)
      } else {
        throw new Error('Failed to fetch profile')
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      throw error
    }
  }

  /**
   * Handle authentication failure by clearing state
   */
  const handleAuthFailure = async () => {
    setUser(null)
    setIsAuthenticated(false)
    tokenManager.clearTokens()
  }

  /**
   * Email/Password login
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true)
      
      const loginData: LoginRequest = { email, password }
      const response = await authAPI.login(loginData)
      
      if (response.success) {
        // Update token manager
        tokenManager.setAccessToken(response.data.accessToken)
        
        // Set user state
        setUser(response.data.user)
        setIsAuthenticated(true)
        
        // Check for redirect path
        const redirectPath = localStorage.getItem('redirect_after_login')
        if (redirectPath) {
          localStorage.removeItem('redirect_after_login')
          router.push(redirectPath)
        } else {
          router.push('/dashboard')
        }
      } else {
        throw new AuthAPIError('Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      
      // Enhance error with user-friendly messages
      if (error instanceof AuthAPIError) {
        const friendlyMessage = error.getUserFriendlyMessage()
        throw new AuthAPIError(friendlyMessage, error.statusCode, error.code)
      }
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  /**
   * Web3 wallet login
   */
  const loginWithWallet = useCallback(async (
    walletAddress: string, 
    signature: string, 
    message: string
  ): Promise<void> => {
    try {
      setIsLoading(true)
      
      const web3LoginData: Web3LoginRequest = { walletAddress, signature, message }
      const response = await authAPI.loginWithWallet(web3LoginData)
      
      if (response.success) {
        // Update token manager
        tokenManager.setAccessToken(response.data.accessToken)
        
        // Set user state with proper wallet address  
        setUser({
          ...response.data.user,
          authType: 'WEB3', // Ensure auth type is set
          walletAddress: response.data.user.walletAddress || response.data.walletAddress || walletAddress
        })
        setIsAuthenticated(true)
        
        // Check for redirect path
        const redirectPath = localStorage.getItem('redirect_after_login')
        if (redirectPath) {
          localStorage.removeItem('redirect_after_login')
          router.push(redirectPath)
        } else {
          router.push('/dashboard')
        }
      } else {
        throw new AuthAPIError('Web3 login failed')
      }
    } catch (error) {
      console.error('Web3 login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  /**
   * Complete registration process (3-step flow)
   */
  const register = useCallback(async (data: CompleteProfileRequest): Promise<void> => {
    try {
      setIsLoading(true)
      
      const response = await authAPI.completeProfile(data)
      
      if (response.success) {
        // Update token manager
        tokenManager.setAccessToken(response.data.accessToken)
        
        // Set user state
        setUser(response.data.user)
        setIsAuthenticated(true)
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        throw new AuthAPIError('Registration completion failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  /**
   * Logout user
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      
      // Call logout API to invalidate refresh token
      await authAPI.logout()
    } catch (error) {
      console.error('Logout API error:', error)
      // Continue with local logout even if API fails
    } finally {
      // Clear local state regardless of API success
      await handleAuthFailure()
      setIsLoading(false)
      
      // Redirect to home page
      router.push('/')
    }
  }, [router])

  /**
   * Refresh authentication (called by token manager or manually)
   */
  const refreshAuth = useCallback(async (): Promise<void> => {
    try {
      const newToken = await tokenManager.refreshToken()
      
      if (newToken) {
        // Fetch updated user profile
        await fetchUserProfile()
      } else {
        // Refresh failed, clear auth state
        await handleAuthFailure()
      }
    } catch (error) {
      console.error('Auth refresh failed:', error)
      await handleAuthFailure()
    }
  }, [])

  /**
   * Link email to Web3 account (hybrid authentication)
   */
  const linkEmailToWeb3 = useCallback(async (email: string, walletAddress: string): Promise<LinkEmailToWeb3Response> => {
    try {
      setIsLoading(true)
      
      const linkData: LinkEmailToWeb3Request = { email, walletAddress }
      const response = await authAPI.linkEmailToWeb3(linkData)
      
      if (response.success) {
        // Update token manager
        tokenManager.setAccessToken(response.data.accessToken)
        
        // Set updated user state
        setUser(response.data.user)
        setIsAuthenticated(true)
      }
      
      return response
    } catch (error) {
      console.error('Link email to Web3 error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Request password reset - send OTP to email
   */
  const requestPasswordReset = useCallback(async (email: string): Promise<void> => {
    try {
      setIsLoading(true)
      
      const data: RequestPasswordResetRequest = { email }
      const response = await authAPI.requestPasswordReset(data)
      
      if (!response.success) {
        throw new AuthAPIError('Failed to send password reset email')
      }
    } catch (error) {
      console.error('Request password reset error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Reset password using OTP
   */
  const resetPassword = useCallback(async (email: string, otp: string, newPassword: string): Promise<void> => {
    try {
      setIsLoading(true)
      
      const data: ResetPasswordRequest = { email, otp, newPassword }
      const response = await authAPI.resetPassword(data)
      
      if (!response.success) {
        throw new AuthAPIError('Failed to reset password')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithWallet,
    register,
    logout,
    refreshAuth,
    linkEmailToWeb3,
    requestPasswordReset,
    resetPassword
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

/**
 * Hook for registration flow (separate from main auth context)
 */
export function useRegistrationFlow() {
  const [isLoading, setIsLoading] = useState(false)

  const sendOTP = useCallback(async (email: string): Promise<void> => {
    try {
      setIsLoading(true)
      
      const data: FirstRegisterRequest = { email }
      const response = await authAPI.firstRegister(data)
      
      if (!response.success) {
        throw new AuthAPIError('Failed to send OTP')
      }
      
      // Store email for next steps
      localStorage.setItem('signup_email', email)
    } catch (error) {
      console.error('Send OTP error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verifyOTP = useCallback(async (email: string, otp: string): Promise<void> => {
    try {
      setIsLoading(true)
      
      const data: VerifyOtpRequest = { email, otp }
      const response = await authAPI.verifyOtp(data)
      
      if (!response.success) {
        throw new AuthAPIError('Invalid or expired OTP')
      }
      
      // Note: Backend verify-otp response only contains success + message
      // No additional data or tokens are provided per API documentation
    } catch (error) {
      console.error('Verify OTP error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    sendOTP,
    verifyOTP,
    isLoading
  }
}

export default AuthProvider