import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Heart, X, Repeat, Filter } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  PanResponder,
  ActivityIndicator,
  Modal,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';

import { useMarketplaceStore } from '../../store/marketplaceStore';
import { useWardrobeStore } from '../../store/wardrobeStore';
import Button from '../../components/Button';

const { width, height } = Dimensions.get('window');

export default function MarketplaceScreen() {
  const navigation = useNavigation<any>();
  const { listings, fetchListings, loading, toggleLike, makeOffer } = useMarketplaceStore();
  const { items: myItems, fetchItems: fetchWardrobe } = useWardrobeStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedMyItem, setSelectedMyItem] = useState<any>(null);

  const position = new Animated.ValueXY();

  React.useEffect(() => {
    fetchListings();
    fetchWardrobe();
  }, []);

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const rotateAndTranslate = {
    transform: [
      {
        rotate: rotate,
      },
      ...position.getTranslateTransform(),
    ],
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy });
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 120) {
        Animated.spring(position, {
          toValue: { x: width + 100, y: gestureState.dy },
          useNativeDriver: true,
        }).start(() => {
          handleLike();
        });
      } else if (gestureState.dx < -120) {
        Animated.spring(position, {
          toValue: { x: -width - 100, y: gestureState.dy },
          useNativeDriver: true,
        }).start(() => {
          handleNope();
        });
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 4,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const handleLike = () => {
    // Open offer modal instead of just liking
    setShowOfferModal(true);

    // We don't advance index yet, wait for offer or cancel
    position.setValue({ x: 0, y: 0 });
  };

  const handleNope = () => {
    setCurrentIndex((prev) => prev + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const submitOffer = async () => {
    if (!selectedMyItem) {
      Alert.alert('Hata', 'Lütfen takas etmek istediğiniz ürünü seçin');
      return;
    }

    const targetItem = listings[currentIndex];
    try {
      await makeOffer(targetItem, selectedMyItem);
      setShowOfferModal(false);
      setSelectedMyItem(null);
      Alert.alert('Başarılı', 'Takas teklifiniz gönderildi!');

      // Move to next card after successful offer
      setCurrentIndex((prev) => prev + 1);
      position.setValue({ x: 0, y: 0 });
    } catch (error) {
      Alert.alert('Hata', 'Teklif gönderilemedi');
    }
  };

  const renderCard = (item: any, isFirst: boolean) => {
    return (
      <Animated.View
        {...(isFirst ? panResponder.panHandlers : {})}
        key={item.id}
        style={[
          isFirst ? rotateAndTranslate : {},
          {
            height: height * 0.6,
            width: width - 32,
            padding: 10,
            position: 'absolute',
            top: 0,
            zIndex: isFirst ? 1 : 0,
          },
        ]}
      >
        <View className="flex-1 overflow-hidden rounded-3xl bg-white shadow-xl">
          <Image
            source={{ uri: item.imageUrl || item.image }}
            className="h-3/4 w-full bg-gray-100"
            resizeMode="cover"
          />

          <View className="flex-1 justify-between p-5">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                {item.category}
              </Text>
              <Text className="text-lg text-gray-500">
                {item.size ? `${item.size} • ` : ''}{item.brand || 'Markasız'}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                {item.userAvatar ? (
                  <Image
                    source={{ uri: item.userAvatar }}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Text className="font-bold text-blue-600">
                      {item.userName?.charAt(0) || 'U'}
                    </Text>
                  </View>
                )}
                <View>
                  <Text className="font-bold text-gray-900">{item.userName || 'Kullanıcı'}</Text>
                  <Text className="text-xs text-gray-500">{item.location || 'Konum Yok'}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('ListingDetail', { item })}
                className="rounded-full bg-gray-100 px-4 py-2"
              >
                <Text className="font-bold text-gray-900">Detaylar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {isFirst && (
            <>
              <Animated.View
                style={{
                  opacity: likeOpacity,
                  transform: [{ rotate: '-30deg' }],
                  position: 'absolute',
                  top: 50,
                  left: 40,
                  zIndex: 1000,
                }}
              >
                <Text className="rounded-xl border-4 border-green-500 px-4 py-2 text-4xl font-extrabold text-green-500">
                  TEKLİF
                </Text>
              </Animated.View>

              <Animated.View
                style={{
                  opacity: nopeOpacity,
                  transform: [{ rotate: '30deg' }],
                  position: 'absolute',
                  top: 50,
                  right: 40,
                  zIndex: 1000,
                }}
              >
                <Text className="rounded-xl border-4 border-red-500 px-4 py-2 text-4xl font-extrabold text-red-500">
                  GEÇ
                </Text>
              </Animated.View>
            </>
          )}
        </View>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 items-center pt-4">
        {/* Header */}
        <View className="mb-4 w-full flex-row items-center justify-between px-6">
          <Text className="text-3xl font-bold text-gray-900">Keşfet</Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => navigation.navigate('Trades')}
              className="rounded-full bg-gray-100 p-2"
            >
              <Repeat color="#374151" size={24} />
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full bg-gray-100 p-2">
              <Filter color="#374151" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cards */}
        <View className="flex-1 w-full items-center" style={{ marginBottom: 100 }}>
          {listings.length > 0 ? (
            listings
              .map((item, index) => {
                if (index < currentIndex) return null;
                if (index > currentIndex + 1) return null;
                return renderCard(item, index === currentIndex);
              })
              .reverse()
          ) : (
            <View className="items-center justify-center p-10">
              <Text className="text-center text-xl text-gray-500">
                Henüz ürün yok.
              </Text>
            </View>
          )}

          {currentIndex >= listings.length && listings.length > 0 && (
            <View className="items-center justify-center p-10">
              <Text className="text-center text-xl text-gray-500">
                Şimdilik başka ürün yok!
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setCurrentIndex(0);
                  fetchListings();
                }}
                className="mt-4 rounded-full bg-blue-600 px-6 py-3"
              >
                <Text className="font-bold text-white">Yenile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom Actions */}
        {currentIndex < listings.length && (
          <View className="absolute bottom-6 w-full flex-row justify-evenly pb-4">
            <TouchableOpacity
              onPress={handleNope}
              className="h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg"
            >
              <X color="#EF4444" size={32} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLike}
              className="h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg"
            >
              <Heart color="white" size={32} fill="white" />
            </TouchableOpacity>
          </View>
        )}

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
                    Gardırobunuzda ürün bulunmuyor.
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
                      onPress={() => setSelectedMyItem({ ...item, extraCash: 0 })}
                      className={`mb-4 w-[48%] overflow-hidden rounded-xl border-2 ${selectedMyItem?.id === item.id
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

              {selectedMyItem && (
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
                        setSelectedMyItem({ ...selectedMyItem, extraCash: parseFloat(text) || 0 });
                      }}
                    />
                  </View>
                  <Button
                    title="Teklifi Gönder"
                    onPress={submitOffer}
                  />
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
