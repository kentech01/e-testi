import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './config';
import { supabase, getSupabaseBucket } from '../supabase/client';

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  grade?: string;
  school?: string;
  photoURL?: string | null;
}

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const authService = {
  // Sign up with email and password
  async signUp(
    email: string,
    password: string,
    name: string,
    grade: string,
    school: number,
    municipality: number
  ): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Update the user's display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name,  });
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

  // Sign in with Google using popup
  async signInWithGoogle(): Promise<UserCredential> {
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (error) {
      throw error;
    }
  },

  // Sign in with Google using redirect (for mobile)
  async signInWithGoogleRedirect(): Promise<void> {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      throw error;
    }
  },

  // Get redirect result (call this after page load to check for redirect result)
  async getRedirectResult(): Promise<UserCredential | null> {
    try {
      return await getRedirectResult(auth);
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
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
      photoURL: firebaseUser.photoURL,
      // Note: grade and school would need to be stored in Firestore for persistence
      // For now, we'll handle them in the component state
    };
  },
};

// Firebase Storage Service
export const storageService = {
  /**
   * Upload a file to Firebase Storage
   * @param file - The file to upload
   * @param path - The path in storage (e.g., 'uploads/images/example.jpg')
   * @returns The download URL of the uploaded file
   */
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const bucket = getSupabaseBucket();
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: '3600',
      });

      if (error) {
        // Provide more helpful error messages
        if (
          error.message?.includes('row-level security') ||
          error.statusCode === '403'
        ) {
          throw new Error(
            'Storage upload failed: RLS policy violation. Please configure Supabase Storage policies to allow public uploads. See SUPABASE_STORAGE_SETUP.md for instructions.'
          );
        }
        if (error.statusCode === '404') {
          throw new Error(
            `Storage bucket "${bucket}" not found. Please create the bucket in Supabase Dashboard.`
          );
        }
        throw error;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      if (!data?.publicUrl) {
        throw new Error(
          `No public URL returned. Make sure bucket "${bucket}" is Public in Supabase Storage (or switch to signed URLs).`
        );
      }
      return data.publicUrl;
    } catch (error) {
      throw error as any;
    }
  },

  /**
   * Upload a file with progress tracking
   * @param file - The file to upload
   * @param path - The path in storage
   * @param onProgress - Progress callback function
   * @returns A promise that resolves to the download URL
   */
  async uploadFileWithProgress(
    file: File,
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      // Supabase SDK does not expose upload progress; emit start/end
      if (onProgress) onProgress(10);
      const url = await this.uploadFile(file, path);
      if (onProgress) onProgress(100);
      return url;
    } catch (error) {
      throw error as any;
    }
  },

  /**
   * Get download URL for a file
   * @param path - The path in storage
   * @returns The download URL
   */
  async getDownloadURL(path: string): Promise<string> {
    try {
      const bucket = getSupabaseBucket();
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    } catch (error) {
      throw error as any;
    }
  },

  /**
   * Delete a file from Firebase Storage
   * @param path - The path in storage
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const bucket = getSupabaseBucket();
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
    } catch (error) {
      throw error as any;
    }
  },

  /**
   * Create a storage reference
   * @param path - The path in storage
   * @returns Storage reference
   */
  getStorageRef(path: string) {
    return path;
  },
};
