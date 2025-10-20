import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  registerUser,
  loginUser,
  verifyEmail,
  logoutUser,
  forgotPassword,
  resetPassword,
  resendVerification,
} from "@/api/services/auth"
import type { SignUpCredentials, LoginCredentials } from "@/types/types"
import { useAppStore } from "@/store/store"

// ✅ Login mutation
export const useLogin = () => {
  const { setUser } = useAppStore()
  
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data && data.accessToken) {
        // ✅ Store token in Zustand store only (not localStorage)
        setUser({
          name: data.user?.name || "User",
          email: data.user?.email || "",
          token: data.accessToken,
          isVerified: data.user?.isVerified || false,
        })
      }
    },
    onError: (error) => {
      console.error("Login failed:", error)
    },
  })
}

// ✅ Register mutation

export const useRegister = () => {
  const { setUser } = useAppStore()
  
  return useMutation({
    mutationFn: registerUser,
    retry: false, // ⭐ Add this to prevent automatic retries
    onSuccess: (data) => {
      if (data && data.accessToken) {
        // ✅ Store token in Zustand store only (not localStorage)
        setUser({
          name: data.user?.name || "User",
          email: data.user?.email || "",
          token: data.accessToken,
          isVerified: data.user?.isVerified || false,
        })
      }
    },
    onError: (error) => {
      console.error("Registration failed:", error)
    },
  })
}

// ✅ Email verification mutation
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      console.log("Email verified successfully")
    },
    onError: (error) => {
      console.error("Email verification failed:", error)
    },
  })
}

// ✅ Logout mutation
export const useLogout = () => {
  const { clearAll } = useAppStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // ✅ Clear all data from Zustand store only
      clearAll()
      queryClient.clear()
    },
    onError: (error) => {
      console.error("Logout failed:", error)
      // ✅ Still clear local data even if server logout fails
      clearAll()
      queryClient.clear()
    },
  })
}

// ✅ Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      console.log("Password reset email sent")
    },
    onError: (error) => {
      console.error("Forgot password failed:", error)
    },
  })
}

// ✅ Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      resetPassword(token, { password }),
    onSuccess: () => {
      console.log("Password reset successfully")
    },
    onError: (error) => {
      console.error("Password reset failed:", error)
    },
  })
}

// ✅ Resend verification mutation
export const useResendVerification = () => {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => resendVerification({ email }),
    onSuccess: () => {
      console.log("Verification code resent successfully")
    },
    onError: (error) => {
      console.error("Resend verification failed:", error)
    },
  })
}