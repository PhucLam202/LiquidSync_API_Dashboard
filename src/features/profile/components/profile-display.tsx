"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, User, Mail, Shield, Calendar, CheckCircle, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ProfileFieldProps {
  label: string
  value: string | React.ReactNode
  icon?: React.ReactNode
}

function ProfileField({ label, value, icon }: ProfileFieldProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center space-x-3">
        {icon && (
          <div className="flex-shrink-0 p-2 rounded-full bg-muted">
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
        </div>
      </div>
      <div className="text-right">
        {typeof value === 'string' ? (
          <p className="font-medium">{value}</p>
        ) : (
          value
        )}
      </div>
    </div>
  )
}

export function ProfileDisplay() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
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

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'FREE':
        return <Badge variant="secondary">Free</Badge>
      case 'PREMIUM':
        return <Badge variant="default">Premium</Badge>
      case 'ENTERPRISE':
        return <Badge className="bg-purple-600 hover:bg-purple-700">Enterprise</Badge>
      default:
        return <Badge variant="outline">{subscription}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-red-600 hover:bg-red-700">Admin</Badge>
      case 'USER':
        return <Badge variant="outline">User</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your account details and settings
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4 pb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" alt={user.fullName || user.email || ""} />
            <AvatarFallback className="text-lg font-semibold">
              {getInitials(user.fullName || user.email || "U")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">
              {user.fullName || "No name set"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <Separator />

        {/* Profile Fields */}
        <div className="space-y-1">
          <ProfileField
            label="Full Name"
            value={user.fullName || "Not set"}
            icon={<User className="h-4 w-4" />}
          />

          <Separator className="my-2" />

          <ProfileField
            label="Email Address"
            value={user.email || "Not set"}
            icon={<Mail className="h-4 w-4" />}
          />

          <Separator className="my-2" />

          <ProfileField
            label="Email Verified"
            value={
              user.isEmailVerified ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Verified</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span className="font-medium">Not Verified</span>
                </div>
              )
            }
            icon={<Mail className="h-4 w-4" />}
          />

          <Separator className="my-2" />

          <ProfileField
            label="Role"
            value={getRoleBadge(user.role)}
            icon={<Shield className="h-4 w-4" />}
          />

          <Separator className="my-2" />

          <ProfileField
            label="Subscription"
            value={getSubscriptionBadge(user.subscription?.plan || 'FREE')}
            icon={<Shield className="h-4 w-4" />}
          />

          <Separator className="my-2" />

          <ProfileField
            label="Member Since"
            value={formatDate(user.createdAt)}
            icon={<Calendar className="h-4 w-4" />}
          />

          {user.walletAddress && (
            <>
              <Separator className="my-2" />
              <ProfileField
                label="Wallet Address"
                value={
                  <span className="font-mono text-sm">
                    {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                  </span>
                }
                icon={<Shield className="h-4 w-4" />}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}