import type {
  User as PrismaUser,
  Application,
  ApplicationField,
  ApplicationRole,
  ApplicationRequest,
  ApprovalStep,
  AuditLog,
  Notification,
} from '@prisma/client'

// Re-export types
export type {
  Application,
  ApplicationField,
  ApplicationRole,
  ApplicationRequest,
  ApprovalStep,
  AuditLog,
  Notification,
}

// Export User type with original name
export type User = PrismaUser

export {
  UserRole,
  RequestStatus,
  RequestPriority,
  RequestType,
  ApplicationEnvironment,
  FieldType,
  ApprovalStatus,
  ApprovalAction,
  AuditAction,
  EntityType,
  NotificationType,
} from '@prisma/client'

// Custom types for business logic
export interface UserWithRelations extends User {
  requests?: ApplicationRequest[]
  approvalSteps?: ApprovalStep[]
}

export interface ApplicationRequestWithRelations extends ApplicationRequest {
  user: User
  application: Application
  approvalSteps?: ApprovalStep[]
}

export interface ApprovalStepWithRelations extends ApprovalStep {
  request: ApplicationRequest
  approver: User
  delegatedTo?: User | null
}

export interface PaginationOptions {
  page: number
  limit: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}