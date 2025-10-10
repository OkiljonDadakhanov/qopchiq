import axios, { AxiosError } from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ✅ Response interceptor for consistent error handling
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Transform error for consistent handling
    const transformedError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
    }
    
    return Promise.reject(transformedError);
  }
);

export default client;
