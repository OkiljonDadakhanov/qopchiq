# Token Management System

## Overview
Bu loyihada professional token management tizimi joriy etilgan. Token'lar endi faqat Zustand store'da saqlanadi va localStorage ishlatilmaydi.

## Key Changes

### 1. Zustand Store Integration
- Token'lar endi faqat Zustand store'da saqlanadi
- `setToken()`, `getToken()`, `clearToken()` metodlari qo'shildi
- Persist middleware orqali avtomatik saqlash

### 2. Axios Interceptor Updates
- Request interceptor endi Zustand store'dan token o'qiydi
- Response interceptor 401 xatoligida Zustand store'ni tozalaydi
- localStorage ishlatish to'liq olib tashlandi

### 3. Auth Hooks Refactoring
- `useLogin()`, `useRegister()`, `useLogout()` hooks yangilandi
- Token'lar faqat Zustand store'da saqlanadi
- localStorage ishlatish olib tashlandi

### 4. Profile Management
- Profile hooks Zustand store bilan to'liq integratsiya qilindi
- Token management professional darajada amalga oshirildi

## File Changes

### Modified Files:
- `store/store.ts` - Token management metodlari qo'shildi
- `api/authClient.ts` - Zustand store bilan integratsiya
- `hooks/auth.ts` - localStorage ishlatish olib tashlandi
- `hooks/profile.ts` - Token management yangilandi
- `components/profile/profile-page.tsx` - localStorage ishlatish olib tashlandi
- `components/signin-form.tsx` - tokenService import olib tashlandi
- `components/signup-form.tsx` - tokenService import olib tashlandi

### Deleted Files:
- `api/tokenService.ts` - Endi kerak emas

### New Files:
- `lib/cookie-utils.ts` - Cookie management utilities
- `lib/server-cookie-utils.ts` - SSR uchun server-side cookie utilities

## Usage Examples

### Getting Token
```typescript
import { useToken } from '@/store/store'

function MyComponent() {
  const token = useToken()
  // token is string | null
}
```

### Setting Token
```typescript
import { useSetToken } from '@/store/store'

function MyComponent() {
  const setToken = useSetToken()
  
  const handleLogin = (newToken: string) => {
    setToken(newToken)
  }
}
```

### Clearing Token
```typescript
import { useClearToken } from '@/store/store'

function MyComponent() {
  const clearToken = useClearToken()
  
  const handleLogout = () => {
    clearToken()
  }
}
```

## Benefits

1. **Security**: Token'lar localStorage'da saqlanmaydi
2. **Performance**: Zustand store tezroq ishlaydi
3. **Consistency**: Barcha token operatsiyalari markazlashtirilgan
4. **SSR Ready**: Server-side rendering uchun tayyor
5. **Professional**: Enterprise-level token management

## Future Enhancements

1. **httpOnly Cookies**: Backend'da httpOnly cookie'lar qo'llash
2. **Refresh Tokens**: Automatic token refresh mechanism
3. **Token Encryption**: Token'larni shifrlash
4. **Session Management**: Advanced session handling

## Testing

Barcha token operatsiyalari test qilingan:
- ✅ Login flow
- ✅ Register flow  
- ✅ Logout flow
- ✅ Profile operations
- ✅ Error handling
- ✅ Token persistence

## Migration Notes

Agar eski localStorage token'lari bor bo'lsa, ular avtomatik ravishda tozalanadi. Yangi tizim to'liq backward compatible.
