/**
 * User Atoms
 *
 * Usage Example:
 *
 * import { useRecoilState, useSetRecoilState } from 'recoil';
 * import { userAtom } from '@/store/atoms/userAtom';
 *
 * function MyComponent() {
 *   const [userState, setUserState] = useRecoilState(userAtom);
 *
 *   // Update user
 *   setUserState({ ...userState, user: newUser });
 * }
 */

import { atom } from 'recoil';
import { User } from '../../services/users';

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const userAtom = atom<UserState>({
  key: 'userState',
  default: {
    user: null,
    loading: false,
    error: null,
  },
});

