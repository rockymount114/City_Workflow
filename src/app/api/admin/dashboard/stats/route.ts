import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get dashboard statistics
    const [
      totalUsers,
      totalApplications,
      pendingRequests,
      approvedRequests
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Total applications
      prisma.application.count(),

      // Pending requests (SUBMITTED and UNDER_REVIEW)
      prisma.applicationRequest.count({
        where: {
          status: {
            in: ['SUBMITTED', 'UNDER_REVIEW']
          }
        }
      }),

      // Approved requests
      prisma.applicationRequest.count({
        where: {
          status: 'APPROVED'
        }
      })
    ])

    return NextResponse.json({
      totalUsers,
      totalApplications,
      pendingRequests,
      approvedRequests
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}