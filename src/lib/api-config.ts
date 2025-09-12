/**
 * API Configuration Helper
 * Centralizes API endpoint management and environment detection
 */

export interface ApiConfig {
  baseUrl: string
  environment: 'development' | 'production' | 'staging'
  isAutoDetected: boolean
}

/**
 * Get API configuration based on environment
 */
export function getApiConfig(): ApiConfig {
  const explicitUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const nodeEnv = process.env.NODE_ENV
  
  // If explicitly set, use it
  if (explicitUrl) {
    return {
      baseUrl: explicitUrl,
      environment: nodeEnv === 'production' ? 'production' : 'development',
      isAutoDetected: false
    }
  }

  // Auto-detect based on NODE_ENV
  let baseUrl: string
  let environment: 'development' | 'production' | 'staging'

  switch (nodeEnv) {
    case 'development':
      baseUrl = 'https://liquidsyncapi-staging.up.railway.app'
      environment = 'development'
      break
    case 'production':
      baseUrl = 'https://defiapi-production.up.railway.app'
      environment = 'production'
      break
    default:
      baseUrl = 'https://liquidsyncapi-staging.up.railway.app'
      environment = 'staging'
      break
  }

  return {
    baseUrl,
    environment,
    isAutoDetected: true
  }
}

/**
 * Debug helper to log API configuration
 */
export function logApiConfig(): void {
  if (typeof window === 'undefined') return
  
  const config = getApiConfig()
  console.log('🔗 API Configuration:', {
    baseUrl: config.baseUrl,
    environment: config.environment,
    isAutoDetected: config.isAutoDetected,
    nodeEnv: process.env.NODE_ENV,
    explicitUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'not set'
  })
}

/**
 * Environment detection helpers
 */
export const isDevelopment = () => process.env.NODE_ENV === 'development'
export const isProduction = () => process.env.NODE_ENV === 'production'
export const isStaging = () => !isDevelopment() && !isProduction()