import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { auth } from './config';

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  grade?: string;
  school?: string;
}

export const authService = {
  // Sign up with email and password
  async signUp(
    email: string,
    password: string,
    name: string,
    grade: string,
    school: string
  ): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's display name
      if (userCredential.user) {
        await userCredential.user.updateProfile({
          displayName: name,
        });
      }

      return userCredential;
    } catch (error) {
      throw error;
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  },

  // Sign out - using a more reliable approach
  async signOut(): Promise<void> {
    try {
      console.log('Calling Firebase signOut...');

      // Check if user is actually signed in before attempting sign out
      if (auth.currentUser) {
        await firebaseSignOut(auth);
        console.log('Firebase signOut completed');
      } else {
        console.log('No user to sign out');
      }
    } catch (error) {
      console.error('Firebase signOut error:', error);
      // Don't throw the error - let the calling code handle it
      throw error;
    }
  },

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Convert Firebase user to our UserData format
  convertFirebaseUser(firebaseUser: FirebaseUser | null): UserData | null {
    if (!firebaseUser) return null;

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      // Note: grade and school would need to be stored in Firestore for persistence
      // For now, we'll handle them in the component state
    };
  },
};
