'use client'

import { useNexoraStore } from '@/lib/store'
import NexoraLanding from '@/components/nexora/landing'
import AppShell from '@/components/nexora/app-shell'
import AdminDashboard from '@/components/nexora/admin-dashboard'
import AuthModal from '@/components/nexora/auth-modal'
import { useTheme } from 'next-themes'

export default function Home() {
  const { view, setView, isAuthModalOpen, closeAuthModal } = useNexoraStore()
  const { theme, setTheme } = useTheme()

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      {view === 'admin' && <AdminDashboard />}
      {view === 'app' && <AppShell />}
      {view === 'landing' && (
        <NexoraLanding
          onEnterApp={() => setView('app')}
          onToggleTheme={handleToggleTheme}
        />
      )}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
        />
      )}
    </>
  )
}
