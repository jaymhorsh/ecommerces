import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/store/auth"
import type { User } from "@/store/auth"

export interface AuthPayload {
  email: string
  password: string
  name?: string
}

// Simulate auth service - replace with real API calls
const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Validate
    if (!email || !password) {
      throw new Error("Email and password required")
    }
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      id: Math.random(),
      email,
      name: email.split("@")[0],
    }
  },
  register: async (email: string, password: string, name: string): Promise<User> => {
    if (!email || !password || !name) {
      throw new Error("All fields required")
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      id: Math.random(),
      email,
      name,
    }
  },
}

export const useLoginMutation = () => {
  const setUser = useAuthStore((state) => state.setUser)

  const {
    mutateAsync: loginFn,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async (payload: AuthPayload) => await authService.login(payload.email, payload.password),
    onSuccess: (user) => {
      setUser(user)
    },
  })

  return { loginFn, isLoading, error }
}

export const useRegisterMutation = () => {
  const setUser = useAuthStore((state) => state.setUser)

  const {
    mutateAsync: registerFn,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async (payload: AuthPayload) =>
      await authService.register(payload.email, payload.password, payload.name || ""),
    onSuccess: (user) => {
      setUser(user)
    },
  })

  return { registerFn, isLoading, error }
}
