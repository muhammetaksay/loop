import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Plus, Filter } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';

import { useWardrobeStore } from '../../store/wardrobeStore';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_WIDTH = (width - 48) / COLUMN_COUNT;

export default function WardrobeScreen() {
  const navigation = useNavigation<any>();
  const { items, fetchItems, loading } = useWardrobeStore();

  React.useEffect(() => {
    fetchItems();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="mb-4 overflow-hidden rounded-xl bg-gray-50"
      style={{ width: ITEM_WIDTH, height: ITEM_WIDTH * 1.3 }}
      onPress={() => navigation.navigate('ItemDetail', { item })}
    >
      <Image
        source={{ uri: item.imageUrl || item.image }}
        className="h-full w-full"
        resizeMode="cover"
      />
      <View className="absolute bottom-0 left-0 right-0 bg-black/30 p-2">
        <Text className="text-center text-xs font-medium text-white">
          {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-gray-900">Gardırobum</Text>
          <TouchableOpacity className="rounded-full bg-gray-100 p-2">
            <Filter color="#374151" size={20} />
          </TouchableOpacity>
        </View>

        {/* Grid */}
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshing={loading}
          onRefresh={fetchItems}
          ListEmptyComponent={
            <View className="mt-20 items-center">
              <Text className="text-gray-500">Henüz kıyafet eklemediniz.</Text>
            </View>
          }
        />

        {/* FAB */}
        <TouchableOpacity
          onPress={() => navigation.navigate('AddItem')}
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg"
        >
          <Plus color="white" size={28} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

