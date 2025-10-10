import authClient from '@/api/authClient';
import type { UserProfile, UpdateProfileData, ChangePasswordData } from '@/types/profile';

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
    
    return payload as UserProfile;
  } catch (error) {
    handleProfileError(error);
    throw error; // Re-throw the error to maintain the Promise rejection
  }
};

export const updateUserProfile = async (payload: UpdateProfileData): Promise<UserProfile> => {
  try {
    const { data } = await authClient.patch('/api/users/me', payload);
    const payloadData = data?.user ?? data;
    
    if (!payloadData) {
      throw new Error('No updated profile data received');
    }
    
    return payloadData as UserProfile;
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

export default {
  fetchUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUser,
};

