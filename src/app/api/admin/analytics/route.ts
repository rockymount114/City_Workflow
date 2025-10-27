import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Get analytics data
    const [
      totalRequests,
      approvedRequests,
      rejectedRequests,
      pendingRequests,
      topApplications,
      monthlyTrends
    ] = await Promise.all([
      // Total requests in date range
      prisma.applicationRequest.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),

      // Approved requests in date range
      prisma.applicationRequest.count({
        where: {
          status: 'APPROVED',
          createdAt: {
            gte: startDate
          }
        }
      }),

      // Rejected requests in date range
      prisma.applicationRequest.count({
        where: {
          status: 'REJECTED',
          createdAt: {
            gte: startDate
          }
        }
      }),

      // Pending requests (SUBMITTED and UNDER_REVIEW)
      prisma.applicationRequest.count({
        where: {
          status: {
            in: ['SUBMITTED', 'UNDER_REVIEW']
          }
        }
      }),

      // Top applications by request count
      prisma.application.findMany({
        select: {
          name: true,
          _count: {
            select: {
              requests: true
            }
          }
        },
        orderBy: {
          requests: {
            _count: 'desc'
          }
        },
        take: 5
      }).then(apps =>
        apps.map(app => ({
          name: app.name,
          count: app._count.requests
        }))
      ),

      // Monthly trends (last 6 months)
      prisma.$queryRaw<Array<{ month: string; requests: bigint; approved: bigint }>>`
        SELECT
          DATE_FORMAT(createdAt, '%Y-%m') as month,
          COUNT(*) as requests,
          SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) as approved
        FROM ApplicationRequest
        WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
        ORDER BY month DESC
      `.then(results =>
        results.map(row => ({
          month: row.month,
          requests: Number(row.requests),
          approved: Number(row.approved)
        }))
      )
    ])

    // Calculate average processing time
    const processedRequests = await prisma.applicationRequest.findMany({
      where: {
        status: {
          in: ['APPROVED', 'REJECTED']
        },
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true,
        updatedAt: true
      }
    })

    const averageProcessingTime = processedRequests.length > 0
      ? processedRequests.reduce((sum, request) => {
          const processingTime = request.updatedAt.getTime() - request.createdAt.getTime()
          return sum + processingTime
        }, 0) / processedRequests.length / (1000 * 60 * 60) // Convert to hours
      : 0

    return NextResponse.json({
      totalRequests,
      approvedRequests,
      rejectedRequests,
      pendingRequests,
      averageProcessingTime: Math.round(averageProcessingTime * 10) / 10,
      topApplications,
      monthlyTrends
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}