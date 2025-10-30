import { API_BASE_URL } from '@/config/api';
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

class HttpClient {
  private static _instance: AxiosInstance | null = null;

  static get instance(): AxiosInstance {
    if (!HttpClient._instance) {
      const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      // Attach Authorization header from localStorage on each request
      instance.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('authToken');
          if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Basic response/error passthrough (customize as needed)
      instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error: AxiosError) => Promise.reject(error)
      );

      HttpClient._instance = instance;
    }
    return HttpClient._instance;
  }
}

export default HttpClient;
