"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useRegistrationFlow } from "@/contexts/auth-context"
import { AuthAPIError } from "@/services/api/auth.service"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "sonner"

export function OtpVerificationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const router = useRouter()
  const { verifyOTP, sendOTP, isLoading } = useRegistrationFlow()

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('signup_email')
    if (!storedEmail) {
      router.push('/signup/email')
      return
    }
    setEmail(storedEmail)

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      // Call real API to verify OTP
      await verifyOTP(email, otp)
      
      // Show success toast notification
      toast.success("Email verified successfully!", {
        description: "You can now complete your profile.",
        duration: 3000,
      })
      
      // Navigate to complete profile step
      router.push('/signup/complete')
    } catch (error) {
      console.error('Verify OTP error:', error)
      
      if (error instanceof AuthAPIError) {
        // Use enhanced error message with user-friendly text
        const friendlyMessage = error.getUserFriendlyMessage()
        setError(friendlyMessage)
        
        // If account status issue, suggest alternative action
        if (error.isAccountStatusIssue()) {
          // Maybe redirect to login or show different options
          // Account already verified - could redirect to login
        }
      } else {
        setError('Invalid verification code. Please try again.')
      }
    }
  }

  const handleResendOtp = async () => {
    if (!canResend) return
    
    setError('')
    try {
      // Call real API to resend OTP
      await sendOTP(email)
      
      // Show success toast notification
      toast.success("New verification code sent!", {
        description: "Please check your email for the new code.",
        duration: 4000,
      })
      
      // Reset countdown
      setCountdown(60)
      setCanResend(false)
      
      // Start countdown again
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      // Clear previous timer
      return () => clearInterval(timer)
    } catch (error) {
      console.error('Resend OTP error:', error)
      
      if (error instanceof AuthAPIError) {
        setError(error.message)
      } else {
        setError('Failed to resend verification code. Please try again.')
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
              <h1 className="text-2xl font-bold text-foreground">Verify Your Email</h1>
              <p className="text-sm text-muted-foreground mt-1">
                We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-semibold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Email</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">2</div>
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
          
          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                className="h-11 text-center text-lg font-mono tracking-wider"
                maxLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || otp.length !== 6}
              className="w-full h-11 bg-primary hover:bg-primary/80 active:bg-primary/70 text-primary-foreground transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Verify Code'
              )}
            </Button>
          </form>
          
          {/* Resend OTP */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn&apos;t receive the code?
            </p>
            {canResend ? (
              <Button 
                variant="link" 
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-primary hover:text-primary/80 p-0 h-auto"
              >
                Resend Code
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Resend code in {countdown}s
              </p>
            )}
          </div>
          
          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => router.push('/signup/email')}
              className="text-muted-foreground hover:text-foreground p-0 h-auto"
            >
              ← Change Email Address
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}