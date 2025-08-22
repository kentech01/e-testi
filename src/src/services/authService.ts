import { apiService } from './api';
import { User, LoginCredentials, SignupData, AuthResponse } from '../types/auth';

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // For now, mock the login until real API is ready
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          name: 'Ardi Hoxha',
          email: credentials.email,
          grade: '12',
          school: 'Liceu i Përgjithshëm "Sami Frashëri" - Prishtinë',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      apiService.setToken(mockResponse.token);
      localStorage.setItem('maturaUser', JSON.stringify(mockResponse.user));
      
      return mockResponse.user;
    } catch (error) {
      // When API is ready, replace with:
      // const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      throw error;
    }
  }

  async signup(userData: SignupData): Promise<User> {
    try {
      // Mock signup for now
      const mockResponse: AuthResponse = {
        user: {
          id: Math.random().toString(36).substr(2, 9),
          name: userData.name,
          email: userData.email,
          grade: userData.grade,
          school: userData.school,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      apiService.setToken(mockResponse.token);
      localStorage.setItem('maturaUser', JSON.stringify(mockResponse.user));
      
      return mockResponse.user;
    } catch (error) {
      // When API is ready, replace with:
      // const response = await apiService.post<AuthResponse>('/auth/signup', userData);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // When API is ready, call logout endpoint
      // await apiService.post('/auth/logout');
      
      apiService.removeToken();
      localStorage.removeItem('maturaUser');
    } catch (error) {
      // Still remove local data even if API call fails
      apiService.removeToken();
      localStorage.removeItem('maturaUser');
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const savedUser = localStorage.getItem('maturaUser');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      
      // When API is ready, replace with:
      // const response = await apiService.get<{ user: User }>('/auth/me');
      // return response.user;
      
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      // Mock update for now
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not found');
      }

      const updatedUser = {
        ...currentUser,
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('maturaUser', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      // When API is ready, replace with:
      // const response = await apiService.put<User>('/auth/profile', userData);
      throw error;
    }
  }
}

export const authService = new AuthService();