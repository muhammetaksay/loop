import { create } from 'zustand';
import { auth } from '../services/firebaseService';
import {
    createTradeOffer,
    getMarketplaceListings,
    updateTradeOfferStatus,
    MarketplaceListing as ServiceMarketplaceListing,
    TradeOffer as ServiceTradeOffer,
    getIncomingOffers,
    getOutgoingOffers,
} from '../services/marketplaceService';

export interface MarketplaceListing extends ServiceMarketplaceListing {
    id: string;
}

export interface TradeOffer extends ServiceTradeOffer {
    id: string;
    listing?: MarketplaceListing; // Populated manually if needed
}

interface MarketplaceState {
    listings: MarketplaceListing[];
    tradeOffers: TradeOffer[];
    likedListings: string[];
    loading: boolean;
    fetchListings: () => Promise<void>;
    fetchOffers: () => Promise<void>;
    makeOffer: (listing: MarketplaceListing, offeredItem: any) => Promise<void>;
    respondToOffer: (
        offerId: string,
        accept: boolean,
        listingId?: string,
        otherUserId?: string,
        otherUserName?: string,
        otherUserAvatar?: string
    ) => Promise<void>;
    toggleLike: (listingId: string) => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
    listings: [],
    tradeOffers: [],
    likedListings: [],
    loading: false,

    fetchListings: async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        set({ loading: true });
        try {
            const listings = await getMarketplaceListings(userId);
            set({ listings: listings as MarketplaceListing[] });
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            set({ loading: false });
        }
    },

    fetchOffers: async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        set({ loading: true });
        try {
            const incoming = await getIncomingOffers(userId);
            const outgoing = await getOutgoingOffers(userId);
            const allOffers = [...incoming, ...outgoing];

            // Fetch listing details for each offer
            const offersWithDetails = await Promise.all(
                allOffers.map(async (offer) => {
                    try {
                        // We need to fetch the listing from 'wardrobe' collection since that's where items are
                        // But wait, getMarketplaceListings queries 'wardrobe'. 
                        // Let's assume we can fetch the document from 'wardrobe' using listingId (which is actually the item ID in this context?)
                        // Wait, in createListing we add to 'marketplace' collection? 
                        // No, getMarketplaceListings queries 'wardrobe'.
                        // Let's check createListing in marketplaceService.ts... 
                        // It adds to 'marketplace'. 
                        // BUT getMarketplaceListings queries 'wardrobe'. This is inconsistent.
                        // Let's look at getMarketplaceListings again.
                        // It queries 'wardrobe'.
                        // So listingId in TradeOffer likely refers to the document ID in 'wardrobe' (or 'marketplace'?).
                        // In makeOffer (store), we use listing.id. 
                        // If getMarketplaceListings returns docs from 'wardrobe', then listing.id is a wardrobe doc ID.
                        // So we should fetch from 'wardrobe'.

                        // To be safe and quick, let's try to fetch from 'wardrobe' first.
                        const { doc, getDoc } = require('firebase/firestore');
                        const { db } = require('../services/firebaseService');

                        const listingRef = doc(db, 'wardrobe', offer.listingId);
                        const listingSnap = await getDoc(listingRef);

                        if (listingSnap.exists()) {
                            const data = listingSnap.data();
                            return {
                                ...offer,
                                listing: {
                                    id: listingSnap.id,
                                    ...data,
                                    imageUrl: data.imageUrl || data.image, // Handle potential naming diff
                                } as MarketplaceListing
                            };
                        }
                        return offer;
                    } catch (e) {
                        console.log('Error fetching listing details for offer:', e);
                        return offer;
                    }
                })
            );

            set({ tradeOffers: offersWithDetails as TradeOffer[] });
        } catch (error) {
            console.error('Error fetching offers:', error);
        } finally {
            set({ loading: false });
        }
    },

    makeOffer: async (listing, offeredItem) => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        try {
            const offerData = {
                listingId: listing.id,
                fromUserId: userId,
                fromUserName: auth.currentUser?.displayName || 'User',
                toUserId: listing.userId,
                offeredItemId: offeredItem.id,
                offeredItemImage: offeredItem.imageUrl || offeredItem.image,
                offeredItemCategory: offeredItem.category,
                extraCash: offeredItem.extraCash,
            };

            const offerId = await createTradeOffer(offerData);

            // Refresh offers to show the new outgoing offer
            await get().fetchOffers();
        } catch (error) {
            console.error('Error making offer:', error);
            throw error;
        }
    },

    respondToOffer: async (offerId, accept, listingId, otherUserId, otherUserName, otherUserAvatar) => {
        try {
            await updateTradeOfferStatus(
                offerId,
                accept ? 'accepted' : 'rejected',
                listingId,
                otherUserId,
                otherUserName,
                otherUserAvatar
            );

            set((state) => ({
                tradeOffers: state.tradeOffers.map((offer) =>
                    offer.id === offerId
                        ? { ...offer, status: accept ? 'accepted' : 'rejected' }
                        : offer
                ),
            }));
        } catch (error) {
            console.error('Error responding to offer:', error);
        }
    },

    toggleLike: (listingId) => {
        set((state) => ({
            likedListings: state.likedListings.includes(listingId)
                ? state.likedListings.filter((id) => id !== listingId)
                : [...state.likedListings, listingId],
        }));
    },
}));

