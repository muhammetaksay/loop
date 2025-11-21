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
    respondToOffer: (offerId: string, accept: boolean) => Promise<void>;
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
            set({ tradeOffers: [...incoming, ...outgoing] as TradeOffer[] });
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
            };

            const offerId = await createTradeOffer(offerData);

            // Optimistic update or re-fetch could be done here
            // For now, we just log
            console.log('Offer created with ID:', offerId);
        } catch (error) {
            console.error('Error making offer:', error);
            throw error;
        }
    },

    respondToOffer: async (offerId, accept) => {
        try {
            await updateTradeOfferStatus(offerId, accept ? 'accepted' : 'rejected');

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

