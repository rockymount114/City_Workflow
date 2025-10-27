import { hashPassword, verifyPassword, isPasswordStrong } from '@/lib/auth/password'

describe('Password Service', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'TestPassword123!'
      const hashedPassword = await hashPassword(password)

      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword.length).toBeGreaterThan(50)
    })
  })

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const password = 'TestPassword123!'
      const hashedPassword = await hashPassword(password)

      const isValid = await verifyPassword(password, hashedPassword)
      expect(isValid).toBe(true)
    })

    it('should reject an incorrect password', async () => {
      const password = 'TestPassword123!'
      const wrongPassword = 'WrongPassword123!'
      const hashedPassword = await hashPassword(password)

      const isValid = await verifyPassword(wrongPassword, hashedPassword)
      expect(isValid).toBe(false)
    })
  })

  describe('isPasswordStrong', () => {
    it('should accept a strong password', () => {
      const strongPassword = 'TestPassword123!'
      expect(isPasswordStrong(strongPassword)).toBe(true)
    })

    it('should reject a password that is too short', () => {
      const shortPassword = 'Test123!'
      expect(isPasswordStrong(shortPassword)).toBe(false)
    })

    it('should reject a password without lowercase letters', () => {
      const noLowercase = 'TESTPASSWORD123!'
      expect(isPasswordStrong(noLowercase)).toBe(false)
    })

    it('should reject a password without uppercase letters', () => {
      const noUppercase = 'testpassword123!'
      expect(isPasswordStrong(noUppercase)).toBe(false)
    })

    it('should reject a password without numbers', () => {
      const noNumbers = 'TestPassword!'
      expect(isPasswordStrong(noNumbers)).toBe(false)
    })

    it('should reject a password without special characters', () => {
      const noSpecialChars = 'TestPassword123'
      expect(isPasswordStrong(noSpecialChars)).toBe(false)
    })
  })
})