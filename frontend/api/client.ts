import axios, { AxiosError } from 'axios';
import { getApiBaseUrl } from '@/lib/config';

export const API_URL = getApiBaseUrl();

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
   
    
    return Promise.reject(error);
  }
);

export default client;
