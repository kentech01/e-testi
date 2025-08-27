import { selector } from 'recoil';
import { authAtom } from '../atoms/authAtom';

export const isAuthenticatedSelector = selector({
  key: 'isAuthenticatedSelector',
  get: ({ get }) => {
    const auth = get(authAtom);
    return auth.isAuthenticated && !!auth.accessToken;
  },
});

export const userRoleSelector = selector({
  key: 'userRoleSelector',
  get: ({ get }) => {
    const auth = get(authAtom);
    return auth.user?.role || null;
  },
});
