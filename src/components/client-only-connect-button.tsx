"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function ClientOnlyConnectButton() {
  const [mounted, setMounted] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state during SSR
  if (!mounted) {
    return (
      <Button disabled>
        Connect Wallet
      </Button>
    )
  }

  // Error boundary for RainbowKit
  if (hasError) {
    return (
      <Button 
        variant="outline" 
        onClick={() => {
          setHasError(false)
          window.location.reload()
        }}
      >
        Retry Connection
      </Button>
    )
  }

  try {
    return <ConnectButton />
  } catch (error) {
    console.error('ConnectButton error:', error)
    setHasError(true)
    return (
      <Button variant="outline" onClick={() => setHasError(false)}>
        Connection Error - Retry
      </Button>
    )
  }
}
