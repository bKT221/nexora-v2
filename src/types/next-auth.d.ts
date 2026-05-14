import 'next-auth'
import 'next-auth/jwt'

// Extend NextAuth types with our custom profile fields
declare module 'next-auth' {
  interface User {
    profile?: string
    role?: string
    country?: string | null
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      profile: string
      role: string
      country: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    profile: string
    role: string
    country: string | null
  }
}
