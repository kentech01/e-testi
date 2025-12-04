import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { authAtom } from '../store/atoms/authAtom';
import { authService } from '../lib/firebase/auth';
import { userService } from '../services/users';
import { toast } from 'sonner';

// Helper function to parse name into firstName and lastName
const parseName = (
  name: string | null | undefined
): { firstName: string; lastName: string } => {
  if (!name || name.trim() === '') {
    return { firstName: '', lastName: '' };
  }

  const nameParts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  if (nameParts.length === 0) {
    return { firstName: '', lastName: '' };
  } else if (nameParts.length === 1) {
    return { firstName: nameParts[0], lastName: '' };
  } else {
    // First part is firstName, rest is lastName
    return {
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' '),
    };
  }
};

// Helper function to ensure user exists in database
const ensureUserInDatabase = async (
  firebaseUser: any,
  providedName?: string
) => {
  // Small delay to ensure token is in localStorage
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    // Try to get user profile - if it exists, user is already in DB
    const profile = await userService.getUserProfile();
    return profile;
  } catch (error: any) {
    

    // If user doesn't exist (404), create them
    // 401 might mean auth issue, but we'll try to create anyway
    if (error?.response?.status === 404 || error?.response?.status === 401) {
      try {
        

        // Use provided name if available, otherwise use displayName, otherwise use email prefix
        const nameToUse = providedName || firebaseUser.displayName || '';
        const { firstName, lastName } = parseName(nameToUse);

        // If we still don't have a firstName, use email prefix as fallback
        const finalFirstName =
          firstName || firebaseUser.email?.split('@')[0] || 'User';
        const finalLastName = lastName || '';

        

        const createdUser = await userService.createUser({
          firstName: finalFirstName,
          lastName: finalLastName,
          avatarUrl: firebaseUser.photoURL || undefined,
        });

        return createdUser;
      } catch (createError: any) {
        console.error('Failed to create user in database:', {
          status: createError?.response?.status,
          message: createError?.response?.data?.error || createError?.message,
          data: createError?.response?.data,
          error: createError,
        });

        // If user already exists (400), that's okay
        if (createError?.response?.status === 400) {
          console.log(
            'User already exists (race condition or validation error)'
          );
        } else {
          // Log the full error for debugging
          console.error('Full create error:', createError);
        }
        // Don't throw - allow login to continue even if DB creation fails
        // The error is already logged above
      }
    } else {
      console.error('Unexpected error checking user profile:', {
        status: error?.response?.status,
        message: error?.response?.data?.error || error?.message,
        error,
      });
    }
  }
};

export const useFirebaseAuth = () => {
  const [authState, setAuthState] = useRecoilState(authAtom);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const isInitialized = useRef(false);

  // Initialize auth state listener - only once
  useEffect(() => {
    if (isInitialized.current) return;

    isInitialized.current = true;

    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      

      if (firebaseUser) {
        const userData = authService.convertFirebaseUser(firebaseUser);
        firebaseUser
          .getIdToken()
          .then(async (token) => {
            // mirror token to localStorage for HttpClient
            try {
              localStorage.setItem('authToken', token);
            } catch (e) {
              console.error('Failed to save token to localStorage:', e);
            }

            // Ensure user exists in database (non-blocking)
            // Wait a bit to ensure token is available
            setTimeout(() => {
              ensureUserInDatabase(firebaseUser).catch((err) => {
                console.error('Error ensuring user in database:', err);
              });
            }, 300);

            setAuthState((prev) => ({
              ...prev,
              isAuthenticated: true,
              user: userData,
              token,
              loading: false,
              error: null,
            }));
          })
          .catch(() => {
            try {
              localStorage.removeItem('authToken');
            } catch {}
            setAuthState((prev) => ({
              ...prev,
              isAuthenticated: true,
              user: userData,
              token: null,
              loading: false,
              error: null,
            }));
          });
      } else {
        try {
          localStorage.removeItem('authToken');
        } catch {}
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null,
        }));
      }
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      isInitialized.current = false;
    };
  }, [setAuthState]);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    grade: string,
    school: string
  ) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const userCredential = await authService.signUp(
        email,
        password,
        name,
        grade,
        school
      );
      const userData = authService.convertFirebaseUser(userCredential.user);
      const token = await userCredential.user.getIdToken();

      try {
        localStorage.setItem('authToken', token);
      } catch {}

      // Store additional user data (grade, school) in the auth state
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: userData ? { ...userData, grade, school } : null,
        token,
        loading: false,
      }));

      // Create user in database (non-blocking)
      // Pass the name from signup to ensure proper firstName/lastName
      // Wait a bit to ensure token is available
      setTimeout(() => {
        ensureUserInDatabase(userCredential.user, name).catch((err) => {
          console.error('Error ensuring user in database:', err);
        });
      }, 300);

      toast.success('Llogaria u krijua me sukses!');
      return userCredential;
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const userCredential = await authService.signIn(email, password);
      const userData = authService.convertFirebaseUser(userCredential.user);
      const token = await userCredential.user.getIdToken();

      try {
        localStorage.setItem('authToken', token);
      } catch (e) {
        console.error('Failed to save token to localStorage:', e);
      }

      // Ensure user exists in database (non-blocking)
      // Wait a bit to ensure token is available
      setTimeout(() => {
        ensureUserInDatabase(userCredential.user).catch((err) => {
          console.error('Error ensuring user in database:', err);
        });
      }, 300);

      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: userData,
        token,
        loading: false,
      }));

      toast.success('U hytë me sukses në llogari!');
      return userCredential;
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const userCredential = await authService.signInWithGoogle();
      const userData = authService.convertFirebaseUser(userCredential.user);
      const token = await userCredential.user.getIdToken();

      try {
        localStorage.setItem('authToken', token);
      } catch (e) {
        console.error('Failed to save token to localStorage:', e);
      }

      // Ensure user exists in database (non-blocking)
      // Wait a bit to ensure token is available
      setTimeout(() => {
        ensureUserInDatabase(userCredential.user).catch((err) => {
          console.error('Error ensuring user in database:', err);
        });
      }, 300);

      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: userData,
        token,
        loading: false,
      }));

      toast.success('U hytë me sukses me Google!');
      return userCredential;
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    try {

      // Clear the state immediately for better UX
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      }));
      try {
        localStorage.removeItem('authToken');
      } catch {}

      // Try Firebase signOut in the background
      try {
        await authService.signOut();
      } catch (firebaseError) {
        console.log(
          'Firebase signOut failed, but user is already logged out locally:',
          firebaseError
        );
      }

      toast.success('U dolët me sukses nga llogaria!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.success('U dolët nga llogaria!');
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };
};

// Helper function to convert Firebase error codes to user-friendly messages
const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Kjo adresë email është tashmë në përdorim';
    case 'auth/weak-password':
      return 'Fjalëkalimi është shumë i dobët';
    case 'auth/invalid-email':
      return 'Adresa email nuk është e vlefshme';
    case 'auth/user-not-found':
      return 'Nuk u gjet përdorues me këtë email';
    case 'auth/wrong-password':
      return 'Fjalëkalimi është i gabuar';
    case 'auth/too-many-requests':
      return 'Shumë përpjekje të gabuara. Provo përsëri më vonë';
    case 'auth/network-request-failed':
      return 'Gabim në rrjet. Kontrollo lidhjen tuaj';
    case 'auth/operation-not-allowed':
      return 'Operacioni nuk lejohet. Kontaktoni administratorin';
    case 'auth/requires-recent-login':
      return 'Kërkohet hyrje e re për të vazhduar';
    case 'auth/popup-closed-by-user':
      return 'Dritarja e hyrjes u mbyll. Provo përsëri';
    case 'auth/popup-blocked':
      return 'Dritarja e hyrjes u bllokua. Lejo popup-et për këtë faqe';
    case 'auth/cancelled-popup-request':
      return 'Kërkesa u anulua. Provo përsëri';
    case 'auth/account-exists-with-different-credential':
      return 'Ekziston një llogari me këtë email por me metodë tjetër hyrjeje';
    case 'auth/invalid-credential':
      return 'Kredencialet janë të pavlefshme';
    case 'auth/user-disabled':
      return 'Llogaria është e çaktivizuar';
    case 'auth/invalid-verification-code':
      return 'Kodi i verifikimit është i pavlefshëm';
    case 'auth/invalid-verification-id':
      return 'ID-ja e verifikimit është e pavlefshme';
    default:
      return 'Ndodhi një gabim. Provo përsëri';
  }
};
