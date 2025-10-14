import authClient from "../authClient";

// ===============================
// Upload Response Types
// ===============================
export interface UploadResponse {
  id: string;
  url: string;
  success: boolean
  file: {
    id: string
    url: string
    name: string
    size: number
    mimeType: string
  }
}

const handleUploadError = (error: any) => {
  console.error("Upload service error:", error);
  throw new Error(
    error?.response?.data?.message || error.message || "Upload operation failed",
  );
};

// ✅ Upload file to a specific folder
export const uploadFile = async (
  formData: FormData,
  folder = "general",
): Promise<UploadResponse> => {
  try {
    const { data } = await authClient.post(
      `/api/upload/upload?folder=${encodeURIComponent(folder)}`,
      formData,
    );

    if (!data?.success || !data.file) {
      throw new Error("Invalid upload response");
    }

    return data as UploadResponse;
  } catch (error) {
    handleUploadError(error);
    throw error;
  }
};

// ✅ Upload avatar specifically
export const uploadAvatar = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return uploadFile(formData, "avatars");
};