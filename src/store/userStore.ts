import { create } from 'zustand';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    gender?: 'male' | 'female' | 'other';
    isPremium: boolean;
    joinedDate: string;

}

interface UserState {
    user: User;
    updateProfile: (updates: Partial<User>) => void;
    logout: () => void;
}

const MOCK_USER: User = {
    id: 'currentUser',
    name: 'Muhammed',
    email: 'muhammed@example.com',
    isPremium: false,
    joinedDate: new Date().toISOString(),
};

export const useUserStore = create<UserState>((set) => ({
    user: MOCK_USER,

    updateProfile: (updates) =>
        set((state) => ({
            user: { ...state.user, ...updates },
        })),

    logout: () => {
        // In a real app, this would clear auth tokens, navigate to login, etc.
        console.log('User logged out');
    },
}));
