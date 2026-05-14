import type { NextAuthOptions } from 'next-auth'
import { getServerSession as getNextAuthSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

// Reusable helper to get the server session in server components / API routes
export async function getServerSession() {
  return getNextAuthSession(authOptions)
}

// NextAuth configuration with Credentials provider and JWT session strategy
// Note: We don't use PrismaAdapter because Credentials provider + JWT strategy
// handles user lookup directly in the authorize() function.
// The adapter would require Account, Session & VerificationToken models.
export const authOptions: NextAuthOptions = {
  // JWT session strategy (no database sessions — better for mobile/offline)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages (use our AuthModal instead)
  pages: {
    signIn: '/',
    error: '/',
  },

  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis.')
        }

        // Look up user in the database
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('Aucun compte trouvé avec cet email.')
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValidPassword) {
          throw new Error('Mot de passe incorrect.')
        }

        // Return user object (will be encoded into the JWT)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          profile: user.profile,
          role: user.role,
          country: user.country,
        }
      },
    }),
  ],

  callbacks: {
    // Include user profile type and role in the JWT token
    async jwt({ token, user, trigger, session }) {
      // On sign in, add custom fields from the user object
      if (user) {
        token.id = user.id
        token.profile = (user as { profile?: string }).profile ?? 'etudiant'
        token.role = (user as { role?: string }).role ?? 'user'
        token.country = (user as { country?: string }).country ?? null
      }

      // On session update (e.g. profile change), refresh the token
      if (trigger === 'update' && session) {
        token.profile = session.profile ?? token.profile
        token.name = session.name ?? token.name
      }

      return token
    },

    // Expose custom fields to the session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.profile = token.profile as string
        session.user.role = token.role as string
        session.user.country = token.country as string | null
      }
      return session
    },
  },

  // Secret for signing/encrypting JWT
  secret: process.env.NEXTAUTH_SECRET,

  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',
}
