import { GalleryVerticalEnd } from "lucide-react"
import { LazyConnectButton } from "@/components/lazy-connect-button"

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
  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-lg mx-auto", className)} {...props}>
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <GalleryVerticalEnd className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome to LiquidSync</h1>
              <p className="text-sm text-muted-foreground mt-1">Connect your wallet or sign in to continue</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Web3 Connection and Google Auth Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-3">Connect with Web3</p>
                <div className="flex justify-center">
                  <LazyConnectButton />
                </div>
              </div>
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
            </div>
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
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                required
                className="h-11"
              />
            </div>
            
            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign In with Email
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
