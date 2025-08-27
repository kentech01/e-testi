import { atom } from 'recoil';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const authAtom = atom<AuthState>({
  key: 'authState',
  default: {
    isAuthenticated: false,
    accessToken: null,
    user: null,
    loading: false,
    error: null,
  },
});
