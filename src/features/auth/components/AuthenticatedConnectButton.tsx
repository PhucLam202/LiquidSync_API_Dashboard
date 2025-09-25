"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

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

export function AuthenticatedConnectButton() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { address, isConnected, isConnecting } = useSafeAccount()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle mounting for SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  // Monitor authentication flow state
  useEffect(() => {
    if (isConnected && address && !isAuthenticated && !authLoading) {
      // Wallet is connected but not authenticated yet
      setIsAuthenticating(true)
    } else if (isAuthenticated || !isConnected) {
      // Either authenticated or disconnected
      setIsAuthenticating(false)
    }
  }, [isConnected, address, isAuthenticated, authLoading])

  // Show loading state during SSR
  if (!mounted) {
    return (
      <Button disabled className="h-11 min-w-[140px]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </Button>
    )
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted: rainbowMounted,
      }) => {
        const ready = rainbowMounted
        const connected = ready && account && chain && isConnected

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              // Not connected to wallet
              if (!connected) {
                return (
                  <Button 
                    onClick={openConnectModal}
                    className="h-11 min-w-[140px] bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF5252] hover:to-[#FF7575] text-white"
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Connecting...
                      </div>
                    ) : (
                      'Connect Wallet'
                    )}
                  </Button>
                )
              }

              // Connected to wallet but not authenticated yet
              if (connected && !isAuthenticated) {
                return (
                  <Button 
                    disabled 
                    className="h-11 min-w-[140px] bg-amber-500 hover:bg-amber-500 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {isAuthenticating ? 'Please sign to login...' : 'Authenticating...'}
                    </div>
                  </Button>
                )
              }

              // Wrong network
              if (chain.unsupported) {
                return (
                  <Button 
                    onClick={openChainModal} 
                    variant="destructive"
                    className="h-11 min-w-[140px]"
                  >
                    Wrong network
                  </Button>
                )
              }

              // Fully authenticated - show wallet info
              return (
                <div className="flex gap-2">
                  {chain.hasIcon && (
                    <Button
                      onClick={openChainModal}
                      variant="outline"
                      size="sm"
                      className="h-11 px-3 border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white"
                    >
                      {chain.iconUrl && (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-4 h-4 mr-2"
                          />
                        </>
                      )}
                      {chain.name}
                    </Button>
                  )}

                  <Button 
                    onClick={openAccountModal}
                    className="h-11 min-w-[120px] bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF5252] hover:to-[#FF7575] text-white"
                  >
                    <div className="flex items-center gap-2">
                      {account.ensAvatar && (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt={account.ensName ?? account.displayName}
                            src={account.ensAvatar}
                            className="w-4 h-4 rounded-full"
                          />
                        </>
                      )}
                      <span className="truncate">
                        {account.displayName}
                      </span>
                      {account.displayBalance && (
                        <span className="text-xs opacity-75">
                          ({account.displayBalance})
                        </span>
                      )}
                    </div>
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}