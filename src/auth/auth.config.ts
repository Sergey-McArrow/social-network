import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/prisma'
import Google from 'next-auth/providers/google'
import type { DefaultSession, NextAuthConfig } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (typeof token.id === 'string' && token.id) {
        session.user.id = token.id
      }
      return session
    },
  },

  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}
