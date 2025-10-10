// ✅ Professional validation utilities

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// ✅ Email validation
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []
  
  if (!email) {
    errors.push('Email is required')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// ✅ Password validation
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []
  
  if (!password) {
    errors.push('Password is required')
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// ✅ Name validation
export function validateName(name: string): ValidationResult {
  const errors: string[] = []
  
  if (!name) {
    errors.push('Name is required')
  } else {
    if (name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long')
    }
    
    if (name.trim().length > 50) {
      errors.push('Name must be less than 50 characters')
    }
    
    if (!/^[a-zA-Z\s\u0400-\u04FF]+$/.test(name.trim())) {
      errors.push('Name can only contain letters and spaces')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// ✅ Phone validation (Uzbek format)
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = []
  
  if (!phone) {
    return { isValid: true, errors: [] } // Phone is optional
  }
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '')
  
  if (cleanPhone.length < 9) {
    errors.push('Phone number is too short')
  } else if (cleanPhone.length > 12) {
    errors.push('Phone number is too long')
  } else if (!/^998\d{9}$/.test(cleanPhone)) {
    errors.push('Please enter a valid Uzbek phone number (e.g., +998901234567)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// ✅ Form validation
export function validateForm<T extends Record<string, any>>(
  data: T,
  rules: Partial<Record<keyof T, (value: any) => ValidationResult>>
): ValidationResult {
  const allErrors: string[] = []
  
  for (const [field, validator] of Object.entries(rules)) {
    if (validator) {
      const result = validator(data[field])
      if (!result.isValid) {
        allErrors.push(...result.errors)
      }
    }
  }
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  }
}

// ✅ Common validation rules
export const validationRules = {
  email: validateEmail,
  password: validatePassword,
  name: validateName,
  phone: validatePhone,
} as const

// ✅ Sanitize input
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

// ✅ Format phone number
export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  
  if (cleanPhone.startsWith('998')) {
    return `+${cleanPhone}`
  } else if (cleanPhone.startsWith('9')) {
    return `+998${cleanPhone}`
  }
  
  return phone
}
