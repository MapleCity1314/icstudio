import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  id: string
  name: string
  email?: string
  phone?: string
  avatar?: string
  role: string
}

type AuthState = {
  user: User | null
  isLoading: boolean
  error: string | null
  success: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSuccess: (success: string | null) => void
  clearUser: () => void
  updateUser: (userData: Partial<User>) => void
}

export const useAuthStore = create<AuthState, [['zustand/persist', AuthState]]>(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      success: null,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setSuccess: (success) => set({ success }),
      clearUser: () => set({ user: null }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
)