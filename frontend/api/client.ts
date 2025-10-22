import axios, { AxiosError } from 'axios';
import { getApiBaseUrl } from '@/lib/config';
import { useBusinessStore } from '@/store/business-store';

export const API_URL = getApiBaseUrl();

const client = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ✅ Request interceptor to add business token
client.interceptors.request.use(
  (config) => {
    const token = useBusinessStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor for consistent error handling
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Transform error for consistent handling
   
    
    return Promise.reject(error);
  }
);

export default client;
