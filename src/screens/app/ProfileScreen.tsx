import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Settings,
  Crown,
  LogOut,
  ChevronRight,
  Package,
  Repeat,
} from 'lucide-react-native';
import { useUserStore } from '../../store/userStore';
import { useWardrobeStore } from '../../store/wardrobeStore';
import { useMarketplaceStore } from '../../store/marketplaceStore';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const wardrobeItems = useWardrobeStore((state) => state.items);
  const tradeOffers = useMarketplaceStore((state) => state.tradeOffers);

  const handleLogout = () => {
    logout();
    navigation.navigate('AuthStack');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="mb-6 px-6 pt-4">
          <Text className="text-3xl font-bold text-gray-900">Profil</Text>
        </View>

        {/* User Info Card */}
        <View className="mx-6 mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-white/20">
            <Text className="text-3xl font-bold text-white">
              {user.name.charAt(0)}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-2xl font-bold text-white">{user.name}</Text>
            {user.isPremium && (
              <View className="rounded-full bg-yellow-400 px-2 py-1">
                <Crown color="#000" size={14} />
              </View>
            )}
          </View>
          <Text className="mt-1 text-blue-100">{user.email}</Text>
        </View>

        {/* Stats */}
        <View className="mx-6 mb-6 flex-row gap-3">
          <View className="flex-1 items-center rounded-xl bg-gray-50 py-4">
            <Package color="#3B82F6" size={24} />
            <Text className="mt-2 text-2xl font-bold text-gray-900">
              {wardrobeItems.length}
            </Text>
            <Text className="text-sm text-gray-500">Kıyafet</Text>
          </View>
          <View className="flex-1 items-center rounded-xl bg-gray-50 py-4">
            <Repeat color="#3B82F6" size={24} />
            <Text className="mt-2 text-2xl font-bold text-gray-900">
              {tradeOffers.length}
            </Text>
            <Text className="text-sm text-gray-500">Takas</Text>
          </View>
        </View>

        {/* Options */}
        <View className="mx-6 mb-6">
          {!user.isPremium && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Premium')}
              className="mb-3 flex-row items-center justify-between rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 p-4"
            >
              <View className="flex-row items-center gap-3">
                <Crown color="#000" size={24} />
                <View>
                  <Text className="text-base font-bold text-gray-900">
                    Premium'a Yükselt
                  </Text>
                  <Text className="text-sm text-gray-700">
                    Sınırsız ürün & daha fazlası
                  </Text>
                </View>
              </View>
              <ChevronRight color="#000" size={20} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            className="mb-3 flex-row items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
          >
            <View className="flex-row items-center gap-3">
              <Settings color="#6B7280" size={24} />
              <Text className="text-base font-medium text-gray-900">
                Ayarlar
              </Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <View className="flex-row items-center gap-3">
              <LogOut color="#EF4444" size={24} />
              <Text className="text-base font-medium text-red-600">
                Çıkış Yap
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

