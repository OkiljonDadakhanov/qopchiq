"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadFile, UploadResponse } from "@/api/services/upload"
import { useAppStore } from "@/store/store"

/**
 * useUploadFile — handles avatar or general file upload with react-query mutation
 */
export const useUploadFile = () => {
  const qc = useQueryClient()
  const { user, setUser } = useAppStore()

  return useMutation<UploadResponse, Error, FormData>({
    mutationFn: async (formData) => {
      // Make sure upload only runs client-side
      if (typeof window === "undefined") {
        throw new Error("File upload requires client-side execution")
      }

      const result = await uploadFile(formData)
      return result // e.g. returns uploaded file URL or response object
    },

    onSuccess: (uploadResponse) => {
      // ✅ Optionally update user's avatar or related state
      if (user && uploadResponse?.file) {
        // setUser expects a Partial<User> — pass an object with the updated fields
        setUser({
          // preserve existing token and other fields are merged in the store implementation
          avatar: {
            id: uploadResponse.file.id,
            url: uploadResponse.file.url,
          },
        })
      }

      // ✅ Invalidate any cached profile data
      qc.invalidateQueries({ queryKey: ["profile"] })
    },

    onError: (error) => {
      console.error("File upload failed:", error)
    },
  })
}
