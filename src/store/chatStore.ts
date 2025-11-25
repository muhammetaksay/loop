import { create } from 'zustand';
import { Chat, Message, subscribeToChats, subscribeToMessages, sendMessage, createChat } from '../services/chatService';
import { auth } from '../services/firebaseService';

interface ChatState {
    chats: Chat[];
    currentMessages: Message[];
    loading: boolean;
    activeChatId: string | null;

    // Subscriptions
    unsubscribeChats: (() => void) | null;
    unsubscribeMessages: (() => void) | null;

    // Actions
    initChatSubscription: () => void;
    openChat: (chatId: string) => void;
    closeChat: () => void;
    sendChatMessage: (text: string) => Promise<void>;
    startChat: (otherUserId: string, otherUserName: string, otherUserAvatar: string, listingId?: string) => Promise<string>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    chats: [],
    currentMessages: [],
    loading: false,
    activeChatId: null,
    unsubscribeChats: null,
    unsubscribeMessages: null,

    initChatSubscription: () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        // Unsubscribe previous if exists
        if (get().unsubscribeChats) {
            get().unsubscribeChats!();
        }

        set({ loading: true });
        const unsub = subscribeToChats(userId, (chats) => {
            set({ chats, loading: false });
        });

        set({ unsubscribeChats: unsub });
    },

    openChat: (chatId: string) => {
        // Unsubscribe previous messages if exists
        if (get().unsubscribeMessages) {
            get().unsubscribeMessages!();
        }

        set({ activeChatId: chatId, currentMessages: [] });

        const unsub = subscribeToMessages(chatId, (messages) => {
            set({ currentMessages: messages.reverse() }); // Reverse for Chat UI usually
        });

        set({ unsubscribeMessages: unsub });
    },

    closeChat: () => {
        if (get().unsubscribeMessages) {
            get().unsubscribeMessages!();
        }
        set({ activeChatId: null, currentMessages: [], unsubscribeMessages: null });
    },

    sendChatMessage: async (text: string) => {
        const chatId = get().activeChatId;
        if (!chatId) return;

        try {
            await sendMessage(chatId, text);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    },

    startChat: async (otherUserId, otherUserName, otherUserAvatar, listingId) => {
        try {
            const chatId = await createChat(otherUserId, otherUserName, otherUserAvatar, listingId);
            return chatId;
        } catch (error) {
            console.error('Error starting chat:', error);
            throw error;
        }
    }
}));
