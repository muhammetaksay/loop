import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Check, Share2 } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

import Button from '../../components/Button';

export default function OutfitScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { outfit } = route.params || {};

  const renderItem = (item: any, label: string) => {
    if (!item) return null;

    return (
      <View className="mb-6 flex-row items-center rounded-xl border border-gray-100 bg-gray-50 p-4">
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            className="h-20 w-20 rounded-lg bg-white"
            resizeMode="cover"
          />
        ) : (
          <View className="h-20 w-20 items-center justify-center rounded-lg bg-gray-200">
            <Text className="text-2xl">👕</Text>
          </View>
        )}
        <View className="ml-4 flex-1">
          <Text className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {label}
          </Text>
          <Text className="text-lg font-bold text-gray-900">{item.category}</Text>
          <Text className="text-gray-500">{item.color}</Text>
        </View>
      </View>
    );
  };

  if (!outfit) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Kombin bulunamadı.</Text>
        <Button title="Geri Dön" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-full bg-gray-100 p-2"
          >
            <ArrowLeft color="#374151" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">
            Günün Kombini
          </Text>
          <TouchableOpacity
            onPress={() => Alert.alert('Paylaş', 'Bu özellik yakında gelecek!')}
            className="rounded-full bg-gray-100 p-2"
          >
            <Share2 color="#374151" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="mb-8 items-center">
            <View className="rounded-full bg-purple-100 px-4 py-2">
              <Text className="font-medium text-purple-700">
                %98 Hava Durumu Uyumu
              </Text>
            </View>
          </View>

          <View className="mb-6 rounded-xl bg-blue-50 p-4">
            <Text className="font-bold text-blue-900 mb-2">Neden bu seçim?</Text>
            <Text className="text-blue-800 leading-5">
              {outfit.reasoning}
            </Text>
          </View>

          <View>
            {renderItem(outfit.top, 'Üst Giyim')}
            {renderItem(outfit.bottom, 'Alt Giyim')}
            {renderItem(outfit.shoes, 'Ayakkabı')}
            {renderItem(outfit.outerwear, 'Dış Giyim')}
            {renderItem(outfit.accessory, 'Aksesuar')}
          </View>
        </ScrollView>

        <View className="py-6">
          <Button title="Bu Kombini Giy" onPress={() => {
            Alert.alert('Harika!', 'Bugünkü tarzın çok şık! İyi günler.');
            navigation.goBack();
          }}>
            <View className="flex-row items-center justify-center gap-2">
              <Check color="white" size={20} />
              <Text className="font-semibold text-white">Bu Kombini Giy</Text>
            </View>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

