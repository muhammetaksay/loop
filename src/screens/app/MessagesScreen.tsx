import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MessageCircle } from 'lucide-react-native';
import { useChatStore } from '../../store/chatStore';

function formatTime(timestamp: any) {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Şimdi';
    if (minutes < 60) return `${minutes}dk önce`;
    if (hours < 24) return `${hours}s önce`;
    return `${days}g önce`;
}

export default function MessagesScreen() {
    const navigation = useNavigation<any>();
    const { conversations, fetchConversations, loading } = useChatStore();

    useEffect(() => {
        fetchConversations();
    }, []);

    const onRefresh = async () => {
        await fetchConversations();
    };

    const renderConversation = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Chat', { conversation: item })}
            className="flex-row items-center border-b border-gray-100 px-6 py-4"
        >
            {/* Avatar */}
            <View className="mr-4 h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                <Text className="text-xl font-bold text-blue-600">
                    {item.userName ? item.userName.charAt(0).toUpperCase() : '?'}
                </Text>
            </View>

            {/* Content */}
            <View className="flex-1">
                <View className="mb-1 flex-row items-center justify-between">
                    <Text className="text-base font-semibold text-gray-900">
                        {item.userName || 'Kullanıcı'}
                    </Text>
                    <Text className="text-xs text-gray-500">
                        {formatTime(item.lastMessageTime)}
                    </Text>
                </View>
                <View className="flex-row items-center justify-between">
                    <Text
                        className={`flex-1 text-sm ${item.unread > 0 ? 'font-bold text-gray-900' : 'text-gray-600'}`}
                        numberOfLines={1}
                    >
                        {item.lastMessage || 'Mesaj yok'}
                    </Text>
                    {item.unread > 0 && (
                        <View className="ml-2 h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                            <Text className="text-xs font-bold text-white">
                                {item.unread}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="flex-1">
                {/* Header */}
                <View className="mb-2 px-6 pt-4">
                    <Text className="text-3xl font-bold text-gray-900">Mesajlar</Text>
                </View>

                {/* List */}
                {conversations.length === 0 && !loading ? (
                    <View className="flex-1 items-center justify-center px-6">
                        <MessageCircle color="#9CA3AF" size={64} />
                        <Text className="mt-4 text-center text-xl font-bold text-gray-900">
                            Henüz Mesaj Yok
                        </Text>
                        <Text className="mt-2 text-center text-gray-500">
                            Diğer kullanıcılarla bağlantı kurmak için takas yapmaya başla!
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={conversations}
                        renderItem={renderConversation}
                        keyExtractor={(item) => item.id}
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

