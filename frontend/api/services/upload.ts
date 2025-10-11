import authClient from "../authClient";

// ===============================
// Upload Response Types
// ===============================
export interface UploadResponse {
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
  console.error('Upload service error:', error);
  throw new Error(error.message || 'Upload operation failed');
};

// ✅ Upload file to general folder
export const uploadFile = async (formData: FormData): Promise<UploadResponse> => {
  try {
    const { data } = await authClient.post('/api/upload/upload?folder=general', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (!data.success || !data.file) {
      throw new Error('Invalid upload response');
    }
    
    return data as UploadResponse;
  } catch (error) {
    handleUploadError(error);
    throw error;
  }
};

console.log('uploaded file ', uploadFile)

// ✅ Upload avatar specifically
export const uploadAvatar = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return uploadFile(formData);
};