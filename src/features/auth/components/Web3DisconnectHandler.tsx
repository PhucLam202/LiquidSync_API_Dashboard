"use client"

import { useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

// Safe wagmi hook that handles provider not being available
function useSafeAccount() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAccount } = require('wagmi')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAccount()
  } catch {
    return { address: null, isConnected: false }
  }
}

export function Web3DisconnectHandler() {
  const { address, isConnected } = useSafeAccount()
  // const { disconnect } = useDisconnect() // TODO: Use for manual disconnect functionality
  const { user, logout, isAuthenticated } = useAuth()

  /**
   * Handle wallet disconnection and logout
   */
  const handleWalletDisconnect = useCallback(async () => {
    try {
      // Only logout if user was authenticated with Web3
      if (user?.authType === 'WEB3' && isAuthenticated) {
        // Show disconnect message
        toast.info('Wallet disconnected', {
          description: 'You have been logged out due to wallet disconnection.',
          duration: 4000,
        })
        
        // Perform logout
        await logout()
      }
    } catch (error) {
      console.error('Error during wallet disconnect logout:', error)
      // Force logout anyway
      await logout()
    }
  }, [user, isAuthenticated, logout])

  /**
   * Monitor wallet connection changes for Web3 users
   */
  useEffect(() => {
    // If user is authenticated with Web3 but wallet is disconnected
    if (user?.authType === 'WEB3' && isAuthenticated && !isConnected) {
      // Add small delay to avoid race conditions
      const timer = setTimeout(() => {
        handleWalletDisconnect()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isConnected, user, isAuthenticated, handleWalletDisconnect])

  /**
   * Monitor address changes for Web3 users
   */
  useEffect(() => {
    // If user is authenticated with Web3 and address changed to a different one
    if (user?.authType === 'WEB3' && 
        isAuthenticated && 
        isConnected && 
        address && 
        user.walletAddress &&
        address.toLowerCase() !== user.walletAddress.toLowerCase()) {
      
      // Wallet address changed - logout and show message
      toast.warning('Wallet address changed', {
        description: 'You have been logged out due to wallet address change. Please reconnect to continue.',
        duration: 5000,
      })
      
      handleWalletDisconnect()
    }
  }, [address, user, isAuthenticated, isConnected, handleWalletDisconnect])

  // This component doesn't render anything visible
  return null
}