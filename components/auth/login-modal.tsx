"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { Button } from "@/components/ui/button"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false)

  const handleSuccess = () => {
    onOpenChange(false)
    setIsRegister(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isRegister ? "Create Account" : "Sign In"}</DialogTitle>
        </DialogHeader>

        {isRegister ? <RegisterForm onSuccess={handleSuccess} /> : <LoginForm onSuccess={handleSuccess} />}

        <div className="text-center text-sm text-muted-foreground">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <Button variant="link" className="p-0 h-auto text-primary" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Sign in" : "Create one"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
