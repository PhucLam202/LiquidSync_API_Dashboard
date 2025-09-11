"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Save, Bell, Globe } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AccountLinking } from "@/features/profile/components/account-linking"
import { toast } from "sonner"

export function SimpleOverview() {
  const { user, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "John Lam",
    email: user?.email || "butelaquaglia97146257@gmail.com",
    bio: "",
    language: "en",
    timezone: "UTC",
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Profile updated successfully!")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Loading profile information...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" alt={formData.fullName} />
              <AvatarFallback className="text-lg bg-peach-soft">
                {getInitials(formData.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                    />
                    {!user.isEmailVerified && (
                      <Badge variant="destructive" className="absolute right-2 top-2 h-6 text-xs">Unverified</Badge>
                    )}
                  </div>
                  {!user.isEmailVerified && (
                    <p className="text-sm text-destructive">Email not verified. Check your inbox.</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Preferences
          </CardTitle>
          <CardDescription>
            Customize your account preferences and regional settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={formData.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                  <SelectItem value="Asia/Shanghai">China Standard Time (CST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about your account activity
                </p>
              </div>
              <Switch
                checked={formData.emailNotifications}
                onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                checked={formData.pushNotifications}
                onCheckedChange={(checked) => handleInputChange("pushNotifications", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new features and updates
                </p>
              </div>
              <Switch
                checked={formData.marketingEmails}
                onCheckedChange={(checked) => handleInputChange("marketingEmails", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Linking Section */}
      <AccountLinking />

      {/* Save Changes */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}