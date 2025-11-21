import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useChatStore } from '../../store/chatStore';
import { auth } from '../../services/firebaseService';

export default function ChatScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { conversation } = route.params || {};

    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const { messages: messagesMap, sendMessage, fetchMessages, subscribeToConversation, loading } = useChatStore();
    const messages = messagesMap[conversation.id] || [];

    useEffect(() => {
        // Initial fetch
        fetchMessages(conversation.id);

        // Subscribe to real-time updates
        const unsubscribe = subscribeToConversation(conversation.id);

        return () => {
            unsubscribe();
        };
    }, [conversation.id]);

    useEffect(() => {
        // Auto-scroll to bottom when messages change
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const handleSend = async () => {
        if (inputText.trim()) {
            const text = inputText.trim();
            setInputText('');
            // conversation.userId is the OTHER user's ID
            await sendMessage(conversation.id, text, conversation.userId);
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        const currentUserId = auth.currentUser?.uid;
        const isOwnMessage = item.senderId === currentUserId;

        return (
            <View
                className={`mb-3 flex-row ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
                <View
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${isOwnMessage ? 'bg-blue-600' : 'bg-gray-100'
                        }`}
                >
                    <Text
                        className={`text-base ${isOwnMessage ? 'text-white' : 'text-gray-900'}`}
                    >
                        {item.text}
                    </Text>
                    <Text
                        className={`mt-1 text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                            }`}
                    >
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        }) : ''}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {/* Header */}
                <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-3 rounded-full bg-gray-100 p-2"
                    >
                        <ArrowLeft color="#374151" size={20} />
                    </TouchableOpacity>

                    <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Text className="text-base font-bold text-blue-600">
                            {conversation.userName ? conversation.userName.charAt(0).toUpperCase() : '?'}
                        </Text>
                    </View>

                    <Text className="text-lg font-semibold text-gray-900">
                        {conversation.userName || 'Kullanıcı'}
                    </Text>
                </View>

                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: true })
                    }
                    ListEmptyComponent={
                        loading ? (
                            <ActivityIndicator className="mt-4" color="#2563EB" />
                        ) : (
                            <Text className="text-center text-gray-500 mt-4">Henüz mesaj yok.</Text>
                        )
                    }
                />

                {/* Input */}
                <View className="flex-row items-center border-t border-gray-100 px-4 py-3">
                    <TextInput
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Mesaj yazın..."
                        className="mr-3 flex-1 rounded-full bg-gray-100 px-4 py-3 text-base"
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                        className={`h-12 w-12 items-center justify-center rounded-full ${inputText.trim() ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                    >
                        <Send
                            color={inputText.trim() ? 'white' : '#9CA3AF'}
                            size={20}
                            fill={inputText.trim() ? 'white' : '#9CA3AF'}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
