import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Sun, CloudRain, Wind, ArrowRight, RefreshCw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';

import { getCurrentWeather, WeatherData } from '../../services/weatherService';
import { generateOutfitRecommendation } from '../../services/geminiService';
import { useUserStore } from '../../store/userStore';
import { useWardrobeStore } from '../../store/wardrobeStore';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const user = useUserStore((state) => state.user);
  const { items: wardrobeItems, fetchItems } = useWardrobeStore();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [outfit, setOutfit] = useState<any>(null);
  const [loadingOutfit, setLoadingOutfit] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await loadWeather();
    await fetchItems();
  };

  const loadWeather = async () => {
    const data = await getCurrentWeather();
    setWeather(data);
  };

  const generateOutfit = async () => {
    if (!weather || wardrobeItems.length === 0) return;

    setLoadingOutfit(true);
    try {
      const recommendation = await generateOutfitRecommendation(
        { temp: weather.temp, condition: weather.condition },
        wardrobeItems,
        user.gender
      );
      setOutfit(recommendation);
    } catch (error) {
      console.error('Error generating outfit:', error);
    } finally {
      setLoadingOutfit(false);
    }
  };

  // Generate outfit when weather and wardrobe are loaded
  useEffect(() => {
    if (weather && wardrobeItems.length > 0 && !outfit) {
      generateOutfit();
    }
  }, [weather, wardrobeItems]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="mb-8 flex-row items-center justify-between">
          <View>
            <Text className="text-lg text-gray-500">Günaydın,</Text>
            <Text className="text-2xl font-bold text-gray-900">{user.name}</Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Text className="text-xl">👋</Text>
          </View>
        </View>

        {/* Weather Widget */}
        <View className="mb-8 overflow-hidden rounded-2xl bg-blue-600 p-6 shadow-lg shadow-blue-200">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-blue-100">
                {weather?.location || 'Yükleniyor...'}
              </Text>
              <Text className="mt-1 text-4xl font-bold text-white">
                {weather ? `${weather.temp}°` : '--'}
              </Text>
              <Text className="text-blue-100">
                {weather?.condition || '...'}
              </Text>
            </View>
            <Sun color="white" size={48} />
          </View>
        </View>

        {/* Daily Suggestion */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              Günün Kombini
            </Text>
            <TouchableOpacity onPress={generateOutfit} disabled={loadingOutfit}>
              <RefreshCw
                color="#2563EB"
                size={20}
                className={loadingOutfit ? 'opacity-50' : ''}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Outfit', { outfit })}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50"
            disabled={!outfit}
          >
            <View className="flex-row p-4">
              <View className="flex-1 pr-4">
                <View className="mb-2 self-start rounded-full bg-purple-100 px-3 py-1">
                  <Text className="text-xs font-medium text-purple-600">
                    Yapay Zeka Seçimi
                  </Text>
                </View>
                {loadingOutfit ? (
                  <ActivityIndicator color="#2563EB" className="self-start py-4" />
                ) : outfit ? (
                  <>
                    <Text className="mb-2 text-xl font-bold text-gray-900">
                      Bugünün Önerisi
                    </Text>
                    <Text className="text-gray-500" numberOfLines={3}>
                      {outfit.reasoning}
                    </Text>
                  </>
                ) : (
                  <Text className="text-gray-500">
                    Kombin önerisi için gardırobunuza kıyafet ekleyin.
                  </Text>
                )}

                {outfit && !loadingOutfit && (
                  <View className="mt-4 flex-row items-center">
                    <Text className="font-medium text-blue-600">Kombini Gör</Text>
                    <ArrowRight color="#2563EB" size={16} className="ml-1" />
                  </View>
                )}
              </View>
              <View className="w-24 items-center justify-center">
                <View className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-100 opacity-50" />
                <Text className="text-4xl">👕</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View>
          <Text className="mb-4 text-lg font-bold text-gray-900">
            Hızlı İşlemler
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => navigation.navigate('AddItem')}
              className="flex-1 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <Text className="text-xl">📸</Text>
              </View>
              <Text className="font-medium text-gray-900">Ürün Ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Wardrobe')}
              className="flex-1 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <Text className="text-xl">👗</Text>
              </View>
              <Text className="font-medium text-gray-900">Gardırop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

