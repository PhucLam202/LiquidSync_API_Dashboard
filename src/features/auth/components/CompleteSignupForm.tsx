"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AuthAPIError } from "@/services/api/auth.service"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export function CompleteSignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    confirmPassword: ""
  })
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [loadingStep, setLoadingStep] = useState<string>("")
  const router = useRouter()
  const { register, isLoading } = useAuth()

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('signup_email')
    if (!storedEmail) {
      router.push('/signup/email')
      return
    }
    setEmail(storedEmail)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    
    // Check terms agreement
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      return
    }
    
    try {
      setLoadingStep("Creating your account...")
      
      // Get verification token if available
      const verificationToken = localStorage.getItem('verification_token')
      
      // Call register function from auth context
      await register({
        email,
        fullName: formData.fullName,
        password: formData.password,
        verificationToken: verificationToken || undefined
      })
      
      setLoadingStep("Setting up your dashboard...")
      
      // Show success toast
      toast.success("Account created successfully!", {
        description: "Welcome to LiquidSync! Redirecting to your dashboard...",
        duration: 3000,
      })
      
      // Cleanup local storage
      localStorage.removeItem('signup_email')
      localStorage.removeItem('verification_token')
      
      // Navigation will be handled by the auth context
    } catch (error) {
      console.error('Registration error:', error)
      setLoadingStep("")
      
      if (error instanceof AuthAPIError) {
        setError(error.message)
      } else {
        setError('Failed to create account. Please try again.')
      }
    }
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const isFormValid = formData.fullName && 
    formData.password && 
    formData.confirmPassword && 
    formData.password === formData.confirmPassword &&
    agreedToTerms

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-lg mx-auto", className)} {...props}>
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <GalleryVerticalEnd className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Almost Done!</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Creating account for <span className="font-medium text-foreground">{email}</span>
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
              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-semibold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>OTP</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">3</div>
              <span>Details</span>
            </div>
          </div>
          
          {/* Complete Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange('password')}
                required
                className="h-11"
                minLength={8}
              />
              <p className={cn(
                "text-xs transition-colors",
                formData.password && formData.password.length < 8
                  ? "text-red-600 font-medium" 
                  : "text-muted-foreground"
              )}>
                Must be at least 8 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                required
                className="h-11"
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded border border-red-200">
                  ⚠️ Passwords do not match
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <a href="#" className="text-primary underline underline-offset-4 hover:text-primary/80">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary underline underline-offset-4 hover:text-primary/80">
                  Privacy Policy
                </a>
              </Label>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || !isFormValid}
              className="w-full h-11 bg-primary hover:bg-primary/80 active:bg-primary/70 text-primary-foreground transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {loadingStep || "Creating Account..."}
                </div>
              ) : (
                'Complete Signup & Enter Dashboard'
              )}
            </Button>
          </form>
          
          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => router.push('/signup/otp')}
              className="text-muted-foreground hover:text-foreground p-0 h-auto"
            >
              ← Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}