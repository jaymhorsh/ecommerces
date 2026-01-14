"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>

        <Card className="p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isRegister ? "Create Account" : "Welcome Back"}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {isRegister
                ? "Sign up to start shopping and track orders"
                : "Sign in to your account to continue shopping"}
            </p>
          </div>

          {isRegister ? <RegisterForm onSuccess={handleSuccess} /> : <LoginForm onSuccess={handleSuccess} />}

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isRegister ? "Already have an account? " : "Don't have an account? "}
            </span>
            <Button variant="link" className="p-0 h-auto text-primary" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Sign in" : "Create account"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue as guest</span>
            </div>
          </div>

          <Link href="/shop-all" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              Browse Products
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
