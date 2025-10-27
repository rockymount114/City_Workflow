import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function isPasswordStrong(password: string): boolean {
  // Check minimum length
  if (password.length < 12) return false

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) return false

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) return false

  // Check for numbers
  if (!/[0-9]/.test(password)) return false

  // Check for special characters
  if (!/[@$!%*?&]/.test(password)) return false

  return true
}

export function generatePasswordRequirements(): string[] {
  return [
    'At least 12 characters long',
    'At least one lowercase letter (a-z)',
    'At least one uppercase letter (A-Z)',
    'At least one number (0-9)',
    'At least one special character (@$!%*?&)',
  ]
}