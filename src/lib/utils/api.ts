import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  )
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: unknown
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  )
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return errorResponse(error.code, error.message, error.statusCode, error.details)
  }

  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {}
    error.errors.forEach((err) => {
      const path = err.path.join('.')
      if (!fieldErrors[path]) {
        fieldErrors[path] = []
      }
      fieldErrors[path].push(err.message)
    })

    return errorResponse('VALIDATION_ERROR', 'Validation failed', 400, { fields: fieldErrors })
  }

  if (error instanceof Error) {
    return errorResponse('INTERNAL_ERROR', error.message, 500)
  }

  return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred', 500)
}

export function validateRequest<T>(
  schema: import('zod').ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      throw error
    }
    throw new Error('Validation failed')
  }
}

export function requireAuth(request: Request): string {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Authorization header required')
  }

  // This would be implemented with NextAuth.js session validation
  // For now, return a placeholder
  return 'user-id-placeholder'
}

export function paginate<T>(
  items: T[],
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit)
  const hasNext = page < totalPages
  const hasPrev = page > 1

  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    },
  }
}