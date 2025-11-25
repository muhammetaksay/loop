import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Check, X, ArrowRightLeft, MessageCircle } from 'lucide-react-native';
import { useMarketplaceStore } from '../../store/marketplaceStore';
import { useUserStore } from '../../store/userStore';
import { useChatStore } from '../../store/chatStore';
import { auth } from '../../services/firebaseService';
import { useNavigation } from '@react-navigation/native';

export default function TradesScreen() {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
    const { tradeOffers, fetchOffers, respondToOffer, loading } = useMarketplaceStore();
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        fetchOffers();
    }, []);

    const onRefresh = async () => {
        await fetchOffers();
    };

    const currentUserId = auth.currentUser?.uid;

    console.log('TradesScreen - Current User ID:', currentUserId);
    console.log('TradesScreen - Trade Offers Count:', tradeOffers.length);

    const incomingOffers = tradeOffers.filter(
        (offer) => offer.toUserId === currentUserId
    );
    const outgoingOffers = tradeOffers.filter(
        (offer) => offer.fromUserId === currentUserId
    );

    const displayOffers = activeTab === 'incoming' ? incomingOffers : outgoingOffers;

    const renderOffer = ({ item }: { item: any }) => (
        <View className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <View className="flex-row p-4">
                {/* Their Item (or Your Item if outgoing) */}
                <View className="flex-1 items-center">
                    <Text className="mb-2 text-xs font-medium text-gray-500">
                        {activeTab === 'incoming' ? 'Teklif Eden' : 'Senin Teklifin'}
                    </Text>
                    <Image
                        source={{ uri: item.offeredItemImage }}
                        className="aspect-square w-20 rounded-lg bg-gray-100"
                        resizeMode="cover"
                    />
                    <Text className="mt-2 text-center text-xs font-medium text-gray-900" numberOfLines={1}>
                        {item.offeredItemCategory}
                    </Text>
                    {item.extraCash && item.extraCash > 0 && (
                        <View className="mt-1 rounded-full bg-green-100 px-2 py-0.5">
                            <Text className="text-[10px] font-bold text-green-700">
                                +{item.extraCash} TL
                            </Text>
                        </View>
                    )}
                </View>

                {/* Arrow */}
                <View className="mx-2 items-center justify-center">
                    <ArrowRightLeft color="#9CA3AF" size={20} />
                </View>

                {/* Your Item (or Their Item if outgoing) */}
                <View className="flex-1 items-center">
                    <Text className="mb-2 text-xs font-medium text-gray-500">
                        {activeTab === 'incoming' ? 'Senin Ürünün' : 'İstenen Ürün'}
                    </Text>
                    {/* Note: listing image might not be directly available in trade offer object depending on backend, 
                        assuming we might need to fetch it or it's populated. 
                        For now, using a placeholder if missing or relying on what's available. 
                        The current store/service structure might need 'listing' details populated.
                        Let's assume 'listing' is populated or we use a placeholder.
                    */}
                    <Image
                        source={{ uri: item.listing?.image || 'https://via.placeholder.com/150' }}
                        className="aspect-square w-20 rounded-lg bg-gray-100"
                        resizeMode="cover"
                    />
                    <Text className="mt-2 text-center text-xs font-medium text-gray-900" numberOfLines={1}>
                        {item.listing?.category || 'Ürün'}
                    </Text>
                </View>
            </View>

            {/* Status/Actions */}
            <View className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                {item.status === 'pending' && activeTab === 'incoming' ? (
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            onPress={() => respondToOffer(item.id, false)}
                            className="flex-1 items-center rounded-lg border border-red-200 bg-white py-2"
                        >
                            <View className="flex-row items-center gap-1">
                                <X color="#EF4444" size={16} />
                                <Text className="font-medium text-red-600">Reddet</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => respondToOffer(
                                item.id,
                                true,
                                item.listingId,
                                item.fromUserId,
                                item.fromUserName,
                                '' // Avatar placeholder
                            )}
                            className="flex-1 items-center rounded-lg bg-blue-600 py-2 shadow-sm"
                        >
                            <View className="flex-row items-center gap-1">
                                <Check color="white" size={16} />
                                <Text className="font-medium text-white">Kabul Et</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View
                        className={`flex-row items-center justify-center rounded-lg py-2 ${item.status === 'accepted'
                            ? 'bg-green-100'
                            : item.status === 'rejected'
                                ? 'bg-red-100'
                                : 'bg-yellow-100'
                            }`}
                    >
                        {item.status === 'accepted' && <Check color="#15803D" size={16} className="mr-2" />}
                        {item.status === 'rejected' && <X color="#B91C1C" size={16} className="mr-2" />}
                        <Text
                            className={`text-sm font-bold ${item.status === 'accepted'
                                ? 'text-green-800'
                                : item.status === 'rejected'
                                    ? 'text-red-800'
                                    : 'text-yellow-800'
                                }`}
                        >
                            {item.status === 'accepted'
                                ? 'Eşleşme Sağlandı! 🎉'
                                : item.status === 'rejected'
                                    ? 'Reddedildi'
                                    : 'Beklemede'}
                        </Text>
                    </View>
                )}

                {item.status === 'accepted' && (
                    <TouchableOpacity
                        onPress={async () => {
                            // Start chat or navigate to existing one
                            // We can use the chatStore to start/get chat
                            // But for simplicity, let's just navigate to ChatList or try to open specific chat
                            // Better: use startChat from chatStore
                            const { startChat } = useChatStore.getState();
                            const otherId = activeTab === 'incoming' ? item.fromUserId : item.toUserId;
                            const otherName = activeTab === 'incoming' ? item.fromUserName : 'User'; // We might need to fetch name for outgoing
                            // For outgoing, we don't store toUserName in TradeOffer? 
                            // We store toUserId.
                            // Let's assume for now we only support messaging from the one who accepted (incoming).
                            // Or we can just navigate to ChatList.

                            // Actually, if I accepted, I want to message the other person.
                            if (activeTab === 'incoming') {
                                try {
                                    const chatId = await startChat(item.fromUserId, item.fromUserName, '', item.listingId);
                                    navigation.navigate('Chat', { chatId, otherUserName: item.fromUserName });
                                } catch (e) {
                                    console.error(e);
                                }
                            } else {
                                // If I am the one who offered, and it's accepted, I want to message the owner.
                                // But I don't have owner's name/avatar easily here unless I fetch listing.
                                // Listing details are in item.listing (populated in store).
                                if (item.listing) {
                                    try {
                                        const chatId = await startChat(item.listing.userId, item.listing.userName, item.listing.userAvatar, item.listingId);
                                        navigation.navigate('Chat', { chatId, otherUserName: item.listing.userName });
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }
                            }
                        }}
                        className="mt-3 flex-row items-center justify-center rounded-lg bg-blue-600 py-2"
                    >
                        <MessageCircle color="white" size={16} />
                        <Text className="ml-2 font-medium text-white">Mesaj Gönder</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="flex-1">
                {/* Header */}
                <View className="mb-4 px-6 pt-4">
                    <Text className="text-3xl font-bold text-gray-900">Takaslar</Text>
                </View>

                {/* Tabs */}
                <View className="mb-4 flex-row gap-2 px-6">
                    <TouchableOpacity
                        onPress={() => setActiveTab('incoming')}
                        className={`flex-1 rounded-xl py-3 ${activeTab === 'incoming' ? 'bg-blue-600' : 'bg-gray-100'
                            }`}
                    >
                        <Text
                            className={`text-center font-medium ${activeTab === 'incoming' ? 'text-white' : 'text-gray-700'
                                }`}
                        >
                            Gelen ({incomingOffers.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('outgoing')}
                        className={`flex-1 rounded-xl py-3 ${activeTab === 'outgoing' ? 'bg-blue-600' : 'bg-gray-100'
                            }`}
                    >
                        <Text
                            className={`text-center font-medium ${activeTab === 'outgoing' ? 'text-white' : 'text-gray-700'
                                }`}
                        >
                            Giden ({outgoingOffers.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* List */}
                {displayOffers.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-6">
                        <Text className="text-6xl">📭</Text>
                        <Text className="mt-4 text-center text-xl font-bold text-gray-900">
                            {activeTab === 'incoming' ? 'Gelen teklif yok' : 'Giden teklif yok'}
                        </Text>
                        <Text className="mt-2 text-center text-gray-500">
                            {activeTab === 'incoming'
                                ? 'Biri seninle takas yapmak istediğinde teklifler burada görünecek.'
                                : 'Takas teklifi yapmak için pazar yerini keşfetmeye başla!'}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={displayOffers}
                        renderItem={renderOffer}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 24, paddingBottom: 80 }}
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

