import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(persist(
  (set) => ({
    user: null,
    token: null,
    isAdmin: false,
    login: (user, token) => set({ user, token, isAdmin: user?.role === 'admin' }),
    logout: () => set({ user: null, token: null, isAdmin: false }),
  }),
  { name: 'auth-storage' }
))

export const useThemeStore = create(persist(
  (set) => ({
    dark: false,
    toggle: () => set(s => {
      const next = !s.dark
      document.documentElement.classList.toggle('dark', next)
      return { dark: next }
    }),
    init: () => {
      const stored = JSON.parse(localStorage.getItem('theme-storage') || '{}')
      if (stored?.state?.dark) document.documentElement.classList.add('dark')
    }
  }),
  { name: 'theme-storage' }
))
