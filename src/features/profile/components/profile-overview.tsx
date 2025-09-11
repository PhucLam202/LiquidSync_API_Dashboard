"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Mail, Shield, Wallet, Edit3 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function ProfileOverview() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Loading profile information...</p>
        </CardContent>
      </Card>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }

  const getAuthTypeBadge = (authType: string) => {
    switch (authType) {
      case 'WEB3':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Web3</Badge>
      case 'EMAIL':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Email</Badge>
      case 'HYBRID':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">Hybrid</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      case 'EMAIL_VERIFIED':
        return <Badge variant="secondary">Email Verified</Badge>
      case 'PENDING_VERIFICATION':
        return <Badge variant="destructive">Pending Verification</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" alt={user.fullName || user.email || ""} />
              <AvatarFallback className="text-lg">
                {getInitials(user.fullName || user.email || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">
                {user.fullName || "No name set"}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email || "No email"}</span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  {getStatusBadge(user.status || 'ACTIVE')}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Auth Type</label>
                <div className="mt-1">
                  {getAuthTypeBadge(user.authType)}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <div className="mt-1">
                <Badge variant="outline">{user.role}</Badge>
              </div>
            </div>

            {user.createdAt && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Member since {formatDate(user.createdAt)}</span>
              </div>
            )}
          </div>

          <Button className="w-full">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Account Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Summary
          </CardTitle>
          <CardDescription>
            Overview of your account status and connected services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email Verification */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">
                  {user.isEmailVerified ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>
            <Badge variant={user.isEmailVerified ? "default" : "destructive"}>
              {user.isEmailVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">Wallet Connection</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {user.walletAddress 
                    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
                    : "No wallet connected"
                  }
                </p>
              </div>
            </div>
            <Badge variant={user.walletAddress ? "default" : "outline"}>
              {user.walletAddress ? "Connected" : "Not Connected"}
            </Badge>
          </div>

          {/* Subscription Info */}
          {user.subscription && (
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                  <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium">Subscription Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {user.subscription.requestsUsed} / {user.subscription.requestsLimit} requests used
                  </p>
                </div>
              </div>
              <Badge variant="secondary">{user.subscription.plan}</Badge>
            </div>
          )}

          {user.lastLoginAt && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Last login: {formatDate(user.lastLoginAt)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}