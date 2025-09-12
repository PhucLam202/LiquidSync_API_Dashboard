// Authentication Types for LiquidSync DeFi Frontend

export interface User {
  id: string
  email: string | null
  fullName: string | null
  status: 'PENDING_VERIFICATION' | 'EMAIL_VERIFIED' | 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'DELETED'
  role: 'USER' | 'ADMIN'
  authType: 'EMAIL' | 'WEB3' | 'HYBRID'
  isEmailVerified: boolean
  walletAddress?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  subscription?: {
    plan: string
    requestsLimit: number
    requestsUsed: number
    resetDate: string
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string // Stored in httpOnly cookie
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    accessToken: string
  }
}

export interface ApiErrorResponse {
  success: false
  data?: {
    message: string
    details?: string
    code?: string
  }
  message?: string
  error?: string
  msg?: string
  code?: number
}

// Registration Flow Types
export interface FirstRegisterRequest {
  email: string
}

export interface FirstRegisterResponse {
  success: boolean
  message: string
  data: {
    email: string
    otpSent: boolean
    expiresAt: string
  }
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface VerifyOtpResponse {
  success: boolean
  message: string
  // Note: Backend only returns success + message, no data object per docs
}

export interface CompleteProfileRequest {
  email: string
  password: string
  fullName: string
  verificationToken?: string
}

// Login Types
export interface LoginRequest {
  email: string
  password: string
}

// Web3 Authentication Types
export interface Web3LoginRequest {
  walletAddress: string
  signature: string
  message: string
}

export interface Web3LoginResponse extends AuthResponse {
  data: AuthResponse['data'] & {
    walletAddress: string
  }
}

// Profile Types
export interface UserProfile {
  id: string
  email: string
  fullName: string
  role: 'USER' | 'ADMIN'
  subscription: 'FREE' | 'PREMIUM' | 'ENTERPRISE'
  emailVerified: boolean
  createdAt: string
  walletAddress?: string
  authType?: 'EMAIL' | 'WEB3' | 'HYBRID'
}

// Authentication Context Types
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithWallet: (walletAddress: string, signature: string, message: string) => Promise<void>
  register: (data: CompleteProfileRequest) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  linkEmailToWeb3: (email: string, walletAddress: string) => Promise<LinkEmailToWeb3Response>
  requestPasswordReset: (email: string) => Promise<void>
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>
}

// Password Reset Types
export interface RequestPasswordResetRequest {
  email: string
}

export interface RequestPasswordResetResponse {
  success: boolean
  message: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  newPassword: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

// Link Email-Web3 Types
export interface LinkEmailToWeb3Request {
  email: string
  walletAddress: string
}

export interface LinkEmailToWeb3Response {
  success: boolean
  type: 'ALREADY_LINKED' | 'EMAIL_TO_WEB3' | 'WEB3_TO_EMAIL'
  message: string
  data: {
    accessToken: string
    user: User
    linkedAt: string
  }
}

// API Client Response Types
export type ApiResponse<T = unknown> = {
  success: true
  data: T
} | {
  success: false
  error: string
  message: string
  code?: string
}