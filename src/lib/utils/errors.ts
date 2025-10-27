export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication failed') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Access denied') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConflictError'
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class ExternalServiceError extends Error {
  constructor(service: string, message: string) {
    super(`${service} service error: ${message}`)
    this.name = 'ExternalServiceError'
  }
}

export function isError(error: unknown): error is Error {
  return error instanceof Error
}

export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message
  }
  return String(error)
}

export function logError(error: unknown, context?: string): void {
  const message = getErrorMessage(error)
  const logMessage = context ? `${context}: ${message}` : message

  console.error(logMessage)

  if (isError(error) && error.stack) {
    console.error(error.stack)
  }
}

export function safeAsync<T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<T> {
  return fn().catch((error) => {
    logError(error, errorMessage)
    throw error
  })
}

export function safeSync<T>(
  fn: () => T,
  errorMessage?: string
): T {
  try {
    return fn()
  } catch (error) {
    logError(error, errorMessage)
    throw error
  }
}