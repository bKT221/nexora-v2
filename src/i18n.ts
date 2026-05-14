import fr from '@/messages/fr.json'
import wo from '@/messages/wo.json'
import sw from '@/messages/sw.json'
import bm from '@/messages/bm.json'

export type Locale = 'fr' | 'wo' | 'sw' | 'bm'

export const locales: Locale[] = ['fr', 'wo', 'sw', 'bm']

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  wo: 'Wolof',
  sw: 'Kiswahili',
  bm: 'Bamanankan',
}

export const localeFlags: Record<Locale, string> = {
  fr: '🇫🇷',
  wo: '🇸🇳',
  sw: '🇰🇪',
  bm: '🇲🇱',
}

const messages: Record<Locale, Record<string, unknown>> = {
  fr,
  wo,
  sw,
  bm,
}

/**
 * Get all messages for a given locale
 */
export function getMessages(locale: Locale): Record<string, unknown> {
  return messages[locale] ?? messages.fr
}

/**
 * Get a nested value from an object using a dot-separated path
 * e.g. getNestedValue(obj, 'nav.home') => 'Accueil'
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path // Return the key itself as fallback
    }
  }
  return typeof current === 'string' ? current : path
}

/**
 * Translate a key using the given locale
 * Falls back to French if the key is not found in the current locale
 */
export function t(locale: Locale, key: string): string {
  const msgs = getMessages(locale)
  const value = getNestedValue(msgs, key)
  // If the value equals the key (not found), try French fallback
  if (value === key && locale !== 'fr') {
    return getNestedValue(messages.fr, key)
  }
  return value
}

/**
 * Get the current locale - returns 'fr' as default
 * This can be used in client components that read from the store
 */
export function getLocale(): Locale {
  if (typeof window !== 'undefined') {
    // Try to read from localStorage for persistence
    const stored = localStorage.getItem('nexora-locale')
    if (stored && locales.includes(stored as Locale)) {
      return stored as Locale
    }
  }
  return 'fr'
}
