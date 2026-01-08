import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  name?: string;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasHydrated: (state: boolean) => void;

  // Auth operations
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name?: string) => Promise<void>;

  // Guest checkout support
  continueAsGuest: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasHydrated: false,

      // Setters
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setHasHydrated: (state) => set({ hasHydrated: state }),

      // Login (placeholder - implement with your auth API)
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          // TODO: Implement actual login API call
          // For now, simulate a login
          console.log('Login attempt:', email, password);
          
          // Placeholder user
          const user: User = {
            id: 1,
            email,
            name: email.split('@')[0],
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Login failed';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      // Logout
      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      // Register (placeholder - implement with your auth API)
      register: async (email: string, password: string, name?: string) => {
        try {
          set({ isLoading: true, error: null });
          // TODO: Implement actual register API call
          console.log('Register attempt:', email, password, name);
          
          const user: User = {
            id: 1,
            email,
            name: name || email.split('@')[0],
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Registration failed';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      // Continue as guest (no auth required)
      continueAsGuest: () => {
        set({ isAuthenticated: false, user: null, error: null });
      },
    }),
    {
      name: 'ecommerce-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
