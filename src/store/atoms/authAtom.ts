import { atom } from 'recoil';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  grade?: string;
  school?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const authAtom = atom<AuthState>({
  key: 'authState',
  default: {
    isAuthenticated: false,
    user: null,
    loading: true, // Start with loading true to handle initial auth state
    error: null,
  },
});
