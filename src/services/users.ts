import { AxiosInstance } from 'axios';
import HttpClient from './httpClient';

// Types based on backend User entity
export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations (optional, populated when fetched with relations)
  userAnswers?: any[];
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

/**
 * User Service Class
 * Uses a shared HttpClient instance
 */
export class UserService {
  private api: AxiosInstance;

  constructor() {
    this.api = HttpClient.instance;
  }

  /**
   * Create a new user
   * POST /users
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await this.api.post<User>('users', data);
    return response.data;
  }

  /**
   * Get current user profile
   * GET /users/profile
   */
  async getUserProfile(): Promise<User> {
    const response = await this.api.get<User>('users/profile');
    return response.data;
  }

  /**
   * Update current user
   * PUT /users
   */
  async updateUser(data: UpdateUserRequest): Promise<User> {
    const response = await this.api.put<User>('users', data);
    return response.data;
  }

  /**
   * Delete current user
   * DELETE /users
   */
  async deleteUser(): Promise<void> {
    await this.api.delete('users');
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;

