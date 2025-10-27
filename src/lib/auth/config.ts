import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db/client'
import { verifyPassword } from './password'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.isActive) {
            return null
          }

          // Check if account is locked
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            return null
          }

          // Verify password
          const isValidPassword = await verifyPassword(credentials.password, user.passwordHash)

          if (!isValidPassword) {
            // Increment failed login attempts
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: user.failedLoginAttempts + 1,
                lockedUntil: user.failedLoginAttempts + 1 >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null // Lock for 30 minutes after 5 attempts
              }
            })
            return null
          }

          // Reset failed login attempts and update last login
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: 0,
              lockedUntil: null,
              lastLoginAt: new Date()
            }
          })

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            department: user.department,
            employeeId: user.employeeId
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutes
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.department = user.department
        token.employeeId = user.employeeId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.department = token.department as string
        session.user.employeeId = token.employeeId as string
      }
      return session
    }
  }
}

// Extend NextAuth session type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: string
      department: string
      employeeId: string
    }
  }

  interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    department: string
    employeeId: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    department: string
    employeeId: string
  }
}