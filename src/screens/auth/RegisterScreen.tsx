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
import { registerUser } from '../../services/authService';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Şifre Uyuşmazlığı', 'Girdiğiniz şifreler eşleşmiyor.');
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password, name);
      Alert.alert('Başarılı', 'Hesap başarıyla oluşturuldu!', [
        { text: 'Tamam', onPress: () => navigation.navigate('Onboarding') },
      ]);
    } catch (error: any) {
      Alert.alert('Kayıt Başarısız', error.message || 'Hesap oluşturulamadı.');
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
            <View className="mb-8 items-center">
              <Text className="text-3xl font-bold text-gray-900">
                Hesap Oluştur
              </Text>
              <Text className="mt-2 text-center text-gray-500">
                Gardırobunuzu düzenlemeye ve kıyafet takası yapmaya başlamak için Loop'a katılın.
              </Text>
            </View>

            {/* Form */}
            <View className="w-full">
              <Input
                label="Ad Soyad"
                placeholder="Ahmet Yılmaz"
                value={name}
                onChangeText={setName}
              />

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

              <Input
                label="Şifre Tekrar"
                placeholder="••••••••"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              {loading ? (
                <ActivityIndicator size="large" color="#2563EB" className="mb-4 mt-4" />
              ) : (
                <Button
                  title="Kayıt Ol"
                  onPress={handleRegister}
                  className="mb-4 mt-4"
                />
              )}
            </View>

            {/* Footer */}
            <View className="mt-4 flex-row justify-center">
              <Text className="text-gray-500">Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="font-bold text-blue-600">Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

