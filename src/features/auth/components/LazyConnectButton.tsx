"use client"

import { Suspense, lazy } from 'react'
import { Button } from '@/components/ui/button'

// Lazy load the RainbowKit ConnectButton to improve initial page load
const ClientOnlyConnectButton = lazy(() => 
  import('./ClientOnlyConnectButton').then(module => ({
    default: module.ClientOnlyConnectButton
  }))
)

export function LazyConnectButton() {
  return (
    <Suspense 
      fallback={
        <Button disabled className="h-11 min-w-[140px]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        </Button>
      }
    >
      <ClientOnlyConnectButton />
    </Suspense>
  )
}