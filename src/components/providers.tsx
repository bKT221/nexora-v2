'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import PWARegister from '@/components/pwa-register'

// Client-side providers wrapper — wraps children with SessionProvider and ThemeProvider
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <PWARegister />
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}
