import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Button from '../../components/Button';
import Input from '../../components/Input';
import { loginUser } from '../../services/authService';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await loginUser(email, password);
      // Navigation will be handled by auth state listener
      navigation.navigate('AppTabs');
    } catch (error: any) {
      Alert.alert('Giriş Başarısız', error.message || 'Geçersiz e-posta veya şifre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          <View className="flex-1 justify-center py-10">
            {/* Header */}
            <View className="mb-10 items-center">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <Text className="text-4xl">👗</Text>
              </View>
              <Text className="text-3xl font-bold text-gray-900">
                Tekrar Hoşgeldiniz
              </Text>
              <Text className="mt-2 text-center text-gray-500">
                Dijital gardırobunuza erişmek ve yeni stiller keşfetmek için giriş yapın.
              </Text>
            </View>

            {/* Form */}
            <View className="w-full">
              <Input
                label="E-posta Adresi"
                placeholder="merhaba@ornek.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Input
                label="Şifre"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity className="mb-6 self-end">
                <Text className="text-sm font-medium text-blue-600">
                  Şifremi Unuttum?
                </Text>
              </TouchableOpacity>

              {loading ? (
                <ActivityIndicator size="large" color="#2563EB" className="mb-4" />
              ) : (
                <Button title="Giriş Yap" onPress={handleLogin} className="mb-4" />
              )}

              <Button
                title="Hesap Oluştur"
                variant="outline"
                onPress={() => navigation.navigate('Register')}
              />
            </View>

            {/* Footer */}
            <View className="mt-8 flex-row justify-center">
              <Text className="text-gray-500">Hesabınız yok mu? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text className="font-bold text-blue-600">Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

