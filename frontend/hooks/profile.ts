import { useMemo } from "react"
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

const normalizeProfile = (
  profile?: Partial<UserProfile> | null
): UserProfile | undefined => {
  if (!profile) return undefined

  const phone = "phone" in profile ? profile.phone : undefined
  const phoneNumber = (profile as Partial<UserProfile>).phoneNumber ?? phone

  const rawAvatar = (profile as Partial<UserProfile>).avatar
  let avatar: UserProfile["avatar"] = null

  if (rawAvatar && typeof rawAvatar === "object") {
    avatar = rawAvatar as UserProfile["avatar"]
  } else if (typeof rawAvatar === "string") {
    avatar = { id: "", url: rawAvatar }
  }

  return {
    ...profile,
    phone: phone ?? phoneNumber ?? "",
    phoneNumber: phoneNumber ?? phone ?? "",
    avatar,
    createdAt: (profile as Partial<UserProfile>).createdAt ?? "",
    updatedAt: (profile as Partial<UserProfile>).updatedAt ?? "",
    lastLogin: (profile as Partial<UserProfile>).lastLogin ?? "",
  } as UserProfile
}

export const useFetchProfile = () => {
  const { user } = useAppStore()
  const hasHydrated = useAppStore((s) => s.hasHydrated)

  const placeholder = useMemo(
    () => normalizeProfile(user as Partial<UserProfile>),
    [user]
  )

  return useQuery<UserProfile, Error>({
    queryKey: ["profile"],
    queryFn: async ({ signal }) => {
      const profile = await fetchUserProfile({ signal })
      return normalizeProfile({ ...profile, token: user?.token }) as UserProfile
    },
    enabled: hasHydrated && !!user?.token,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: placeholder ? () => placeholder : undefined,
  })
}

export const useUpdateProfile = () => {
  const qc = useQueryClient()
  const { setUser, user } = useAppStore()
  
  return useMutation<UserProfile, Error, UpdateProfileData>({
    mutationFn: updateUserProfile,
    onSuccess: (updatedProfile) => {
      const normalized = normalizeProfile({
        ...updatedProfile,
        token: user?.token,
      })

      if (normalized) {
        // ✅ Update Zustand store with complete updated profile (saves to localStorage)
        setUser({
          ...user,
          name: normalized.name,
          email: normalized.email,
          phone: normalized.phone,
          avatar: normalized.avatar,
          isVerified: normalized.isVerified,
        })

        // ✅ Keep React Query cache in sync to avoid unnecessary refetches
        qc.setQueryData(["profile"], normalized)
      }
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
      const normalized = normalizeProfile({
        ...updatedProfile,
        token: user?.token,
      })

      if (normalized) {
        if (user) {
          setUser({
            ...user,
            name: normalized.name,
            email: normalized.email,
            phone: normalized.phone,
            avatar: normalized.avatar,
            isVerified: normalized.isVerified,
          })
        }

        qc.setQueryData(["profile"], normalized)
      }
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
      const normalized = normalizeProfile({
        ...updatedProfile,
        token: user?.token,
      })

      if (normalized) {
        if (user) {
          setUser({
            ...user,
            phone: normalized.phone,
          })
        }

        qc.setQueryData(["profile"], normalized)
      }
    },
    onError: (error) => {
      console.error("Phone update failed:", error)
    },
  })
}
