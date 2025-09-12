"use client"

import React from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Wallet, ExternalLink, LogOut, Network, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

// Safe wagmi hooks that handle provider not being available
let useAccount: () => { address: string | null; isConnected: boolean; chain: { id: number; name: string } | null } = () => ({ 
  address: null, 
  isConnected: false, 
  chain: null 
})
let useBalance: (config: { address: string | null }) => { data: { formatted: string } | null } = () => ({ data: null })
let useDisconnect: () => { disconnect: () => void } = () => ({ disconnect: () => {} })
let useSwitchChain: () => { switchChain: (config: { chainId: number }) => Promise<void>; chains: { id: number; name: string }[] } = () => ({ 
  switchChain: () => Promise.resolve(), 
  chains: [] 
})

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const wagmi = require('wagmi')
  useAccount = wagmi.useAccount
  useBalance = wagmi.useBalance
  useDisconnect = wagmi.useDisconnect
  useSwitchChain = wagmi.useSwitchChain
} catch {
  // Fallbacks already set above
}

export function WalletInfo() {
  const { address, chain } = useAccount()
  const { user, isAuthenticated, logout } = useAuth()
  const { disconnect } = useDisconnect()
  const { switchChain, chains } = useSwitchChain()
  const [copiedAddress, setCopiedAddress] = React.useState(false)
  
  // Determine display address before using in hooks
  const activeAddress = user?.walletAddress || address
  const { data: balance } = useBalance({ address: activeAddress as `0x${string}` | null })
  
  // Check if user is authenticated and has wallet address
  const hasWalletAuth = isAuthenticated && (user?.walletAddress || address)
  
  // Show connection status even if not connected
  if (!hasWalletAuth || !activeAddress) {
    return (
      <Button variant="outline" className="flex items-center gap-3 h-10 px-4 py-2" disabled>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
          <Wallet className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium text-muted-foreground">No Wallet</span>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/40"></div>
          <span className="text-muted-foreground">Not Connected</span>
        </div>
      </Button>
    )
  }
  
  // Use the address from user profile if available, otherwise use wagmi address
  const displayAddress = activeAddress

  const formatAddress = (addr: string | null) => {
    if (!addr) return 'No address'
    return `${addr.slice(0, 4)}…${addr.slice(-4)}`
  }
  

  const formatBalance = (balanceData: { formatted: string } | null | undefined) => {
    if (!balanceData) return '0'
    
    const value = parseFloat(balanceData.formatted)
    if (value === 0) return '0'
    if (value < 0.0001) return '< 0.0001'
    return value.toFixed(4)
  }

  const getChainInfo = (currentChain: { id: number; name: string } | null) => {
    if (!currentChain) return { name: 'Unknown', symbol: 'ETH', explorer: 'https://etherscan.io' }
    
    const chainMaps: Record<number, { name: string; symbol: string; explorer: string }> = {
      1: { name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io' },
      137: { name: 'Polygon', symbol: 'MATIC', explorer: 'https://polygonscan.com' },
      10: { name: 'Optimism', symbol: 'ETH', explorer: 'https://optimistic.etherscan.io' },
      42161: { name: 'Arbitrum', symbol: 'ETH', explorer: 'https://arbiscan.io' },
      8453: { name: 'Base', symbol: 'ETH', explorer: 'https://basescan.org' },
      11155111: { name: 'Sepolia', symbol: 'ETH', explorer: 'https://sepolia.etherscan.io' }
    }
    
    const chainInfo = chainMaps[currentChain.id] || { name: currentChain.name, symbol: 'ETH', explorer: 'https://etherscan.io' }
    return chainInfo
  }

  const chainInfo = getChainInfo(chain)

  const handleCopyAddress = async () => {
    if (!displayAddress) return
    
    try {
      await navigator.clipboard.writeText(displayAddress)
      setCopiedAddress(true)
      toast.success('Address copied to clipboard')
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch {
      toast.error('Failed to copy address')
    }
  }

  const handleDisconnect = async () => {
    try {
      // Disconnect from wallet
      disconnect()
      // Logout from auth context (this will redirect to login page)
      await logout()
      toast.success('Wallet disconnected')
    } catch (error) {
      console.error('Disconnect error:', error)
      toast.error('Failed to disconnect')
    }
  }

  const handleSwitchNetwork = async (chainId: number) => {
    try {
      await switchChain({ chainId })
      toast.success(`Switched to ${chains.find(c => c.id === chainId)?.name}`)
    } catch (error) {
      console.error('Switch network error:', error)
      toast.error('Failed to switch network')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-3 h-10 px-4 py-2 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/20 dark:border-blue-700/20">
            <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-foreground">
              {chainInfo.name}
            </span>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/40"></div>
            <span className="font-semibold text-foreground">
              {formatBalance(balance)} {chainInfo.symbol}
            </span>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/40"></div>
            <span className="font-mono text-muted-foreground text-xs">
              {formatAddress(displayAddress)}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {/* Wallet Info Section */}
        <div className="p-3 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Connected Wallet</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Balance</span>
              <span className="text-xs font-medium">
                {formatBalance(balance)} {chainInfo.symbol}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Network</span>
              <Badge variant="secondary" className="text-xs h-4">
                {chainInfo.name}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">
                {formatAddress(displayAddress)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleCopyAddress}
              >
                {copiedAddress ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Network Switching Section */}
        {chains.length > 0 && (
          <div className="p-2">
            <div className="flex items-center gap-2 px-1 py-1 mb-1">
              <Network className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Switch Network</span>
            </div>
            {chains.map((networkChain) => (
              <DropdownMenuItem
                key={networkChain.id}
                onClick={() => handleSwitchNetwork(networkChain.id)}
                className="text-xs"
                disabled={chain?.id === networkChain.id}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{networkChain.name}</span>
                  {chain?.id === networkChain.id && (
                    <Badge variant="secondary" className="text-xs h-4">Current</Badge>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />

        {/* Actions */}
        <div className="p-2 space-y-1">
          <DropdownMenuItem asChild>
            <a
              href={`${chainInfo.explorer}/address/${displayAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs"
            >
              <ExternalLink className="w-3 h-3" />
              View on Explorer
            </a>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={handleDisconnect}
            className="flex items-center gap-2 text-xs text-destructive focus:text-destructive"
          >
            <LogOut className="w-3 h-3" />
            Disconnect Wallet
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}