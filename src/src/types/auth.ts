export interface User {
  id: string;
  name: string;
  email: string;
  grade: string;
  school?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  grade: string;
  school: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}