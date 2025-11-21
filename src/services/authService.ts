import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseService';

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    isPremium: boolean;
    gender?: 'male' | 'female' | 'other';
    createdAt: Date;

    // Onboarding data
    bodySize?: {
        height?: string;
        weight?: string;
        size?: string;
    };
    stylePreferences?: string[];
    colorPreferences?: string[];
}

/**
 * Register a new user with email and password
 */
export const registerUser = async (
    email: string,
    password: string,
    name: string
): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update display name
        await updateProfile(user, { displayName: name });

        // Create user profile in Firestore
        const userProfile: UserProfile = {
            uid: user.uid,
            email: user.email!,
            name,
            isPremium: false,
            createdAt: new Date(),
        };

        await setDoc(doc(db, 'users', user.uid), userProfile);

        return user;
    } catch (error: any) {
        console.error('Registration error:', error);
        throw new Error(error.message);
    }
};

/**
 * Sign in with email and password
 */
export const loginUser = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        console.error('Login error:', error);
        throw new Error(error.message);
    }
};

/**
 * Sign out current user
 */
export const logoutUser = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error: any) {
        console.error('Logout error:', error);
        throw new Error(error.message);
    }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error: any) {
        console.error('Get user profile error:', error);
        throw new Error(error.message);
    }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (
    uid: string,
    data: Partial<UserProfile>
): Promise<void> => {
    try {
        const docRef = doc(db, 'users', uid);
        await setDoc(docRef, data, { merge: true });
    } catch (error: any) {
        console.error('Update user profile error:', error);
        throw new Error(error.message);
    }
};

/**
 * Save onboarding data
 */
export const saveOnboardingData = async (
    uid: string,
    data: {
        gender?: 'male' | 'female' | 'other';
        bodySize?: UserProfile['bodySize'];
        stylePreferences?: string[];
        colorPreferences?: string[];
    }

): Promise<void> => {
    try {
        await updateUserProfile(uid, data);
    } catch (error: any) {
        console.error('Save onboarding data error:', error);
        throw new Error(error.message);
    }
};
