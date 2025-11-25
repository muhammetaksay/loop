import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    limit,
} from 'firebase/firestore';
import { db, auth } from './firebaseService';

export interface Message {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    createdAt: Date;
}

export interface Chat {
    id: string;
    participants: string[]; // [userId1, userId2]
    participantNames: { [userId: string]: string }; // { userId1: "Name1", userId2: "Name2" }
    participantAvatars: { [userId: string]: string }; // { userId1: "url1", userId2: "url2" }
    lastMessage?: string;
    lastMessageTime?: Date;
    listingId?: string; // Optional: link to a specific item trade
}

/**
 * Create or get existing chat between two users
 */
export const createChat = async (
    otherUserId: string,
    otherUserName: string,
    otherUserAvatar: string,
    listingId?: string
): Promise<string> => {
    try {
        const currentUserId = auth.currentUser?.uid;
        const currentUserName = auth.currentUser?.displayName || 'User';
        // We don't have current user avatar easily available here without fetching profile, 
        // but let's assume we can update it later or pass it in. 
        // For now, let's use a placeholder or try to get it from auth if available (auth.currentUser.photoURL)
        const currentUserAvatar = auth.currentUser?.photoURL || '';

        if (!currentUserId) throw new Error('User not authenticated');

        // Check if chat already exists (simple check for direct DMs)
        // For trade-specific chats, we might want to allow multiple if they are about different items,
        // but usually one chat per pair is enough. Let's enforce one chat per pair for simplicity first.

        // Query for existing chat
        // Firestore array-contains is limited to one value. 
        // A common pattern is to store a combined ID "uid1_uid2" (sorted) to check existence.
        const sortedIds = [currentUserId, otherUserId].sort();
        const chatId = sortedIds.join('_');

        const chatDocRef = doc(db, 'chats', chatId);
        const chatDoc = await getDoc(chatDocRef);

        if (chatDoc.exists()) {
            return chatDoc.id;
        }

        // Create new chat
        const newChat: Chat = {
            id: chatId,
            participants: [currentUserId, otherUserId],
            participantNames: {
                [currentUserId]: currentUserName,
                [otherUserId]: otherUserName,
            },
            participantAvatars: {
                [currentUserId]: currentUserAvatar,
                [otherUserId]: otherUserAvatar,
            },
            createdAt: new Date(), // Add createdAt for sorting if needed
            listingId: listingId || null,
        } as any;

        await setDoc(chatDocRef, {
            ...newChat,
            createdAt: Timestamp.now(),
        });

        return chatId;
    } catch (error: any) {
        console.error('Create chat error:', error);
        throw new Error(error.message);
    }
};

/**
 * Send a message
 */
export const sendMessage = async (chatId: string, text: string): Promise<void> => {
    try {
        const currentUserId = auth.currentUser?.uid;
        const currentUserName = auth.currentUser?.displayName || 'User';

        if (!currentUserId) throw new Error('User not authenticated');

        const messagesRef = collection(db, 'chats', chatId, 'messages');

        await addDoc(messagesRef, {
            text,
            senderId: currentUserId,
            senderName: currentUserName,
            createdAt: Timestamp.now(),
        });

        // Update last message in chat doc
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
            lastMessage: text,
            lastMessageTime: Timestamp.now(),
        });

    } catch (error: any) {
        console.error('Send message error:', error);
        throw new Error(error.message);
    }
};

/**
 * Subscribe to user's chats
 */
export const subscribeToChats = (
    userId: string,
    onUpdate: (chats: Chat[]) => void
) => {
    const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const chats: Chat[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            chats.push({
                id: doc.id,
                ...data,
                lastMessageTime: data.lastMessageTime?.toDate(),
            } as Chat);
        });
        onUpdate(chats);
    });
};

/**
 * Subscribe to messages in a chat
 */
export const subscribeToMessages = (
    chatId: string,
    onUpdate: (messages: Message[]) => void
) => {
    const q = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(50)
    );

    return onSnapshot(q, (snapshot) => {
        const messages: Message[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
            } as Message);
        });
        onUpdate(messages);
    });
};
