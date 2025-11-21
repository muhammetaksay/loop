import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Alert,
    Clipboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Check, Crown, Copy, CreditCard } from 'lucide-react-native';
import Button from '../../components/Button';
import { sendPaymentNotification } from '../../services/paymentService';
import { useUserStore } from '../../store/userStore';

const FREE_FEATURES = [
    '20 adete kadar gardırop ürünü',
    'Temel yapay zeka önerileri',
    'Sınırlı pazar yeri erişimi',
    'Standart destek',
];

const PREMIUM_FEATURES = [
    'Sınırsız gardırop ürünü',
    'Gelişmiş yapay zeka stili',
    'Öncelikli pazar yeri ilanları',
    'Özel takas teklifleri',
    'Premium destek',
    'Yeni özelliklere erken erişim',
];

const IBAN = 'TR12 3456 7890 1234 5678 9012 34';
const RECIPIENT = 'Loop Teknoloji A.Ş.';
const BANK = 'Garanti BBVA';

export default function PremiumScreen() {
    const navigation = useNavigation<any>();
    const user = useUserStore((state) => state.user);
    const [loading, setLoading] = useState(false);

    const handleCopyIBAN = () => {
        Clipboard.setString(IBAN);
        Alert.alert('Kopyalandı', 'IBAN panoya kopyalandı.');
    };

    const handlePaymentNotification = async () => {
        setLoading(true);
        try {
            await sendPaymentNotification(user.id, user.name, user.email);
            Alert.alert(
                'Bildirim Gönderildi',
                'Ödeme bildiriminiz alındı. Kontrol edildikten sonra hesabınız yükseltilecektir.',
                [{ text: 'Tamam', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert('Hata', 'Bildirim gönderilemedi. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
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
                    <Text className="text-lg font-bold text-gray-900">
                        Premium'a Yükselt
                    </Text>
                </View>

                <ScrollView className="flex-1 px-6 pt-6">
                    {/* Hero */}
                    <View className="mb-8 items-center">
                        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500">
                            <Crown color="#000" size={40} />
                        </View>
                        <Text className="text-3xl font-bold text-gray-900">
                            Premium Ol
                        </Text>
                        <Text className="mt-2 text-center text-gray-500">
                            Sınırsız ürün ve özel özelliklerin kilidini aç
                        </Text>
                    </View>

                    {/* Pricing */}
                    <View className="mb-8 overflow-hidden rounded-2xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100">
                        <View className="items-center p-6">
                            <Text className="text-5xl font-bold text-gray-900">₺29.99</Text>
                            <Text className="mt-1 text-gray-600">aylık</Text>
                        </View>
                    </View>

                    {/* IBAN Payment Info */}
                    <View className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <View className="mb-3 flex-row items-center gap-2">
                            <CreditCard color="#2563EB" size={20} />
                            <Text className="font-bold text-gray-900">Havale/EFT ile Ödeme</Text>
                        </View>

                        <View className="space-y-2">
                            <View>
                                <Text className="text-xs text-gray-500">Alıcı</Text>
                                <Text className="font-medium text-gray-900">{RECIPIENT}</Text>
                            </View>
                            <View>
                                <Text className="text-xs text-gray-500">Banka</Text>
                                <Text className="font-medium text-gray-900">{BANK}</Text>
                            </View>
                            <View>
                                <Text className="text-xs text-gray-500">IBAN</Text>
                                <View className="flex-row items-center justify-between rounded-lg bg-gray-50 p-2">
                                    <Text className="font-mono text-sm text-gray-900 flex-1 mr-2">
                                        {IBAN}
                                    </Text>
                                    <TouchableOpacity onPress={handleCopyIBAN}>
                                        <Copy color="#6B7280" size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <Text className="mt-3 text-xs text-gray-500">
                            Ödemeyi yaptıktan sonra aşağıdaki butona tıklayarak bize bildirin.
                        </Text>
                    </View>

                    {/* Feature Comparison */}
                    <View className="mb-8">
                        <Text className="mb-4 text-xl font-bold text-gray-900">
                            Neler Dahil?
                        </Text>

                        {/* Premium Features */}
                        <View className="mb-4 rounded-xl bg-gray-50 p-4">
                            <View className="mb-3 flex-row items-center gap-2">
                                <Crown color="#EAB308" size={20} />
                                <Text className="font-bold text-gray-900">Premium</Text>
                            </View>
                            {PREMIUM_FEATURES.map((feature, index) => (
                                <View
                                    key={index}
                                    className="mb-2 flex-row items-center gap-2"
                                >
                                    <Check color="#10B981" size={18} />
                                    <Text className="flex-1 text-gray-700">{feature}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Free Features */}
                        <View className="rounded-xl bg-gray-50 p-4">
                            <Text className="mb-3 font-bold text-gray-900">Ücretsiz</Text>
                            {FREE_FEATURES.map((feature, index) => (
                                <View
                                    key={index}
                                    className="mb-2 flex-row items-center gap-2"
                                >
                                    <Check color="#9CA3AF" size={18} />
                                    <Text className="flex-1 text-gray-500">{feature}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* CTA */}
                <View className="border-t border-gray-100 px-6 py-4">
                    <Button
                        title="Ödeme Bildirimi Gönder"
                        onPress={handlePaymentNotification}
                        loading={loading}
                    />
                    <Text className="mt-2 text-center text-xs text-gray-500">
                        İstediğiniz zaman iptal edebilirsiniz. Taahhüt yok.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

