import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Switch,
} from 'react-native';

import { useWardrobeStore } from '../../store/wardrobeStore';

import Button from '../../components/Button';

export default function ItemDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { item } = route.params || {};
  const { removeItem, updateItem } = useWardrobeStore();

  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Form state
  const [category, setCategory] = React.useState(item?.category || '');
  const [color, setColor] = React.useState(item?.color || '');
  const [brand, setBrand] = React.useState(item?.brand || '');
  const [isTradeable, setIsTradeable] = React.useState(item?.isTradeable || false);
  const [tradePrice, setTradePrice] = React.useState(item?.tradePrice?.toString() || '');
  const [tradeWants, setTradeWants] = React.useState(item?.tradeWants || '');

  // Mock data if no item passed (for development)
  const displayItem = item || {
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'T-Shirt',
    color: 'Black',
    brand: 'Unknown',
  };

  const handleDelete = () => {
    Alert.alert(
      'Ürünü Sil',
      'Bu ürünü gardırobunuzdan silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await removeItem(item.id);
            setLoading(false);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    const updates: any = {
      category,
      color,
      brand,
      isTradeable,
      tradeWants,
    };

    if (tradePrice) {
      updates.tradePrice = parseFloat(tradePrice);
    }

    const result = await updateItem(item.id, updates);
    setLoading(false);

    if (result.success) {
      setIsEditing(false);
      Alert.alert('Başarılı', 'Ürün güncellendi');
    } else {
      Alert.alert('Hata', result.message || 'Güncelleme başarısız');
    }
  };

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
          <Text className="text-lg font-bold text-gray-900">
            {isEditing ? 'Ürünü Düzenle' : 'Ürün Detayı'}
          </Text>
          <TouchableOpacity
            className={`rounded-full p-2 ${isEditing ? 'bg-blue-100' : 'bg-gray-100'}`}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Edit2 color={isEditing ? '#2563EB' : '#374151'} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          {/* Image */}
          <View className="aspect-[3/4] w-full bg-gray-50">
            <Image
              source={{ uri: displayItem.imageUrl || displayItem.image }}
              className="h-full w-full"
              resizeMode="cover"
            />
            {isEditing && (
              <View className="absolute inset-0 items-center justify-center bg-black/30">
                <Text className="font-medium text-white">Fotoğrafı Değiştir (Yakında)</Text>
              </View>
            )}
          </View>

          {/* Details */}
          <View className="px-6 py-6">
            {isEditing ? (
              <View className="space-y-4">
                <View>
                  <Text className="mb-1 text-sm font-medium text-gray-700">Kategori</Text>
                  <TextInput
                    value={category}
                    onChangeText={setCategory}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                    placeholder="Örn: T-Shirt"
                  />
                </View>
                <View>
                  <Text className="mb-1 text-sm font-medium text-gray-700">Renk</Text>
                  <TextInput
                    value={color}
                    onChangeText={setColor}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                    placeholder="Örn: Siyah"
                  />
                </View>
                <View>
                  <Text className="mb-1 text-sm font-medium text-gray-700">Marka</Text>
                  <TextInput
                    value={brand}
                    onChangeText={setBrand}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                    placeholder="Örn: Zara"
                  />
                </View>

                <View className="mt-4 flex-row items-center justify-between rounded-xl border border-gray-200 p-4">
                  <View>
                    <Text className="font-bold text-gray-900">Takasa Aç</Text>
                    <Text className="text-xs text-gray-500">Diğer kullanıcılar teklif verebilsin</Text>
                  </View>
                  <Switch
                    value={isTradeable}
                    onValueChange={setIsTradeable}
                    trackColor={{ false: '#767577', true: '#2563EB' }}
                  />
                </View>

                {isTradeable && (
                  <View className="mt-2 space-y-4 rounded-xl bg-blue-50 p-4">
                    <View>
                      <Text className="mb-1 text-sm font-medium text-gray-700">Ekstra Ücret İsteği (Opsiyonel)</Text>
                      <TextInput
                        value={tradePrice}
                        onChangeText={setTradePrice}
                        keyboardType="numeric"
                        className="rounded-xl border border-gray-200 bg-white p-3"
                        placeholder="0 TL"
                      />
                    </View>
                    <View>
                      <Text className="mb-1 text-sm font-medium text-gray-700">Ne ile takas olur?</Text>
                      <TextInput
                        value={tradeWants}
                        onChangeText={setTradeWants}
                        className="rounded-xl border border-gray-200 bg-white p-3"
                        placeholder="Örn: M beden sweatshirt, spor ayakkabı..."
                        multiline
                      />
                    </View>
                  </View>
                )}

                <Button
                  title={loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                  onPress={handleSave}
                  disabled={loading}
                  className="mt-4"
                />
              </View>
            ) : (
              <>
                <View className="mb-6 flex-row items-start justify-between">
                  <View>
                    <Text className="text-2xl font-bold text-gray-900">
                      {displayItem.category}
                    </Text>
                    <Text className="text-gray-500">
                      {displayItem.brand || 'Markasız'}
                    </Text>
                  </View>
                  <View className="items-end">
                    <View className="rounded-full bg-blue-50 px-3 py-1">
                      <Text className="text-xs font-medium text-blue-600">
                        {displayItem.category}
                      </Text>
                    </View>
                    {displayItem.isTradeable && (
                      <View className="mt-1 rounded-full bg-green-100 px-3 py-1">
                        <Text className="text-xs font-medium text-green-700">
                          Takasa Açık
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View className="mb-8 space-y-4">
                  <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
                    <Text className="text-gray-500">Renk</Text>
                    <View className="flex-row items-center gap-2">
                      <View className="h-4 w-4 rounded-full border border-gray-200 bg-black" />
                      <Text className="font-medium text-gray-900">
                        {displayItem.color || 'Belirtilmemiş'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
                    <Text className="text-gray-500">Sezon</Text>
                    <Text className="font-medium text-gray-900">{displayItem.season || 'Tüm Sezonlar'}</Text>
                  </View>

                  {displayItem.isTradeable && (
                    <View className="mt-4 rounded-xl bg-gray-50 p-4">
                      <Text className="mb-2 font-bold text-gray-900">Takas Bilgileri</Text>
                      {displayItem.tradePrice && (
                        <Text className="text-gray-700">Ekstra: <Text className="font-bold">{displayItem.tradePrice} TL</Text></Text>
                      )}
                      {displayItem.tradeWants && (
                        <Text className="mt-1 text-gray-700">İstek: {displayItem.tradeWants}</Text>
                      )}
                    </View>
                  )}
                </View>

                <Button
                  title="Ürünü Sil"
                  variant="outline"
                  className="border-red-200"
                  onPress={handleDelete}
                >
                  <View className="flex-row items-center justify-center gap-2">
                    <Trash2 color="#EF4444" size={20} />
                    <Text className="font-semibold text-red-500">
                      Gardıroptan Sil
                    </Text>
                  </View>
                </Button>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
