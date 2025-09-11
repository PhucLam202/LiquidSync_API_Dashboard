'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent } from '@/components/ui/card'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store current path to redirect back after login
      if (pathname !== '/login' && pathname !== '/signup') {
        localStorage.setItem('redirect_after_login', pathname)
      }
      
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, pathname, redirectTo])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return fallback || <LoadingSpinner />
  }

  // Don't render protected content if not authenticated
  // The redirect will handle navigation
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

/**
 * Higher-order component version of ProtectedRoute
 */
export function withAuth<P extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<P>,
  options: { redirectTo?: string; fallback?: React.ReactNode } = {}
) {
  const AuthenticatedComponent = (props: P) => {
    return (
      <ProtectedRoute 
        redirectTo={options.redirectTo}
        fallback={options.fallback}
      >
        <WrappedComponent {...props} />
      </ProtectedRoute>
    )
  }

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return AuthenticatedComponent
}

/**
 * Component to redirect authenticated users away from auth pages
 */
export function RedirectIfAuthenticated({ 
  children, 
  redirectTo = '/dashboard' 
}: { 
  children: React.ReactNode
  redirectTo?: string 
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  // Show loading while checking
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Don't render auth forms if already authenticated
  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute