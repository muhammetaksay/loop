import { create } from 'zustand';
import {
    getUserConversations,
    getConversationMessages,
    sendMessage as sendChatMessage,
    subscribeToMessages
} from '../services/chatService';
import { auth } from '../services/firebaseService';

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: any; // Firestore Timestamp or Date
}

export interface Conversation {
    id: string;
    userId: string; // The OTHER user's ID
    userName: string;
    userAvatar?: string;
    lastMessage: string;
    lastMessageTime: any;
    unread: number;
    participants: string[];
}

interface ChatState {
    conversations: Conversation[];
    messages: Record<string, Message[]>;
    loading: boolean;
    fetchConversations: () => Promise<void>;
    fetchMessages: (conversationId: string) => Promise<void>;
    sendMessage: (conversationId: string, text: string, recipientId: string) => Promise<void>;
    subscribeToConversation: (conversationId: string) => () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    messages: {},
    loading: false,

    fetchConversations: async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        set({ loading: true });
        try {
            const conversations = await getUserConversations(userId);
            // Map service conversations to store format if needed, 
            // but assuming they match or we adapt here.
            // The service returns a list of conversations. 
            // We need to ensure the structure matches.
            set({ conversations: conversations as any[] });
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            set({ loading: false });
        }
    },

    fetchMessages: async (conversationId: string) => {
        set({ loading: true });
        try {
            const messages = await getConversationMessages(conversationId);
            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: messages as any[],
                },
            }));
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            set({ loading: false });
        }
    },

    sendMessage: async (conversationId: string, text: string, recipientId: string) => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        try {
            await sendChatMessage(conversationId, userId, recipientId, text);
            // Optimistic update could be done here, but subscription handles it usually.
            // For now, we'll just let the subscription or re-fetch handle it.
            // But to be safe/fast:
            const newMessage: Message = {
                id: Math.random().toString(36).substr(2, 9), // Temp ID
                conversationId,
                senderId: userId,
                senderName: auth.currentUser?.displayName || 'User',
                text,
                timestamp: new Date(),
            };

            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: [...(state.messages[conversationId] || []), newMessage],
                },
            }));
        } catch (error) {
            console.error('Error sending message:', error);
        }
    },

    subscribeToConversation: (conversationId: string) => {
        const unsubscribe = subscribeToMessages(conversationId, (messages) => {
            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: messages as any[],
                },
            }));
        });
        return unsubscribe;
    },
}));
