"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useRegistrationFlow } from "@/contexts/auth-context"
import { AuthAPIError } from "@/services/api/auth.service"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "sonner"

export function EmailSignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { sendOTP, isLoading } = useRegistrationFlow()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      // Call real API to send OTP
      await sendOTP(email)
      
      // Show success toast notification
      toast.success("Verification code sent!", {
        description: "Please check your email for the verification code.",
        duration: 4000,
      })
      
      // Navigate to OTP verification step
      router.push('/signup/otp')
    } catch (error) {
      console.error('Send OTP error:', error)
      
      if (error instanceof AuthAPIError) {
        setError(error.message)
      } else {
        setError('Failed to send verification code. Please try again.')
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-lg mx-auto", className)} {...props}>
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <GalleryVerticalEnd className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Get Started with LiquidSync</h1>
              <p className="text-sm text-muted-foreground mt-1">Quick signup in 3 simple steps</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">1</div>
              <span>Email</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full border border-muted-foreground/30 flex items-center justify-center text-xs">2</div>
              <span>OTP</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full border border-muted-foreground/30 flex items-center justify-center text-xs">3</div>
              <span>Details</span>
            </div>
          </div>
          
          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">We&apos;ll send you a verification code</p>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full h-11 bg-primary hover:bg-primary/80 active:bg-primary/70 text-primary-foreground transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Sending Code...
                </div>
              ) : (
                'Send Verification Code'
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
              Already have an account?{" "}
              <a href="/login" className="text-primary underline underline-offset-4 hover:text-primary/80 font-medium">
                Sign in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}