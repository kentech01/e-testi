import { selector } from 'recoil';
import { authAtom } from '../atoms/authAtom';

export const isAuthenticatedSelector = selector({
  key: 'isAuthenticatedSelector',
  get: ({ get }) => {
    const authState = get(authAtom);
    return authState.isAuthenticated;
  },
});

export const currentUserSelector = selector({
  key: 'currentUserSelector',
  get: ({ get }) => {
    const authState = get(authAtom);
    return authState;
  },
});

export const authLoadingSelector = selector({
  key: 'authLoadingSelector',
  get: ({ get }) => {
    const authState = get(authAtom);
    return authState.loading;
  },
});

export const authErrorSelector = selector({
  key: 'authErrorSelector',
  get: ({ get }) => {
    const authState = get(authAtom);
    return authState.error;
  },
});

export const authTokenSelector = selector({
  key: 'authTokenSelector',
  get: ({ get }) => {
    const authState = get(authAtom);
    return authState.token;
  },
});

/**
 * Check if the current user is an admin
 * TODO: Replace with actual admin check logic (e.g., check user.role === 'admin' or user.email in admin list)
 * For now, returns true for all authenticated users
 */
export const isAdminSelector = selector({
  key: 'isAdminSelector',
  get: ({ get }) => {
    const authState = get(authAtom);
    if (!authState.isAuthenticated || !authState.user) {
      return false;
    }
    // TODO: Implement actual admin check
    // Example: return authState.user.role === 'admin';
    // Example: return ['admin@example.com'].includes(authState.user.email || '');
    return true; // For now, allow all authenticated users
  },
});
