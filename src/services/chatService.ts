import {
    collection,
    doc,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    updateDoc,
} from 'firebase/firestore';
import { db } from './firebaseService';

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    createdAt: Date;
    read: boolean;
}

export interface Conversation {
    id: string;
    participants: string[];
    participantNames: { [userId: string]: string };
    participantAvatars: { [userId: string]: string };
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: { [userId: string]: number };
}

/**
 * Create or get conversation between two users
 */
export const getOrCreateConversation = async (
    userId1: string,
    userId2: string,
    userName1: string,
    userName2: string,
    userAvatar1: string = '',
    userAvatar2: string = ''
): Promise<string> => {
    try {
        // Check if conversation already exists
        const q = query(
            collection(db, 'conversations'),
            where('participants', 'array-contains', userId1)
        );

        const querySnapshot = await getDocs(q);
        let conversationId: string | null = null;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.participants.includes(userId2)) {
                conversationId = doc.id;
            }
        });

        // If conversation exists, return its ID
        if (conversationId) {
            return conversationId;
        }

        // Create new conversation
        const docRef = await addDoc(collection(db, 'conversations'), {
            participants: [userId1, userId2],
            participantNames: {
                [userId1]: userName1,
                [userId2]: userName2,
            },
            participantAvatars: {
                [userId1]: userAvatar1,
                [userId2]: userAvatar2,
            },
            lastMessage: '',
            lastMessageTime: Timestamp.now(),
            unreadCount: {
                [userId1]: 0,
                [userId2]: 0,
            },
        });

        return docRef.id;
    } catch (error: any) {
        console.error('Get or create conversation error:', error);
        throw new Error(error.message);
    }
};

/**
 * Send message
 */
export const sendMessage = async (
    conversationId: string,
    senderId: string,
    receiverId: string,
    text: string
): Promise<void> => {
    try {
        // Add message to messages collection
        await addDoc(collection(db, 'messages'), {
            conversationId,
            senderId,
            text,
            createdAt: Timestamp.now(),
            read: false,
        });

        // Update conversation
        const conversationRef = doc(db, 'conversations', conversationId);
        await updateDoc(conversationRef, {
            lastMessage: text,
            lastMessageTime: Timestamp.now(),
            [`unreadCount.${receiverId}`]: (await getDocs(query(
                collection(db, 'messages'),
                where('conversationId', '==', conversationId),
                where('senderId', '==', senderId),
                where('read', '==', false)
            ))).size + 1,
        });
    } catch (error: any) {
        console.error('Send message error:', error);
        throw new Error(error.message);
    }
};

/**
 * Get user's conversations
 */
export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
    try {
        const q = query(
            collection(db, 'conversations'),
            where('participants', 'array-contains', userId),
            orderBy('lastMessageTime', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const conversations: Conversation[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            conversations.push({
                id: doc.id,
                ...data,
                lastMessageTime: data.lastMessageTime.toDate(),
            } as Conversation);
        });

        return conversations;
    } catch (error: any) {
        console.error('Get user conversations error:', error);
        throw new Error(error.message);
    }
};

/**
 * Get messages for a conversation
 */
export const getConversationMessages = async (
    conversationId: string
): Promise<Message[]> => {
    try {
        const q = query(
            collection(db, 'messages'),
            where('conversationId', '==', conversationId),
            orderBy('createdAt', 'asc')
        );

        const querySnapshot = await getDocs(q);
        const messages: Message[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
            } as Message);
        });

        return messages;
    } catch (error: any) {
        console.error('Get conversation messages error:', error);
        throw new Error(error.message);
    }
};

/**
 * Subscribe to real-time messages
 */
export const subscribeToMessages = (
    conversationId: string,
    callback: (messages: Message[]) => void
) => {
    const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
        const messages: Message[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
            } as Message);
        });
        callback(messages);
    });
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (
    conversationId: string,
    userId: string
): Promise<void> => {
    try {
        const q = query(
            collection(db, 'messages'),
            where('conversationId', '==', conversationId),
            where('senderId', '!=', userId),
            where('read', '==', false)
        );

        const querySnapshot = await getDocs(q);
        const updatePromises = querySnapshot.docs.map((doc) =>
            updateDoc(doc.ref, { read: true })
        );

        await Promise.all(updatePromises);

        // Reset unread count
        const conversationRef = doc(db, 'conversations', conversationId);
        await updateDoc(conversationRef, {
            [`unreadCount.${userId}`]: 0,
        });
    } catch (error: any) {
        console.error('Mark messages as read error:', error);
        throw new Error(error.message);
    }
};
