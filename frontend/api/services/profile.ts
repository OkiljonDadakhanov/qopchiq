import authClient from '@/api/authClient';
import { uploadAvatar } from '@/api/services/upload';
import type { UserProfile, UpdateProfileData, ChangePasswordData, UpdateAvatar } from '@/types/profile';

// ✅ Professional error handling for profile services
const handleProfileError = (error: any) => {
  console.error('Profile service error:', error);
  throw new Error(error.message || 'Profile operation failed');
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    const { data } = await authClient.get('/api/users/me');
    // API may return { user: { ... } } or return the user object directly
    const payload = data?.user ?? data;
    
    if (!payload) {
      throw new Error('No profile data received');
    }
    
    // ✅ Map API field names to expected field names
    const mappedProfile = {
      ...payload,
      phone: payload.phoneNumber || payload.phone,
      avatar: payload.avatar || null,
      // ✅ Keep date fields as they are (already in ISO format from API)
      createdAt: payload.createdAt || "",
      updatedAt: payload.updatedAt || "",
      lastLogin: payload.lastLogin || "",
    };
    
    // ✅ Debug: Log date information
   
    
    return mappedProfile as UserProfile;
  } catch (error) {
    handleProfileError(error);
    throw error; // Re-throw the error to maintain the Promise rejection
  }
};

// ✅ Fetch updated profile after avatar update
export const fetchUpdatedProfile = async (): Promise<UserProfile> => {
  try {
    const { data } = await authClient.get('/api/users/me');
    
    // API may return { user: { ... } } or return the user object directly
    const payload = data?.user ?? data;
    
    if (!payload) {
      throw new Error('No updated profile data received');
    }
    
    // ✅ Map API field names to expected field names
    const mappedProfile = {
      ...payload,
      phone: payload.phoneNumber || payload.phone,
      avatar: payload.avatar || null,
      // ✅ Keep date fields as they are (already in ISO format from API)
      createdAt: payload.createdAt || "",
      updatedAt: payload.updatedAt || "",
      lastLogin: payload.lastLogin || "",
    };
    
    return mappedProfile as UserProfile;
  } catch (error) {
    handleProfileError(error);
    throw error;
  }
};

// ✅ Update avatar with two-step process: upload file then update user
export const updateAvatar = async (file: File): Promise<UserProfile> => {
  try {
    // Step 1: Upload the file
    const uploadResponse = await uploadAvatar(file);
    
    // Step 2: Update user profile with avatar data
    const avatarData = {
      avatar: {
        id: uploadResponse.file.id,
        url: uploadResponse.file.url
      }
    };
    
    // Step 3: Update the user's avatar
    await authClient.patch('/api/users/me/avatar', avatarData);
    
    // Step 4: Fetch the updated profile to get the complete user data
    const updatedProfile = await fetchUpdatedProfile();
    
    return updatedProfile;
  } catch (error) {
    handleProfileError(error);
    throw error;
  }
};

export const updateUserProfile = async (payload: UpdateProfileData): Promise<UserProfile> => {
  try {
    const { data } = await authClient.patch('/api/users/me', payload);
    const payloadData = data?.user ?? data;
    
    if (!payloadData) {
      throw new Error('No updated profile data received');
    }
    
    // ✅ Map API field names to expected field names
    const mappedProfile = {
      ...payloadData,
      phone: payloadData.phoneNumber || payloadData.phone, // Handle both phoneNumber and phone
      avatar: payloadData.avatar || null, // Ensure avatar is properly handled
      // ✅ Keep date fields as they are (already in ISO format from API)
      createdAt: payloadData.createdAt || "",
      updatedAt: payloadData.updatedAt || "",
      lastLogin: payloadData.lastLogin || "",
    };
    
    return mappedProfile as UserProfile;
  } catch (error) {
    handleProfileError(error);
    throw error; // Re-throw the error to maintain the Promise rejection
  }
};

export const changeUserPassword = async (payload: ChangePasswordData): Promise<void> => {
  try {
    const { data } = await authClient.post('/api/change-password', payload);
    return data as void;
  } catch (error) {
    handleProfileError(error);
    throw error; // Re-throw the error to maintain the Promise rejection
  }
};

export const deleteUser = async (): Promise<void> => {
  try {
    const { data } = await authClient.delete('/api/users/me');
    return data as void;
  } catch (error) {
    handleProfileError(error);
    throw error; // Re-throw the error to maintain the Promise rejection
  }
};

// ✅ Update single field (avatar, phone, etc.)
export const updateUserField = async (key: string, value: string): Promise<UserProfile> => {
  try {
    const { data } = await authClient.patch(`/api/users/me/${key}`, { [key]: value });
    const payloadData = data?.user ?? data;
    
    if (!payloadData) {
      throw new Error('No updated profile data received');
    }
    
    // ✅ Map API field names to expected field names
    const mappedProfile = {
      ...payloadData,
      phone: payloadData.phoneNumber || payloadData.phone, // Handle both phoneNumber and phone
      avatar: payloadData.avatar || null, // Ensure avatar is properly handled
      // ✅ Keep date fields as they are (already in ISO format from API)
      createdAt: payloadData.createdAt || "",
      updatedAt: payloadData.updatedAt || "",
      lastLogin: payloadData.lastLogin || "",
    };
    
    return mappedProfile as UserProfile;
  } catch (error) {
    handleProfileError(error);
    throw error;
  }
};

// ✅ Update phone number specifically  
export const updatePhone = async (phone: string): Promise<UserProfile> => {
  return updateUserField('phone', phone);
};

export default {
  fetchUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUser,
};

