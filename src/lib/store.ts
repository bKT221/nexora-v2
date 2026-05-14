import { create } from 'zustand'
import type { Locale } from '@/i18n'

export type AppView = 'landing' | 'app' | 'admin'
export type AppTab = 'accueil' | 'nexa' | 'academie' | 'social' | 'marketplace'
export type UserProfile = 'etudiant' | 'entrepreneur'
export type AuthMode = 'login' | 'register'

interface AppState {
  view: AppView
  tab: AppTab
  profile: UserProfile
  lowDataMode: boolean
  nexoraCoins: number
  xp: number
  level: number
  streak: number
  isAuthModalOpen: boolean
  authMode: AuthMode
  locale: Locale
  setView: (view: AppView) => void
  setTab: (tab: AppTab) => void
  setProfile: (profile: UserProfile) => void
  toggleLowDataMode: () => void
  addXp: (amount: number) => void
  addCoins: (amount: number) => void
  setIsAuthModalOpen: (open: boolean) => void
  setAuthMode: (mode: AuthMode) => void
  openAuthModal: (mode?: AuthMode) => void
  closeAuthModal: () => void
  setLocale: (locale: Locale) => void
}

export const useNexoraStore = create<AppState>((set) => ({
  view: 'landing',
  tab: 'accueil',
  profile: 'etudiant',
  lowDataMode: false,
  nexoraCoins: 2450,
  xp: 3280,
  level: 12,
  streak: 7,
  isAuthModalOpen: false,
  authMode: 'login',
  locale: 'fr',
  setView: (view) => set({ view }),
  setTab: (tab) => set({ tab }),
  setProfile: (profile) => set({ profile }),
  toggleLowDataMode: () => set((s) => ({ lowDataMode: !s.lowDataMode })),
  addXp: (amount) => set((s) => ({ xp: s.xp + amount, level: Math.floor((s.xp + amount) / 300) + 1 })),
  addCoins: (amount) => set((s) => ({ nexoraCoins: s.nexoraCoins + amount })),
  setIsAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  setAuthMode: (mode) => set({ authMode: mode }),
  openAuthModal: (mode) => set({ isAuthModalOpen: true, authMode: mode || 'login' }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setLocale: (locale) => {
    // Persist locale to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexora-locale', locale)
      // Update html lang attribute
      document.documentElement.lang = locale
    }
    set({ locale })
  },
}))
