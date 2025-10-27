import { getServerSession } from 'next-auth/next'
import { authOptions } from './config'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized')
  }
  return user
}

export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole)
}

export function isAdmin(userRole: string): boolean {
  return userRole === 'ADMIN'
}

export function isApprover(userRole: string): boolean {
  return ['APPROVER_L1', 'APPROVER_L2', 'ADMIN'].includes(userRole)
}

export function canApproveAtLevel(userRole: string, requiredLevel: number): boolean {
  if (userRole === 'ADMIN') return true
  if (userRole === 'APPROVER_L2') return true
  if (userRole === 'APPROVER_L1') return requiredLevel === 1
  return false
}