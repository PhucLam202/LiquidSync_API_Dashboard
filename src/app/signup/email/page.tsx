import { EmailSignupForm } from "@/features/auth/components/EmailSignupForm"
import { RedirectIfAuthenticated } from "@/features/auth/components/ProtectedRoute"

export default function EmailSignupPage() {
  return (
    <RedirectIfAuthenticated>
      <div className="min-h-screen bg-gradient-to-br from-peach-light via-background to-peach-soft flex flex-col items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFBE98' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        {/* Main Content */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Join LiquidSync</h1>
            <p className="text-muted-foreground">Enter your email to get started</p>
          </div>
          
          <EmailSignupForm />
          
          {/* Footer */}
          <div className="text-center mt-8 text-xs text-muted-foreground">
            <p>© 2024 LiquidSync. All rights reserved.</p>
          </div>
        </div>
      </div>
    </RedirectIfAuthenticated>
  )
}