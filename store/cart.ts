import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { CartState } from "@/types"

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: null,
      hasHydrated: false,
      setCart: (cart) => set({ cart }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
      clearCart: () => set({ cart: null }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true)
        }
      },
    },
  ),
)
