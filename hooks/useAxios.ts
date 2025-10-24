// hooks/useAxios.ts
import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { useMemo } from 'react';

const API_BASE_URL = 'http://localhost:3001';

const useAxios = (): AxiosInstance => {
  const accessToken = '';

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
        'Content-Type': 'application/json',
      },
      timeout: 3000000, // 5  minutes timeout
    });

    // Request interceptor to add auth token
    instance.interceptors.request.use(
      (config) => {
        // Update the Authorization header with the latest token
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && originalRequest) {
          // You could implement token refresh logic here
          // For now, we'll just reject the error.
          console.warn('Authentication failed. Please sign in again.');
        }

        // Handle network errors
        if (!error.response) {
          console.error('Network error:', error.message);
        }

        // Handle server errors
        if (error.response && error.response.status >= 500) {
          console.error('Server error:', error.response.status);
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [accessToken]);

  return axiosInstance;
};

export default useAxios;
