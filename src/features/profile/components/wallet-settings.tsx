"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Wallet, 
  ExternalLink, 
  Copy, 
  Check, 
  Link as LinkIcon,
  Unlink,
  AlertCircle,
  Shield,
  TrendingUp,
  Clock
} from "lucide-react"
import { toast } from "sonner"

// Safe wagmi hooks
function useSafeAccount() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAccount } = require('wagmi')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAccount()
  } catch {
    return { address: null, isConnected: false, chain: null }
  }
}

function useSafeBalance() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useBalance } = require('wagmi')
    return useBalance
  } catch {
    return () => ({ data: null })
  }
}

export function WalletSettings() {
  const { user } = useAuth()
  const { address, chain } = useSafeAccount()
  const useBalance = useSafeBalance()
  const { data: balance } = useBalance({ address: address as `0x${string}` })
  const [copiedAddress, setCopiedAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const getChainInfo = (currentChain: { id: number; name: string } | null) => {
    if (!currentChain) return { name: 'Unknown', symbol: 'ETH', explorer: 'https://etherscan.io' }
    
    const chainMaps: Record<number, { name: string; symbol: string; explorer: string; color: string }> = {
      1: { name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io', color: 'blue' },
      137: { name: 'Polygon', symbol: 'MATIC', explorer: 'https://polygonscan.com', color: 'purple' },
      10: { name: 'Optimism', symbol: 'ETH', explorer: 'https://optimistic.etherscan.io', color: 'red' },
      42161: { name: 'Arbitrum', symbol: 'ETH', explorer: 'https://arbiscan.io', color: 'blue' },
      8453: { name: 'Base', symbol: 'ETH', explorer: 'https://basescan.org', color: 'blue' },
      11155111: { name: 'Sepolia', symbol: 'ETH', explorer: 'https://sepolia.etherscan.io', color: 'gray' }
    }
    
    return chainMaps[currentChain.id] || { name: currentChain.name, symbol: 'ETH', explorer: 'https://etherscan.io', color: 'gray' }
  }

  const formatBalance = (balanceData: { formatted: string } | null | undefined) => {
    if (!balanceData) return '0'
    
    const value = parseFloat(balanceData.formatted)
    if (value === 0) return '0'
    if (value < 0.0001) return '< 0.0001'
    return value.toFixed(4)
  }

  const handleCopyAddress = async (address: string, label: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(address)
      toast.success(`${label} copied to clipboard`)
      setTimeout(() => setCopiedAddress(""), 2000)
    } catch {
      toast.error('Failed to copy address')
    }
  }

  const handleLinkWallet = async () => {
    setIsLoading(true)
    try {
      // Simulate wallet linking
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success("Wallet linked successfully!")
    } catch {
      toast.error("Failed to link wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnlinkWallet = async () => {
    if (window.confirm("Are you sure you want to unlink this wallet? You may lose access to your account.")) {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast.success("Wallet unlinked successfully!")
      } catch {
        toast.error("Failed to unlink wallet")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const connectedWalletAddress = user?.walletAddress || address
  const chainInfo = getChainInfo(chain)

  // Mock transaction history
  const recentTransactions = [
    {
      hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      type: "send",
      amount: "0.5 ETH",
      to: "0x742d35Cc6569C8532EF9a7b7E7e4B6a5C6dF8A2a",
      timestamp: "2 hours ago",
      status: "completed"
    },
    {
      hash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
      type: "receive",
      amount: "1.2 ETH",
      from: "0x8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b",
      timestamp: "5 hours ago",
      status: "completed"
    },
    {
      hash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      type: "contract",
      amount: "0.02 ETH",
      contract: "Uniswap V3",
      timestamp: "1 day ago",
      status: "completed"
    }
  ]

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Loading wallet settings...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connected Wallet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connected Wallet
          </CardTitle>
          <CardDescription>
            Your primary wallet for DeFi operations and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectedWalletAddress ? (
            <div className="space-y-4">
              {/* Wallet Info */}
              <div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-blue-500/10 border border-blue-200/20">
                    <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">Primary Wallet</p>
                      <Badge className="bg-green-500 hover:bg-green-600 text-xs">Connected</Badge>
                    </div>
                    <p className="text-sm font-mono text-muted-foreground">
                      {connectedWalletAddress.slice(0, 6)}...{connectedWalletAddress.slice(-4)}
                    </p>
                    {chain && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {chainInfo.name}
                        </Badge>
                        {balance && (
                          <span className="text-xs text-muted-foreground">
                            {formatBalance(balance)} {chainInfo.symbol}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyAddress(connectedWalletAddress, "Wallet address")}
                  >
                    {copiedAddress === connectedWalletAddress ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={`${chainInfo.explorer}/address/${connectedWalletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Portfolio
                </Button>
                <Button variant="outline" onClick={handleUnlinkWallet} disabled={isLoading}>
                  <Unlink className="h-4 w-4 mr-2" />
                  {isLoading ? "Unlinking..." : "Unlink Wallet"}
                </Button>
              </div>

              {/* Security Notice */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Security Notice</AlertTitle>
                <AlertDescription>
                  Your wallet is secured by your private key. Never share your private key or seed phrase with anyone.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Wallet className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Wallet Connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your Web3 wallet to access DeFi features and secure authentication.
              </p>
              <Button onClick={handleLinkWallet} disabled={isLoading}>
                <LinkIcon className="h-4 w-4 mr-2" />
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {connectedWalletAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Your latest blockchain transactions and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx, index) => (
                <div key={tx.hash}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        tx.type === 'send' ? 'bg-red-100 dark:bg-red-900/20' :
                        tx.type === 'receive' ? 'bg-green-100 dark:bg-green-900/20' :
                        'bg-blue-100 dark:bg-blue-900/20'
                      }`}>
                        {tx.type === 'send' ? (
                          <TrendingUp className={`h-4 w-4 rotate-45 text-red-600 dark:text-red-400`} />
                        ) : tx.type === 'receive' ? (
                          <TrendingUp className={`h-4 w-4 -rotate-45 text-green-600 dark:text-green-400`} />
                        ) : (
                          <AlertCircle className={`h-4 w-4 text-blue-600 dark:text-blue-400`} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium capitalize">{tx.type}</p>
                          <Badge variant="outline" className="text-xs">
                            {tx.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tx.amount} • {tx.timestamp}
                        </p>
                        {tx.type !== 'contract' && (
                          <p className="text-xs font-mono text-muted-foreground">
                            {tx.type === 'send' ? `To: ${tx.to?.slice(0, 6)}...${tx.to?.slice(-4)}` : 
                             `From: ${tx.from?.slice(0, 6)}...${tx.from?.slice(-4)}`}
                          </p>
                        )}
                        {tx.type === 'contract' && (
                          <p className="text-xs text-muted-foreground">
                            Contract: {tx.contract}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyAddress(tx.hash, "Transaction hash")}
                      >
                        {copiedAddress === tx.hash ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={`${chainInfo.explorer}/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                  {index < recentTransactions.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" className="w-full">
                View All Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supported Networks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Supported Networks
          </CardTitle>
          <CardDescription>
            Blockchain networks supported by LiquidSync
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Ethereum', symbol: 'ETH', color: 'blue', active: chain?.id === 1 },
              { name: 'Polygon', symbol: 'MATIC', color: 'purple', active: chain?.id === 137 },
              { name: 'Optimism', symbol: 'ETH', color: 'red', active: chain?.id === 10 },
              { name: 'Arbitrum', symbol: 'ETH', color: 'blue', active: chain?.id === 42161 },
              { name: 'Base', symbol: 'ETH', color: 'blue', active: chain?.id === 8453 },
              { name: 'Sepolia', symbol: 'ETH', color: 'gray', active: chain?.id === 11155111 }
            ].map((network) => (
              <div
                key={network.name}
                className={`p-3 rounded-lg border ${
                  network.active ? 'bg-primary/5 border-primary/20' : 'bg-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{network.name}</p>
                    <p className="text-sm text-muted-foreground">{network.symbol}</p>
                  </div>
                  {network.active && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-xs">Active</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}