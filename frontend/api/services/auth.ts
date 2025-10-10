import client from '../client';
import authClient from '../authClient';
import type { SignUpCredentials, AuthResponse } from '../../types/types';

// ✅ Professional error handling for auth services
const handleAuthError = (error: any) => {
  console.error('Auth service error:', error);
  throw new Error(error.message || 'Authentication failed');
};

export const registerUser = async (payload: SignUpCredentials): Promise<AuthResponse> => {
  try {
    const { data } = await client.post('/api/auth/signup', payload);
    return data as AuthResponse;
  } catch (error) {
    handleAuthError(error);
  }
};

export const loginUser = async (payload: { email: string; password: string }): Promise<AuthResponse> => {
  try {
    const { data } = await client.post('/api/auth/login', payload);
    return data as AuthResponse;
  } catch (error) {
    handleAuthError(error);
  }
};

export const verifyEmail = async (payload: { code: string }): Promise<void> => {
  try {
    const { data } = await client.post('/api/auth/verify-email', payload);
    return data as void;
  } catch (error) {
    handleAuthError(error);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    // use authClient so Authorization header is attached
    await authClient.post('/api/auth/logout');
  } catch (error) {
    // Don't throw error for logout - user should be logged out regardless
    console.warn('Logout request failed:', error);
  }
};

export const forgotPassword = async (payload: { email: string }): Promise<void> => {
  try {
    const { data } = await client.post('/api/auth/forgot-password', payload);
    return data as void;
  } catch (error) {
    handleAuthError(error);
  }
};

export const resetPassword = async (token: string, payload: { password: string }): Promise<void> => {
  try {
    const { data } = await client.post(`/api/auth/reset-password/${token}`, payload);
    return data as void;
  } catch (error) {
    handleAuthError(error);
  }
};

export default {
  registerUser,
  loginUser,
  verifyEmail,
  logoutUser,
  forgotPassword,
  resetPassword,
};
