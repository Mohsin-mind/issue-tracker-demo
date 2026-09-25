import axios, { AxiosError } from 'axios';
import { ApiResponse } from '../types';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor to unwrap data and normalize errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);
