'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<Record<string, unknown>>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<Record<string, unknown>>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Filter out indexedDB and WalletConnect initialization errors during development
    if (
      error.message.includes('indexedDB is not defined') ||
      error.message.includes('WalletConnect Core is already initialized')
    ) {
      // These are expected during SSR/development, don't show error UI
      this.setState({ hasError: false })
      return
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground">
              An error occurred while loading the application.
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Global error handler for unhandled promises
export const setupGlobalErrorHandling = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      // Filter out known indexedDB and WalletConnect errors
      if (
        event.reason?.message?.includes('indexedDB is not defined') ||
        event.reason?.message?.includes('WalletConnect Core is already initialized')
      ) {
        console.warn('Suppressed known SSR error:', event.reason)
        event.preventDefault()
        return
      }
      
      console.error('Unhandled promise rejection:', event.reason)
    })

    window.addEventListener('error', (event) => {
      // Filter out known errors
      if (
        event.error?.message?.includes('indexedDB is not defined') ||
        event.error?.message?.includes('WalletConnect Core is already initialized')
      ) {
        console.warn('Suppressed known SSR error:', event.error)
        return
      }
      
      console.error('Global error:', event.error)
    })
  }
}