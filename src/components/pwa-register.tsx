'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    // Only register service worker in production-like environments
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    // Register the service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'activated' &&
                navigator.serviceWorker.controller
              ) {
                // New version available — could show a toast to user
                console.log('[PWA] New version activated')
              }
            })
          }
        })

        console.log('[PWA] Service Worker registered successfully')
      } catch (error) {
        console.warn('[PWA] Service Worker registration failed:', error)
      }
    }

    registerSW()

    // Handle controller change (new SW activated)
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    })
  }, [])

  return null
}
