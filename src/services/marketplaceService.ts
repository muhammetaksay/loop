import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    onSnapshot,
} from 'firebase/firestore';
import { db } from './firebaseService';

export interface MarketplaceListing {
    id: string;
    itemId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    imageUrl: string;
    category: string;
    color: string;
    brand?: string;
    size?: string;
    condition: string;
    description: string;
    location: string;
    createdAt: Date;
}

export interface TradeOffer {
    id: string;
    listingId: string;
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    offeredItemId: string;
    offeredItemImage: string;
    offeredItemCategory: string;
    extraCash?: number;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
}

/**
 * Create marketplace listing
 */
export const createListing = async (
    listing: Omit<MarketplaceListing, 'id' | 'createdAt'>
): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'marketplace'), {
            ...listing,
            createdAt: Timestamp.now(),
        });

        return docRef.id;
    } catch (error: any) {
        console.error('Create listing error:', error);
        throw new Error(error.message);
    }
};

/**
 * Get marketplace listings (excluding user's own)
 */
export const getMarketplaceListings = async (
    userId: string,
    limitCount: number = 20
): Promise<MarketplaceListing[]> => {
    try {
        const q = query(
            collection(db, 'wardrobe'), // Query from wardrobe collection instead of marketplace
            where('userId', '!=', userId),
            where('isTradeable', '==', true),
            orderBy('userId'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const listings: MarketplaceListing[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            listings.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
            } as MarketplaceListing);
        });

        return listings;
    } catch (error: any) {
        console.error('Get marketplace listings error:', error);
        throw new Error(error.message);
    }
};

/**
 * Create trade offer
 */
export const createTradeOffer = async (
    offer: Omit<TradeOffer, 'id' | 'createdAt' | 'status'>
): Promise<string> => {
    try {
        // Check for duplicate offer
        const q = query(
            collection(db, 'tradeOffers'),
            where('listingId', '==', offer.listingId),
            where('fromUserId', '==', offer.fromUserId),
            where('status', '==', 'pending') // Only check pending offers
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            throw new Error('Bu ürüne zaten bekleyen bir teklifiniz var.');
        }

        console.log('Creating trade offer with data:', JSON.stringify(offer, null, 2));
        const docRef = await addDoc(collection(db, 'tradeOffers'), {
            ...offer,
            status: 'pending',
            createdAt: Timestamp.now(),
        });
        console.log('Trade offer created with ID:', docRef.id);
        return docRef.id;
    } catch (error: any) {
        console.error('Create trade offer error:', error);
        throw new Error(error.message);
    }
};

/**
 * Get incoming trade offers
 */
export const getIncomingOffers = async (userId: string): Promise<TradeOffer[]> => {
    try {
        console.log('Fetching incoming offers for user:', userId);
        const q = query(
            collection(db, 'tradeOffers'),
            where('toUserId', '==', userId)
            // orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        console.log('Incoming offers count:', querySnapshot.size);

        const offers: TradeOffer[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            offers.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
            } as TradeOffer);
        });

        return offers;
    } catch (error: any) {
        console.error('Get incoming offers error:', error);
        throw new Error(error.message);
    }
};

/**
 * Get outgoing trade offers
 */
export const getOutgoingOffers = async (userId: string): Promise<TradeOffer[]> => {
    try {
        console.log('Fetching outgoing offers for user:', userId);
        const q = query(
            collection(db, 'tradeOffers'),
            where('fromUserId', '==', userId)
            // orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        console.log('Outgoing offers count:', querySnapshot.size);

        const offers: TradeOffer[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            offers.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
            } as TradeOffer);
        });

        return offers;
    } catch (error: any) {
        console.error('Get outgoing offers error:', error);
        throw new Error(error.message);
    }
};

/**
 * Update trade offer status
 */
export const updateTradeOfferStatus = async (
    offerId: string,
    status: 'accepted' | 'rejected',
    listingId?: string, // Required for acceptance
    otherUserId?: string, // Required for chat creation
    otherUserName?: string, // Required for chat creation
    otherUserAvatar?: string // Required for chat creation
): Promise<void> => {
    try {
        const docRef = doc(db, 'tradeOffers', offerId);
        await updateDoc(docRef, { status });

        if (status === 'accepted' && listingId) {
            // 1. Mark item as not tradeable (remove from marketplace)
            const itemRef = doc(db, 'wardrobe', listingId);
            await updateDoc(itemRef, { isTradeable: false });

            // 2. Create chat between users
            if (otherUserId && otherUserName) {
                const { createChat } = require('./chatService'); // Lazy import to avoid circular dependency if any
                await createChat(otherUserId, otherUserName, otherUserAvatar || '', listingId);
            }

            // 3. Reject all other pending offers for this item (Optional but recommended)
            const q = query(
                collection(db, 'tradeOffers'),
                where('listingId', '==', listingId),
                where('status', '==', 'pending'),
                where('id', '!=', offerId) // Exclude current offer (though it's already accepted)
            );

            const pendingSnapshot = await getDocs(q);
            pendingSnapshot.forEach(async (docSnap) => {
                if (docSnap.id !== offerId) {
                    await updateDoc(doc(db, 'tradeOffers', docSnap.id), { status: 'rejected' });
                }
            });
        }
    } catch (error: any) {
        console.error('Update trade offer status error:', error);
        throw new Error(error.message);
    }
};
