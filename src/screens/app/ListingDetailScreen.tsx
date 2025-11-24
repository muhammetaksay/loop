import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Modal,
    FlatList,
    Alert,
    TextInput,
} from 'react-native';
import { ArrowLeft, MapPin, User, X } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import Button from '../../components/Button';
import { useMarketplaceStore } from '../../store/marketplaceStore';
import { useWardrobeStore } from '../../store/wardrobeStore';

export default function ListingDetailScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { listing } = route.params || {};
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const makeOffer = useMarketplaceStore((state) => state.makeOffer);
    const { items: myItems, fetchItems } = useWardrobeStore();

    useEffect(() => {
        if (myItems.length === 0) {
            fetchItems();
        }
    }, []);

    const handleMakeOffer = async () => {
        if (selectedItem) {
            try {
                await makeOffer(listing, selectedItem);
                setShowOfferModal(false);
                Alert.alert('Başarılı', 'Takas teklifiniz gönderildi!', [
                    { text: 'Tamam', onPress: () => navigation.navigate('Trades') }
                ]);
            } catch (error) {
                Alert.alert('Hata', 'Teklif gönderilemedi. Lütfen tekrar deneyin.');
            }
        }
    };

    if (!listing) return null;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-3">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="rounded-full bg-gray-100 p-2"
                    >
                        <ArrowLeft color="#374151" size={24} />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-gray-900">Ürün Detayı</Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1">
                    {/* Image */}
                    <View className="aspect-[3/4] w-full bg-gray-50">
                        <Image
                            source={{ uri: listing.image }}
                            className="h-full w-full"
                            resizeMode="cover"
                        />
                    </View>

                    {/* Details */}
                    <View className="px-6 py-6">
                        <View className="mb-6 flex-row items-start justify-between">
                            <View>
                                <Text className="text-2xl font-bold text-gray-900">
                                    {listing.category}
                                </Text>
                                {listing.color && (
                                    <Text className="text-gray-500">{listing.color}</Text>
                                )}
                            </View>
                            {listing.size && (
                                <View className="rounded-full bg-blue-50 px-3 py-1">
                                    <Text className="text-xs font-medium text-blue-600">
                                        Beden {listing.size}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View className="mb-8 space-y-4">
                            <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
                                <Text className="text-gray-500">Sahibi</Text>
                                <View className="flex-row items-center gap-2">
                                    <User color="#6B7280" size={16} />
                                    <Text className="font-medium text-gray-900">
                                        {listing.ownerName || 'Kullanıcı'}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
                                <Text className="text-gray-500">Konum</Text>
                                <View className="flex-row items-center gap-2">
                                    <MapPin color="#6B7280" size={16} />
                                    <Text className="font-medium text-gray-900">
                                        {listing.location || 'Belirtilmemiş'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <Button title="Takas Teklifi Yap" onPress={() => setShowOfferModal(true)} />
                    </View>
                </ScrollView>
            </View>

            {/* Offer Modal */}
            <Modal
                visible={showOfferModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowOfferModal(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="max-h-[80%] rounded-t-3xl bg-white">
                        <View className="flex-row items-center justify-between border-b border-gray-100 px-6 py-4">
                            <Text className="text-lg font-bold text-gray-900">
                                Teklif Edilecek Ürünü Seç
                            </Text>
                            <TouchableOpacity onPress={() => setShowOfferModal(false)}>
                                <X color="#374151" size={24} />
                            </TouchableOpacity>
                        </View>

                        {myItems.length === 0 ? (
                            <View className="p-8 items-center">
                                <Text className="text-center text-gray-500 mb-4">
                                    Gardırobunuzda ürün bulunmuyor. Önce ürün eklemelisiniz.
                                </Text>
                                <Button
                                    title="Ürün Ekle"
                                    onPress={() => {
                                        setShowOfferModal(false);
                                        navigation.navigate('AddItem');
                                    }}
                                />
                            </View>
                        ) : (
                            <FlatList
                                data={myItems}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                                contentContainerStyle={{ padding: 16 }}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => setSelectedItem(item)}
                                        className={`mb-4 w-[48%] overflow-hidden rounded-xl border-2 ${selectedItem?.id === item.id
                                            ? 'border-blue-600'
                                            : 'border-gray-200'
                                            }`}
                                    >
                                        <Image
                                            source={{ uri: item.imageUrl }}
                                            className="aspect-[3/4] w-full"
                                            resizeMode="cover"
                                        />
                                        <View className="p-2">
                                            <Text className="text-sm font-medium text-gray-900">
                                                {item.category}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        )}

                        <View className="border-t border-gray-100 px-6 py-4">
                            <View className="mb-4">
                                <Text className="mb-1 text-sm font-medium text-gray-700">
                                    Ekstra Ücret (Opsiyonel)
                                </Text>
                                <TextInput
                                    placeholder="0 TL"
                                    keyboardType="numeric"
                                    className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                                    onChangeText={(text) => {
                                        if (selectedItem) {
                                            setSelectedItem({ ...selectedItem, extraCash: parseFloat(text) || 0 });
                                        }
                                    }}
                                />
                            </View>
                            <Button
                                title="Teklifi Gönder"
                                onPress={handleMakeOffer}
                                disabled={!selectedItem}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

