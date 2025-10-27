import { z } from 'zod'

// Application field validation
export const applicationFieldSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
  type: z.enum(['TEXT', 'SELECT', 'CHECKBOX', 'DATE', 'NUMBER', 'EMAIL', 'PHONE']),
  label: z.string().min(1, 'Field label is required'),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  validation: z.object({
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    pattern: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
  order: z.number().int().min(0),
})

export type ApplicationFieldInput = z.infer<typeof applicationFieldSchema>

// Create application schema
export const createApplicationSchema = z.object({
  name: z.string().min(1, 'Application name is required').max(100, 'Application name must be 100 characters or less'),
  description: z.string().min(1, 'Application description is required').max(500, 'Application description must be 500 characters or less'),
  isActive: z.boolean().optional().default(true),
  requiresApproval: z.boolean().optional().default(true),
  approvalWorkflow: z.array(z.enum(['ADMIN', 'APPROVER_L1', 'APPROVER_L2'])).optional(),
})

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>

// Update application schema
export const updateApplicationSchema = createApplicationSchema.partial()

export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>

// Application request schema
export const createApplicationRequestSchema = z.object({
  applicationId: z.string().uuid('Invalid application ID'),
  requestType: z.enum(['NEW_ACCOUNT', 'EXISTING_ACCOUNT', 'LOCK_ACCOUNT']),
  environment: z.enum(['PROD', 'TEST', 'BOTH']),
  justification: z.string().min(50, 'Justification must be at least 50 characters long').max(2000, 'Justification must be 2000 characters or less'),
  requestedRoles: z.array(z.string()).min(1, 'At least one role must be requested'),
  fieldValues: z.record(z.any()).optional(),
})

export type CreateApplicationRequestInput = z.infer<typeof createApplicationRequestSchema>

// Update application request schema
export const updateApplicationRequestSchema = createApplicationRequestSchema.partial()

export type UpdateApplicationRequestInput = z.infer<typeof updateApplicationRequestSchema>

// Approval action schema
export const processApprovalSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'REQUEST_CHANGES', 'DELEGATE']),
  comments: z.string().optional(),
  delegateTo: z.string().uuid('Invalid user ID for delegation').optional(),
})

export type ProcessApprovalInput = z.infer<typeof processApprovalSchema>

// Add refinement to ensure comments are required for rejections and change requests
export const refinedProcessApprovalSchema = processApprovalSchema.refine(
  (data) => {
    if (data.action === 'REJECT' || data.action === 'REQUEST_CHANGES') {
      return data.comments && data.comments.trim().length > 0
    }
    return true
  },
  {
    message: 'Comments are required when rejecting or requesting changes',
    path: ['comments'],
  }
).refine(
  (data) => {
    if (data.action === 'DELEGATE') {
      return data.delegateTo && data.delegateTo.trim().length > 0
    }
    return true
  },
  {
    message: 'Delegate user ID is required when delegating',
    path: ['delegateTo'],
  }
)