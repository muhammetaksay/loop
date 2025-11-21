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
} from 'react-native';

import Button from '../../components/Button';

export default function ItemDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { item } = route.params || {};

  // Mock data if no item passed (for development)
  const displayItem = item || {
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'T-Shirt',
    color: 'Black',
    brand: 'Unknown',
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
          <Text className="text-lg font-bold text-gray-900">Item Details</Text>
          <TouchableOpacity className="rounded-full bg-gray-100 p-2">
            <Edit2 color="#374151" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          {/* Image */}
          <View className="aspect-[3/4] w-full bg-gray-50">
            <Image
              source={{ uri: displayItem.image }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>

          {/* Details */}
          <View className="px-6 py-6">
            <View className="mb-6 flex-row items-start justify-between">
              <View>
                <Text className="text-2xl font-bold text-gray-900">
                  {displayItem.category}
                </Text>
                <Text className="text-gray-500">
                  {displayItem.brand || 'No Brand'}
                </Text>
              </View>
              <View className="rounded-full bg-blue-50 px-3 py-1">
                <Text className="text-xs font-medium text-blue-600">
                  {displayItem.category}
                </Text>
              </View>
            </View>

            <View className="mb-8 space-y-4">
              <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
                <Text className="text-gray-500">Color</Text>
                <View className="flex-row items-center gap-2">
                  <View className="h-4 w-4 rounded-full border border-gray-200 bg-black" />
                  <Text className="font-medium text-gray-900">
                    {displayItem.color || 'Black'}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
                <Text className="text-gray-500">Season</Text>
                <Text className="font-medium text-gray-900">All Season</Text>
              </View>
              <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
                <Text className="text-gray-500">Date Added</Text>
                <Text className="font-medium text-gray-900">Oct 24, 2023</Text>
              </View>
            </View>

            <Button
              title="Delete Item"
              variant="outline"
              className="border-red-200"
              onPress={() => console.log('Delete')}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Trash2 color="#EF4444" size={20} />
                <Text className="font-semibold text-red-500">
                  Delete from Wardrobe
                </Text>
              </View>
            </Button>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
