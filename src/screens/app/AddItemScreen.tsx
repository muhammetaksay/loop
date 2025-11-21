import { useNavigation } from '@react-navigation/native';
import { X, Camera, Image as ImageIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';

import Button from '../../components/Button';
import Input from '../../components/Input';
import {
  pickImageFromGallery,
  takePhoto,
  removeBackground,
} from '../../services/imageService';
import { useWardrobeStore } from '../../store/wardrobeStore';

const CATEGORIES = [
  'Tişört',
  'Gömlek',
  'Pantolon',
  'Kot',
  'Elbise',
  'Ayakkabı',
  'Ceket',
  'Aksesuar',
];

export default function AddItemScreen() {
  const navigation = useNavigation<any>();
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const addItem = useWardrobeStore((state) => state.addItem);

  const handlePickImage = async () => {
    const uri = await pickImageFromGallery();
    if (uri) {
      setImage(uri);
      setProcessedImage(null);
    }
  };

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      setImage(uri);
      setProcessedImage(null);
    }
  };

  const handleRemoveBackground = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await removeBackground(image);
      setProcessedImage(result);
      Alert.alert('Başarılı', 'Arkaplan başarıyla kaldırıldı (Mock)!');
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Arkaplan kaldırılamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!image) {
      Alert.alert('Eksik Resim', 'Lütfen önce bir fotoğraf seçin veya çekin.');
      return;
    }
    if (!category) {
      Alert.alert(
        'Eksik Kategori',
        'Lütfen ürününüz için bir kategori seçin.',
      );
      return;
    }

    setLoading(true);
    try {
      const result = await addItem({
        category,
        color: color || 'Bilinmiyor', // Default color if empty
      }, processedImage || image);

      if (!result.success) {
        Alert.alert('Limit Aşıldı', result.message || 'Ürün eklenemedi.', [
          { text: 'Tamam' },
          { text: 'Premium\'a Geç', onPress: () => navigation.navigate('Premium') },
        ]);
        return;
      }

      Alert.alert('Başarılı', 'Ürün gardırobunuza eklendi!', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
          <Text className="text-lg font-bold text-gray-900">Yeni Ürün Ekle</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <X color="#374151" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 pt-4">
          {/* Image Section */}
          <View className="mb-6 aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50">
            {image ? (
              <View className="relative h-full w-full">
                <Image
                  source={{ uri: processedImage || image }}
                  className="h-full w-full"
                  resizeMode="contain"
                />
                {loading && (
                  <View className="absolute inset-0 items-center justify-center bg-black/30">
                    <ActivityIndicator color="white" size="large" />
                  </View>
                )}
              </View>
            ) : (
              <View className="items-center">
                <Text className="mb-4 text-gray-500">Resim seçilmedi</Text>
                <View className="flex-row gap-4">
                  <TouchableOpacity
                    onPress={handleTakePhoto}
                    className="items-center rounded-lg bg-blue-50 px-4 py-2"
                  >
                    <Camera color="#2563EB" size={24} />
                    <Text className="mt-1 text-xs font-medium text-blue-600">
                      Kamera
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handlePickImage}
                    className="items-center rounded-lg bg-blue-50 px-4 py-2"
                  >
                    <ImageIcon color="#2563EB" size={24} />
                    <Text className="mt-1 text-xs font-medium text-blue-600">
                      Galeri
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {image && !processedImage && (
            <Button
              title="Arkaplanı Kaldır (AI)"
              variant="secondary"
              onPress={handleRemoveBackground}
              className="mb-6"
              loading={loading}
            />
          )}

          {/* Details Form */}
          <View className="mb-8">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Kategori
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              <View className="flex-row gap-2">
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`rounded-full border px-4 py-2 ${category === cat
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white'
                      }`}
                  >
                    <Text
                      className={`${category === cat
                        ? 'font-medium text-blue-600'
                        : 'text-gray-700'
                        }`}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Input
              label="Renk"
              placeholder="Örn. Lacivert"
              value={color}
              onChangeText={setColor}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="border-t border-gray-100 px-4 py-4">
          <Button
            title="Gardıroba Kaydet"
            onPress={handleSave}
            disabled={!image || !category || loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

