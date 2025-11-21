import { create } from 'zustand';
import { auth } from '../services/firebaseService';
import {
  addWardrobeItem,
  deleteWardrobeItem,
  getUserWardrobe,
  uploadImage,
  WardrobeItem as ServiceWardrobeItem,
} from '../services/wardrobeService';


export interface WardrobeItem extends ServiceWardrobeItem {
  id: string;
}

interface WardrobeState {
  items: WardrobeItem[];
  loading: boolean;
  fetchItems: () => Promise<void>;
  addItem: (
    item: Omit<WardrobeItem, 'id' | 'dateAdded' | 'userId' | 'imageUrl' | 'createdAt'>,
    imageUri: string
  ) => Promise<{ success: boolean; message?: string }>;

  removeItem: (id: string) => Promise<void>;
}

const FREE_TIER_LIMIT = 20;

export const useWardrobeStore = create<WardrobeState>((set, get) => ({
  items: [],
  loading: false,

  fetchItems: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    set({ loading: true });
    try {
      const items = await getUserWardrobe(userId);
      set({ items: items as WardrobeItem[] });
    } catch (error) {
      console.error('Error fetching wardrobe:', error);
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (item, imageUri) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return { success: false, message: 'User not logged in' };

    const currentItems = get().items;
    if (currentItems.length >= FREE_TIER_LIMIT) {
      return {
        success: false,
        message:
          'Ücretsiz limit olan 20 ürüne ulaştınız. Sınırsız ürün için Premium\'a geçin!',
      };
    }

    set({ loading: true });
    try {
      // 1. Upload image
      const imageUrl = await uploadImage(imageUri, userId);

      // 2. Add item to Firestore
      const itemData = { ...item, imageUrl };
      const itemId = await addWardrobeItem(userId, itemData);

      // 3. Update local state
      const newItem: WardrobeItem = {
        id: itemId,
        userId,
        ...itemData,
        createdAt: new Date(),
      };

      set((state) => ({
        items: [newItem, ...state.items],
      }));
      return { success: true, message: 'Ürün başarıyla eklendi' };
    } catch (error: any) {

      console.error('Error adding item:', error);
      return { success: false, message: error.message || 'Ürün eklenemedi' };
    } finally {
      set({ loading: false });
    }
  },

  removeItem: async (id) => {
    try {
      await deleteWardrobeItem(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },
}));

