"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to new signup flow
    router.replace('/signup/email')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-light via-background to-peach-soft flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 mb-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-muted-foreground">Redirecting to signup...</p>
      </div>
    </div>
  )
}