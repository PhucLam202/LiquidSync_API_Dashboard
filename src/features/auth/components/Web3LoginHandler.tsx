"use client"

import { useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

// Safe wagmi hooks that handle provider not being available
function useSafeAccount() {
  try {
    // Dynamic import to avoid SSR issues and handle provider not available
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAccount } = require('wagmi')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAccount()
  } catch {
    // WagmiProvider not available - return safe defaults
    return { address: null, isConnected: false, isConnecting: false }
  }
}

function useSafeSignMessage() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useSignMessage } = require('wagmi')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSignMessage()
  } catch {
    // WagmiProvider not available - return safe defaults
    return { signMessageAsync: null }
  }
}

export function Web3LoginHandler() {
  const { loginWithWallet, isAuthenticated } = useAuth()
  const { address, isConnected, isConnecting } = useSafeAccount()
  const { signMessageAsync } = useSafeSignMessage()

  /**
   * Generate authentication message for wallet signing
   */
  const generateAuthMessage = useCallback((walletAddress: string): string => {
    const timestamp = new Date().toISOString()
    const nonce = Math.random().toString(36).substring(2, 15)
    
    return `Welcome to LiquidSync DeFi!

Click to sign in and accept the Terms of Service.

This request will not trigger a blockchain transaction or cost any gas fees.

Wallet address: ${walletAddress}
Timestamp: ${timestamp}
Nonce: ${nonce}`
  }, [])

  /**
   * Handle wallet connection and automatic login
   */
  const handleWalletLogin = useCallback(async (walletAddress: string) => {
    if (!signMessageAsync) {
      console.warn('signMessageAsync not available')
      return
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Authenticating with wallet...', {
        description: 'Please sign the message to continue',
        duration: Infinity
      })

      // Generate message to sign
      const message = generateAuthMessage(walletAddress)
      
      // Request signature from user
      const signature = await signMessageAsync({ message })
      
      // Dismiss loading toast
      toast.dismiss(loadingToast)
      
      // Call authentication API
      await loginWithWallet(walletAddress, signature, message)
      
      // Show success message
      toast.success('Welcome to LiquidSync!', {
        description: `Connected with ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        duration: 4000,
      })
      
    } catch (error: unknown) {
      console.error('Web3 login error:', error)
      
      // Dismiss loading toast if still showing
      toast.dismiss()
      
      // Show error message
      if (error && typeof error === 'object' && 'name' in error && error.name === 'UserRejectedRequestError') {
        toast.error('Authentication cancelled', {
          description: 'You need to sign the message to log in with your wallet.',
          duration: 5000,
        })
      } else {
        toast.error('Authentication failed', {
          description: 'There was an error logging in with your wallet. Please try again.',
          duration: 5000,
        })
      }
    }
  }, [generateAuthMessage, signMessageAsync, loginWithWallet])

  /**
   * Monitor wallet connection changes
   */
  useEffect(() => {
    // Only proceed if wallet is connected, has address, and user is not already authenticated
    if (isConnected && address && !isAuthenticated && !isConnecting && signMessageAsync) {
      // Add small delay to ensure connection is stable
      const timer = setTimeout(() => {
        handleWalletLogin(address)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [isConnected, address, isAuthenticated, isConnecting, signMessageAsync, handleWalletLogin])

  // This component doesn't render anything visible
  return null
}