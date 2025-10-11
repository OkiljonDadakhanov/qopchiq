"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadFile } from "@/api/services/upload"
import { useAppStore } from "@/store/store"

/**
 * useUploadFile — handles avatar or general file upload with react-query mutation
 */
export const useUploadFile = () => {
  const qc = useQueryClient()
  const { user, setUser } = useAppStore()

  return useMutation<string, Error, FormData>({
    mutationFn: async (formData) => {
      // Make sure upload only runs client-side
      if (typeof window === "undefined") {
        throw new Error("File upload requires client-side execution")
      }

      const result = await uploadFile(formData)
      return result // e.g. returns uploaded file URL
    },

    onSuccess: (uploadedUrl) => {
      // ✅ Optionally update user's avatar or related state
      if (user && uploadedUrl) {
        setUser({ ...user, avatar: uploadedUrl })
      }

      // ✅ Invalidate any cached profile data
      qc.invalidateQueries({ queryKey: ["profile"] })
    },

    onError: (error) => {
      console.error("File upload failed:", error)
    },
  })
}
