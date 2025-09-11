"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link, Mail, Wallet, CheckCircle, AlertCircle, Edit, Lock } from "lucide-react"
import { toast } from "sonner"

export function AccountLinking() {
  const { user, linkEmailToWeb3 } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [linkingData, setLinkingData] = useState({
    email: user?.email || "",
    walletAddress: user?.walletAddress || ""
  })
  const [editingFields, setEditingFields] = useState({
    email: false,
    walletAddress: false
  })

  const toggleEditing = (field: 'email' | 'walletAddress') => {
    setEditingFields(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleInputChange = (field: string, value: string) => {
    setLinkingData(prev => ({ ...prev, [field]: value }))
  }

  const handleLinkAccounts = async () => {
    if (!linkingData.email || !linkingData.walletAddress) {
      toast.error("Both email and wallet address are required")
      return
    }

    // Basic wallet address validation
    if (!linkingData.walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error("Invalid wallet address format")
      return
    }

    // Basic email validation
    if (!linkingData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Invalid email format")
      return
    }

    setIsLoading(true)
    try {
      const response = await linkEmailToWeb3(linkingData.email, linkingData.walletAddress)
      
      if (response.success) {
        toast.success(`Account information updated successfully! ${response.message}`)
        
        // Show different messages based on linking type
        switch (response.type) {
          case 'ALREADY_LINKED':
            toast.info("Account information confirmed - no changes needed")
            break
          case 'EMAIL_TO_WEB3':
            toast.success("Email address updated and linked to Web3 wallet")
            break
          case 'WEB3_TO_EMAIL':
            toast.success("Wallet address updated and linked to email")
            break
        }
      } else {
        toast.error("Failed to update account information. Please try again.")
      }
    } catch (error) {
      console.error('Account linking error:', error)
      toast.error("An error occurred while linking accounts")
    } finally {
      setIsLoading(false)
    }
  }

  const getAuthTypeInfo = () => {
    switch (user?.authType) {
      case 'EMAIL':
        return {
          icon: <Mail className="h-4 w-4" />,
          label: "Email Account",
          description: "You signed in with email and password",
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        }
      case 'WEB3':
        return {
          icon: <Wallet className="h-4 w-4" />,
          label: "Web3 Account",
          description: "You signed in with your crypto wallet",
          color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
        }
      case 'HYBRID':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Hybrid Account",
          description: "Your email and wallet are already linked",
          color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        }
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          label: "Unknown",
          description: "Unable to determine account type",
          color: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
        }
    }
  }

  const authInfo = getAuthTypeInfo()
  
  // Check if user has existing email and wallet for display purposes
  const hasEmail = !!(user?.email)
  const hasWallet = !!(user?.walletAddress)

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Loading account information...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Account Information
        </CardTitle>
        <CardDescription>
          Manage your email and Web3 wallet address for enhanced security and flexibility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Account Status */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-peach-soft border border-peach-fuzz/20">
              {authInfo.icon}
            </div>
            <div>
              <p className="font-medium">{authInfo.label}</p>
              <p className="text-sm text-muted-foreground">{authInfo.description}</p>
            </div>
          </div>
          <Badge className={authInfo.color}>
            {user.authType}
          </Badge>
        </div>

        {/* Account Information Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={linkingData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isLoading || !editingFields.email}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleEditing('email')}
                className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-peach-fuzz/20 hover:text-peach-fuzz border-0"
                disabled={isLoading}
              >
                {editingFields.email ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
              </Button>
            </div>
            {hasEmail && (
              <p className="text-xs text-muted-foreground">
                Current email address: {user.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="walletAddress">Wallet Address</Label>
            <div className="relative">
              <Input
                id="walletAddress"
                type="text"
                placeholder="0x742d35Cc6569C8532EF9a7b7E7e4B6a5C6dF8A2a"
                value={linkingData.walletAddress}
                onChange={(e) => handleInputChange("walletAddress", e.target.value)}
                disabled={isLoading || !editingFields.walletAddress}
                className="font-mono pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleEditing('walletAddress')}
                className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-peach-fuzz/20 hover:text-peach-fuzz border-0"
                disabled={isLoading}
              >
                {editingFields.walletAddress ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
              </Button>
            </div>
            {hasWallet && (
              <p className="text-xs text-muted-foreground">
                Current wallet: {user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}
              </p>
            )}
          </div>
        </div>

        <Alert>
          <Link className="h-4 w-4" />
          <AlertDescription>
            Click the edit button next to each field to enable editing. Update your email and wallet address to link or change your account information. Both fields are required.
          </AlertDescription>
        </Alert>

        <Button 
          onClick={handleLinkAccounts}
          disabled={isLoading || !linkingData.email || !linkingData.walletAddress}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Updating Account...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Update Account Information
            </div>
          )}
        </Button>


        {/* Benefits Section */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Benefits of Account Linking</h4>
          <div className="grid gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Sign in with either email or wallet</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Enhanced account security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Access to all DeFi features</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Password recovery options</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}