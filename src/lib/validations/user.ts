import { z } from 'zod'
import { emailSchema, passwordSchema } from './auth'

// User role enum
export const userRoleSchema = z.enum(['ADMIN', 'APPROVER_L1', 'APPROVER_L2', 'APPLICANT'])

// Create user schema (for admin user creation)
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or less'),
  role: userRoleSchema,
  department: z.string().optional(),
  division: z.string().optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

// Update user schema (for admin user updates)
export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or less').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or less').optional(),
  role: userRoleSchema.optional(),
  department: z.string().optional(),
  division: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

// User profile update schema (for users updating their own profile)
export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or less'),
  department: z.string().min(1, 'Department is required'),
  division: z.string().optional(),
  workPhone: z.string().optional(),
  supervisorName: z.string().min(1, 'Supervisor name is required'),
  supervisorEmail: z.string().email('Please enter a valid supervisor email address'),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'New passwords do not match',
  path: ['confirmPassword'],
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

// Reset password schema (for admin password resets)
export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>