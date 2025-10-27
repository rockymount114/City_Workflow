import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'
import { updateApplicationSchema } from '@/lib/validations/application'

// GET /api/admin/applications/[id] - Get a specific application
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        customFields: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error('Error fetching application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/applications/[id] - Update an application
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    // Validate input
    const validation = updateApplicationSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Check if application exists
    const existingApplication = await prisma.application.findUnique({
      where: { id: params.id }
    })

    if (!existingApplication) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const { name, description, isActive, requiresApproval, approvalWorkflow } = validation.data

    // Check if name is already taken by another application
    if (name !== existingApplication.name) {
      const nameExists = await prisma.application.findFirst({
        where: {
          name,
          id: { not: params.id }
        }
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'Application name already in use' },
          { status: 409 }
        )
      }
    }

    // Update application
    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        name,
        description,
        isActive,
        requiresApproval,
        approvalWorkflow
      },
      include: {
        customFields: true
      }
    })

    // TODO: Add proper audit logging with hash generation

    return NextResponse.json(application)
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/applications/[id] - Delete an application
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if application exists
    const application = await prisma.application.findUnique({
      where: { id: params.id }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Delete application (this will cascade delete related data)
    await prisma.application.delete({
      where: { id: params.id }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        entityType: 'APPLICATION',
        entityId: params.id,
        oldValues: {
          name: application.name,
          requiresApproval: application.requiresApproval
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ message: 'Application deleted successfully' })
  } catch (error) {
    console.error('Error deleting application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}