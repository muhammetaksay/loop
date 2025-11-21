import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebaseService';

export interface WardrobeItem {
    id: string;
    userId: string;
    imageUrl: string;
    category: string;
    color: string;
    season?: string;
    brand?: string;
    notes?: string;
    createdAt: Date;
}

/**
 * Upload image to Firebase Storage
 */
export const uploadImage = async (uri: string, userId: string): Promise<string> => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();

        const filename = `${userId}/${Date.now()}.jpg`;
        const storageRef = ref(storage, `wardrobe/${filename}`);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error: any) {
        console.error('Upload image error:', error);
        throw new Error(error.message);
    }
};

/**
 * Add item to wardrobe
 */
export const addWardrobeItem = async (
    userId: string,
    item: Omit<WardrobeItem, 'id' | 'userId' | 'createdAt'>
): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'wardrobe'), {
            ...item,
            userId,
            createdAt: Timestamp.now(),
        });

        return docRef.id;
    } catch (error: any) {
        console.error('Add wardrobe item error:', error);
        throw new Error(error.message);
    }
};

/**
 * Get user's wardrobe items
 */
export const getUserWardrobe = async (userId: string): Promise<WardrobeItem[]> => {
    try {
        const q = query(
            collection(db, 'wardrobe'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const items: WardrobeItem[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            items.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
            } as WardrobeItem);
        });

        return items;
    } catch (error: any) {
        console.error('Get user wardrobe error:', error);
        throw new Error(error.message);
    }
};

/**
 * Update wardrobe item
 */
export const updateWardrobeItem = async (
    itemId: string,
    updates: Partial<WardrobeItem>
): Promise<void> => {
    try {
        const docRef = doc(db, 'wardrobe', itemId);
        await updateDoc(docRef, updates);
    } catch (error: any) {
        console.error('Update wardrobe item error:', error);
        throw new Error(error.message);
    }
};

/**
 * Delete wardrobe item
 */
export const deleteWardrobeItem = async (itemId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, 'wardrobe', itemId));
    } catch (error: any) {
        console.error('Delete wardrobe item error:', error);
        throw new Error(error.message);
    }
};
