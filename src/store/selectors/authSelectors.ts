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
    return authState.user;
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
