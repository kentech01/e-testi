import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { authAtom } from '../store/atoms/authAtom';
import { authService } from '../lib/firebase/auth';
import { toast } from 'sonner';

export const useFirebaseAuth = () => {
  const [authState, setAuthState] = useRecoilState(authAtom);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const isInitialized = useRef(false);

  // Initialize auth state listener - only once
  useEffect(() => {
    if (isInitialized.current) return;

    isInitialized.current = true;

    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      console.log(
        'Auth state changed:',
        firebaseUser ? 'User logged in' : 'User logged out'
      );

      if (firebaseUser) {
        const userData = authService.convertFirebaseUser(firebaseUser);
        firebaseUser
          .getIdToken()
          .then((token) => {
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

      // Store additional user data (grade, school) in the auth state
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: userData ? { ...userData, grade, school } : null,
        token,
        loading: false,
      }));

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
      console.log('Starting sign out process...');

      // Clear the state immediately for better UX
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      }));

      // Try Firebase signOut in the background
      try {
        await authService.signOut();
        console.log('Firebase signOut completed successfully');
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
