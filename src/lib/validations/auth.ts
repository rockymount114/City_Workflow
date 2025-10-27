import { z } from 'zod'

// Password validation schema
export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[@$!%*?&]/, 'Password must contain at least one special character')

// Email validation schema
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .regex(/@city\.gov$/, 'Email must be a city government email address')

// Phone validation schema
export const phoneSchema = z
  .string()
  .regex(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/, 'Phone must be in format (XXX) XXX-XXXX')

// Employee ID validation schema
export const employeeIdSchema = z
  .string()
  .regex(/^EMP[0-9]{6}$/, 'Employee ID must be in format EMP123456')

// User registration schema
export const registerUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or less'),
  employeeId: employeeIdSchema,
  department: z.string().min(1, 'Department is required'),
  division: z.string().optional(),
  workPhone: phoneSchema,
  supervisorName: z.string().min(1, 'Supervisor name is required'),
  supervisorEmail: z.string().email('Please enter a valid supervisor email address'),
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>

// User login schema
export const loginUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export type LoginUserInput = z.infer<typeof loginUserSchema>

// Update user schema
export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or less').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or less').optional(),
  department: z.string().min(1, 'Department is required').optional(),
  division: z.string().optional(),
  workPhone: phoneSchema.optional(),
  supervisorName: z.string().min(1, 'Supervisor name is required').optional(),
  supervisorEmail: z.string().email('Please enter a valid supervisor email address').optional(),
  role: z.enum(['APPLICANT', 'APPROVER_L1', 'APPROVER_L2', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>