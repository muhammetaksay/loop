import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useUserStore } from '../../store/userStore';

export default function SettingsScreen() {
    const navigation = useNavigation<any>();
    const user = useUserStore((state) => state.user);
    const updateProfile = useUserStore((state) => state.updateProfile);

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(user.gender);

    const handleSave = () => {
        updateProfile({ name, email, gender });
        Alert.alert('Başarılı', 'Profil başarıyla güncellendi!');
        navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="flex-1">
                {/* Header */}
                <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-3 rounded-full bg-gray-100 p-2"
                    >
                        <ArrowLeft color="#374151" size={20} />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-gray-900">Ayarlar</Text>
                </View>

                <ScrollView className="flex-1 px-6 pt-6">
                    {/* Profile Section */}
                    <Text className="mb-4 text-xl font-bold text-gray-900">
                        Profil Bilgileri
                    </Text>

                    <Input
                        label="Ad Soyad"
                        value={name}
                        onChangeText={setName}
                        placeholder="Adınız"
                    />

                    <Input
                        label="E-posta"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="eposta@ornek.com"
                        keyboardType="email-address"
                    />

                    <View className="mb-4">
                        <Text className="mb-2 text-sm font-medium text-gray-700">Cinsiyet</Text>
                        <View className="flex-row gap-3">
                            {[
                                { label: 'Erkek', value: 'male' },
                                { label: 'Kadın', value: 'female' },
                                { label: 'Diğer', value: 'other' },
                            ].map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => setGender(option.value as any)}
                                    className={`flex-1 rounded-xl border p-3 ${gender === option.value
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 bg-white'
                                        }`}
                                >
                                    <Text
                                        className={`text-center text-sm ${gender === option.value
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

                    {/* App Info */}
                    <View className="mt-8 rounded-xl bg-gray-50 p-4">
                        <Text className="mb-2 text-sm font-medium text-gray-500">
                            Hakkında
                        </Text>
                        <Text className="text-base text-gray-900">
                            Loop - Yapay Zeka Destekli Akıllı Gardırop
                        </Text>
                        <Text className="mt-1 text-sm text-gray-500">Sürüm 1.0.0</Text>
                    </View>
                </ScrollView>

                {/* Save Button */}
                <View className="border-t border-gray-100 px-6 py-4">
                    <Button title="Değişiklikleri Kaydet" onPress={handleSave} />
                </View>
            </View>
        </SafeAreaView>
    );
}

