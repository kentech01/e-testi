/**
 * User Selectors
 *
 * Usage Example:
 *
 * import { useRecoilValue } from 'recoil';
 * import {
 *   userSelector,
 *   userLoadingSelector,
 *   userErrorSelector,
 *   userFullNameSelector,
 *   isUserActiveSelector
 * } from '@/store/selectors/userSelectors';
 *
 * function MyComponent() {
 *   const user = useRecoilValue(userSelector);
 *   const loading = useRecoilValue(userLoadingSelector);
 *   const fullName = useRecoilValue(userFullNameSelector);
 * }
 */

import { selector } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import { User } from '../../services/users';

export const userSelector = selector<User | null>({
  key: 'userSelector',
  get: ({ get }) => {
    const state = get(userAtom);
    return state.user;
  },
});

export const userLoadingSelector = selector<boolean>({
  key: 'userLoadingSelector',
  get: ({ get }) => {
    const state = get(userAtom);
    return state.loading;
  },
});

export const userErrorSelector = selector<string | null>({
  key: 'userErrorSelector',
  get: ({ get }) => {
    const state = get(userAtom);
    return state.error;
  },
});

/**
 * Get user's full name (firstName + lastName)
 */
export const userFullNameSelector = selector<string | null>({
  key: 'userFullNameSelector',
  get: ({ get }) => {
    const user = get(userSelector);
    if (!user) return null;
    return `${user.firstName} ${user.lastName}`.trim();
  },
});

/**
 * Get user's first name
 */
export const userFirstNameSelector = selector<string | null>({
  key: 'userFirstNameSelector',
  get: ({ get }) => {
    const user = get(userSelector);
    return user?.firstName || null;
  },
});

/**
 * Get user's last name
 */
export const userLastNameSelector = selector<string | null>({
  key: 'userLastNameSelector',
  get: ({ get }) => {
    const user = get(userSelector);
    return user?.lastName || null;
  },
});

/**
 * Get user's email
 */
export const userEmailSelector = selector<string | null>({
  key: 'userEmailSelector',
  get: ({ get }) => {
    const user = get(userSelector);
    return user?.email || null;
  },
});

/**
 * Get user's avatar URL
 */
export const userAvatarUrlSelector = selector<string | null>({
  key: 'userAvatarUrlSelector',
  get: ({ get }) => {
    const user = get(userSelector);
    return user?.avatarUrl || null;
  },
});

/**
 * Check if user is active
 */
export const isUserActiveSelector = selector<boolean>({
  key: 'isUserActiveSelector',
  get: ({ get }) => {
    const user = get(userSelector);
    return user?.isActive ?? false;
  },
});

/**
 * Check if user exists (is loaded)
 */
export const hasUserSelector = selector<boolean>({
  key: 'hasUserSelector',
  get: ({ get }) => {
    const user = get(userSelector);
    return user !== null;
  },
});

/**
 * Get user's ID
 */
export const userIdSelector = selector<string | null>({
  key: 'userIdSelector',
  get: ({ get }) => {
    const user = get(userSelector);
    return user?.id || null;
  },
});

/**
 * Get user's Firebase UID
 */
export const userFirebaseUidSelector = selector<string | null>({
  key: 'userFirebaseUidSelector',
  get: ({ get }) => {
    const user = get(userSelector);
    return user?.firebaseUid || null;
  },
});

