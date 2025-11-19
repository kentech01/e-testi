import { useRecoilValue } from 'recoil';
import { isAdminSelector } from '../store/selectors/authSelectors';

/**
 * Hook to check if the current user is an admin
 * @returns true if user is admin, false otherwise
 */
export const useIsAdmin = () => {
  return useRecoilValue(isAdminSelector);
};

/**
 * Utility function to check if a user is admin
 * This can be used outside of React components
 * @param user - User object to check
 * @returns true if user is admin, false otherwise
 */
export const isUserAdmin = (user: { email?: string | null; role?: string } | null): boolean => {
  if (!user) {
    return false;
  }
  
  // TODO: Implement actual admin check
  // Example: return user.role === 'admin';
  // Example: return ['admin@example.com'].includes(user.email || '');
  return true; // For now, allow all authenticated users
};

