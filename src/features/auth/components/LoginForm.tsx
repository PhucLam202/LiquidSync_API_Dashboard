"use client"

import { useState } from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { toast } from "sonner"
import { AuthenticatedConnectButton } from "@/features/auth/components/AuthenticatedConnectButton"
import { Web3LoginHandler } from "@/features/auth/components/Web3LoginHandler"
import { useAuth } from "@/contexts/auth-context"
import { AuthAPIError } from "@/services/api/auth.service"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loginMode, setLoginMode] = useState<'email' | 'password'>('email')
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showWeb3Option, setShowWeb3Option] = useState(false)
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (loginMode === 'email') {
        // Step 1: Move to password step
        setLoginMode('password')
      } else {
        // Step 2: Attempt login
        await login(formData.email, formData.password)
        // Show success toast
        toast.success("Welcome back! Login successful", {
          description: "You have been successfully logged in to your account."
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      
      if (error instanceof AuthAPIError) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
      
      // If login fails, go back to email step
      if (loginMode === 'password') {
        setLoginMode('email')
        setFormData(prev => ({ ...prev, password: '' }))
      }
    }
  }
  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-lg mx-auto", className)} {...props}>
      {/* Web3 Login Handler - invisible component that handles wallet connection events */}
      <Web3LoginHandler />
      
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <GalleryVerticalEnd className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome to LiquidSync</h1>
              <p className="text-sm text-muted-foreground mt-1">Sign in to continue to your dashboard</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Google Auth Section - Always visible */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground mb-3">Continue with Google</p>
              <Button 
                variant="outline" 
                type="button" 
                className="w-full h-11 border-border bg-card text-card-foreground hover:bg-muted hover:text-foreground hover:border-primary/30 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Google
              </Button>
            </div>

            {/* Web3 Connection Section - Conditionally visible */}
            {showWeb3Option && (
              <div className="text-center pt-4 border-t animate-in slide-in-from-top-2 duration-300">
                <div className="flex justify-center">
                  <AuthenticatedConnectButton />
                </div>
              </div>
            )}
            
            {/* Show Web3 Option Button - Hidden when Web3 option is visible */}
            {!showWeb3Option && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowWeb3Option(true)}
                  className="text-md text-primary hover:text-primary hover:underline underline-offset-4"
                >
                  Connect with Web3 Wallet
                </button>
              </div>
            )}
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>
          
          {/* Traditional Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="h-11"
                disabled={loginMode === 'password'}
              />
              {loginMode === 'password' && (
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('email')
                    setFormData(prev => ({ ...prev, password: '' }))
                    setError('')
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Change email
                </button>
              )}
            </div>

            {loginMode === 'password' && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="h-11"
                  autoFocus
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isLoading || !formData.email || (loginMode === 'password' && !formData.password)}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-black"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {loginMode === 'password' ? 'Signing In...' : 'Continuing...'}
                </div>
              ) : (
                loginMode === 'email' ? 'Continue' : 'Sign In'
              )}
            </Button>
          </form>
          
          
          <div className="text-center text-xs text-muted-foreground">
            <p>
              By continuing, you agree to our{" "}
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </a>
              .
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-primary underline underline-offset-4 hover:text-primary/80 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
