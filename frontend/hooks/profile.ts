import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  updateUserProfile,
  fetchUserProfile,
  changeUserPassword,
  deleteUser,
  updateAvatar,
  updatePhone,
} from "@/api/services/profile"
import type {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
} from "@/types/profile"
import { useAppStore } from "@/store/store"

export const useFetchProfile = () => {
  const { user } = useAppStore()
  
  return useQuery<UserProfile, Error>({
    queryKey: ["profile"],
    queryFn: async () => {
      // ✅ Ensure fetch only runs on client (where token exists)
      if (typeof window === "undefined") {
        throw new Error("Profile fetch requires client-side execution")
      }
      return await fetchUserProfile()
    },
    enabled: typeof window !== "undefined" && !!user?.token,
    retry: 1,
    staleTime: 0, // Always consider data stale to ensure fresh fetches
    gcTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useUpdateProfile = () => {
  const qc = useQueryClient()
  const { setUser, user } = useAppStore()
  
  return useMutation<UserProfile, Error, UpdateProfileData>({
    mutationFn: updateUserProfile,
    onSuccess: (updatedProfile) => {
      // ✅ Update Zustand store with new profile data
      if (user) {
        setUser({
          ...user,
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          avatar: updatedProfile.avatar,
          isVerified: updatedProfile.isVerified,
        })
      }
      
      // ✅ Invalidate and refetch profile query
      qc.invalidateQueries({ queryKey: ["profile"] })
      qc.refetchQueries({ queryKey: ["profile"] })
    },
    onError: (error) => {
      console.error("Profile update failed:", error)
    },
  })
}

export const useChangePassword = () => {
  return useMutation<void, Error, ChangePasswordData>({
    mutationFn: changeUserPassword,
  })
}

export const useDeleteUser = () => {
  const qc = useQueryClient()
  const { clearAll } = useAppStore()
  
  return useMutation<void, Error, void>({
    mutationFn: deleteUser,
    onSuccess: () => {
      // ✅ Clear all queries and user data from Zustand store only
      qc.clear()
      clearAll()
    },
    onError: (error) => {
      console.error("User deletion failed:", error)
    },
  })
}

// ✅ Hook for updating avatar
export const useUpdateAvatar = () => {
  const qc = useQueryClient()
  const { setUser, user } = useAppStore()
  
  return useMutation<UserProfile, Error, File>({
    mutationFn: updateAvatar,
    onSuccess: (updatedProfile) => {
      // ✅ Update Zustand store with new avatar
      if (user) {
        setUser({
          ...user,
          avatar: updatedProfile.avatar,
        })
      }
      
      // ✅ Invalidate and refetch profile query
      qc.invalidateQueries({ queryKey: ["profile"] })
      qc.refetchQueries({ queryKey: ["profile"] })
    },
    onError: (error) => {
      console.error("Avatar update failed:", error)
    },
  })
}

// ✅ Hook for updating phone number
export const useUpdatePhone = () => {
  const qc = useQueryClient()
  const { setUser, user } = useAppStore()
  
  return useMutation<UserProfile, Error, string>({
    mutationFn: updatePhone,
    onSuccess: (updatedProfile) => {
      // ✅ Update Zustand store with new phone
      if (user) {
        setUser({
          ...user,
          phone: updatedProfile.phone,
        })
      }
      
      // ✅ Invalidate and refetch profile query
      qc.invalidateQueries({ queryKey: ["profile"] })
      qc.refetchQueries({ queryKey: ["profile"] })
    },
    onError: (error) => {
      console.error("Phone update failed:", error)
    },
  })
}
