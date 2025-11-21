import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { auth } from '../../services/firebaseService';
import { saveOnboardingData } from '../../services/authService';

import Button from '../../components/Button';

const { width } = Dimensions.get('window');

const STYLES = [
  'Günlük',
  'Resmi',
  'Sokak Modası',
  'Vintage',
  'Minimalist',
  'Bohem',
];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { name: 'Siyah', hex: '#000000' },
  { name: 'Beyaz', hex: '#FFFFFF' },
  { name: 'Lacivert', hex: '#000080' },
  { name: 'Bej', hex: '#F5F5DC' },
  { name: 'Kırmızı', hex: '#FF0000' },
  { name: 'Yeşil', hex: '#008000' },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSelection = (
    item: string,
    list: string[],
    setList: (l: string[]) => void,
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleNext = async () => {
    if (step === 0 && !gender) {
      Alert.alert('Seçim Gerekli', 'Lütfen devam etmek için cinsiyetinizi seçin.');
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete Onboarding
      setLoading(true);
      try {
        const uid = auth.currentUser?.uid;
        if (uid) {
          await saveOnboardingData(uid, {
            gender: gender!,
            stylePreferences: selectedStyles,
            colorPreferences: selectedColors,
            bodySize: {
              size: selectedSizes.join(', '), // Simple join for now
            },
          });
        }
        navigation.reset({
          index: 0,
          routes: [{ name: 'AppTabs' }],
        });
      } catch (error: any) {
        Alert.alert('Hata', 'Tercihler kaydedilirken bir sorun oluştu.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <View>
            <Text className="mb-2 text-2xl font-bold text-gray-900">
              Cinsiyetiniz?
            </Text>
            <Text className="mb-6 text-gray-500">
              Size en uygun önerileri sunabilmemiz için gerekli.
            </Text>
            <View className="gap-4">
              {[
                { label: 'Erkek', value: 'male' },
                { label: 'Kadın', value: 'female' },
                { label: 'Diğer', value: 'other' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setGender(option.value as any)}
                  className={`rounded-xl border p-4 ${gender === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white'
                    }`}
                >
                  <Text
                    className={`text-center text-lg ${gender === option.value
                        ? 'font-medium text-blue-600'
                        : 'text-gray-700'
                      }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 1:
        return (
          <View>
            <Text className="mb-2 text-2xl font-bold text-gray-900">
              Tarzınız nedir?
            </Text>
            <Text className="mb-6 text-gray-500">
              Size en uygun stilleri seçin.
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {STYLES.map((style) => (
                <TouchableOpacity
                  key={style}
                  onPress={() =>
                    toggleSelection(style, selectedStyles, setSelectedStyles)
                  }
                  className={`rounded-full border px-4 py-2 ${selectedStyles.includes(style)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white'
                    }`}
                >
                  <Text
                    className={`${selectedStyles.includes(style)
                        ? 'font-medium text-blue-600'
                        : 'text-gray-700'
                      }`}
                  >
                    {style}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View>
            <Text className="mb-2 text-2xl font-bold text-gray-900">
              Bedeniniz?
            </Text>
            <Text className="mb-6 text-gray-500">
              Sizin için mükemmel kalıbı bulalım.
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {SIZES.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() =>
                    toggleSelection(size, selectedSizes, setSelectedSizes)
                  }
                  className={`h-12 w-12 items-center justify-center rounded-full border ${selectedSizes.includes(size)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white'
                    }`}
                >
                  <Text
                    className={`${selectedSizes.includes(size)
                        ? 'font-medium text-blue-600'
                        : 'text-gray-700'
                      }`}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 3:
        return (
          <View>
            <Text className="mb-2 text-2xl font-bold text-gray-900">
              Favori renkleriniz?
            </Text>
            <Text className="mb-6 text-gray-500">
              Giymeyi sevdiğiniz renkleri seçin.
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color.name}
                  onPress={() =>
                    toggleSelection(
                      color.name,
                      selectedColors,
                      setSelectedColors,
                    )
                  }
                  className={`items-center justify-center rounded-xl border p-4 ${selectedColors.includes(color.name)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white'
                    }`}
                  style={{ width: (width - 64) / 3 }}
                >
                  <View
                    className="mb-2 h-8 w-8 rounded-full border border-gray-100 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <Text
                    className={`text-sm ${selectedColors.includes(color.name)
                        ? 'font-medium text-blue-600'
                        : 'text-gray-700'
                      }`}
                  >
                    {color.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 px-6 pt-4">
        {/* Progress Bar */}
        <View className="mb-8 h-1 w-full flex-row rounded-full bg-gray-100">
          <View
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>

        <View className="py-6">
          <View className="flex-row gap-4">
            {step > 0 && (
              <View className="flex-1">
                <Button title="Geri" variant="outline" onPress={handleBack} />
              </View>
            )}
            <View className="flex-1">
              {loading ? (
                <ActivityIndicator size="large" color="#2563EB" />
              ) : (
                <Button
                  title={step === 3 ? 'Başla' : 'İleri'}
                  onPress={handleNext}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

