import { atom } from 'recoil';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  grade?: string;
  municipality?: number | null;
  school?: number | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
}

export const authAtom = atom<AuthState>({
  key: 'authState',
  default: {
    isAuthenticated: false,
    user: null,
    loading: true, // Start with loading true to handle initial auth state
    error: null,
    token: null,
  },
});
