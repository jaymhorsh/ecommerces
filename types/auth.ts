export interface User {
  id: number
  email: string
  name: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  hasHydrated: boolean
  setUser: (user: User | null) => void
  setHasHydrated: (state: boolean) => void
  clearAuth: () => void
  
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: User
  token?: string
}
