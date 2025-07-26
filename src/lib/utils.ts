import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function untuk menggabungkan class names dengan Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility function untuk validasi email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Utility function untuk validasi password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password minimal 8 karakter')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password harus mengandung huruf besar')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password harus mengandung huruf kecil')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password harus mengandung angka')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Utility function untuk format phone number Indonesia
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Add +62 prefix if not present and starts with 0
  if (cleaned.startsWith('0')) {
    return '+62' + cleaned.substring(1)
  }
  
  // Add +62 prefix if not present and doesn't start with 62
  if (!cleaned.startsWith('62')) {
    return '+62' + cleaned
  }
  
  // Add + prefix if not present
  if (!cleaned.startsWith('+')) {
    return '+' + cleaned
  }
  
  return cleaned
}

/**
 * Utility function untuk validasi phone number Indonesia
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if it's a valid Indonesian phone number
  // Should start with 62 (country code) and have 10-13 digits total
  if (cleaned.startsWith('62')) {
    return cleaned.length >= 11 && cleaned.length <= 15
  }
  
  // If starts with 0, should have 10-13 digits
  if (cleaned.startsWith('0')) {
    return cleaned.length >= 10 && cleaned.length <= 13
  }
  
  return false
}