import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useChatStore } from '../../store/chatStore';
import { useUserStore } from '../../store/userStore';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function ChatListScreen() {
    const navigation = useNavigation<any>();
    const { chats, loading, initChatSubscription } = useChatStore();
    const { user } = useUserStore();

    useEffect(() => {
        initChatSubscription();
    }, []);

    const renderItem = ({ item }: { item: any }) => {
        const otherUserId = item.participants.find((id: string) => id !== user.id);
        const otherUserName = item.participantNames[otherUserId];
        const otherUserAvatar = item.participantAvatars[otherUserId];

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => navigation.navigate('Chat', { chatId: item.id, otherUserName })}
            >
                <Image
                    source={{ uri: otherUserAvatar || 'https://via.placeholder.com/50' }}
                    style={styles.avatar}
                />
                <View style={styles.chatInfo}>
                    <View style={styles.header}>
                        <Text style={styles.name}>{otherUserName}</Text>
                        {item.lastMessageTime && (
                            <Text style={styles.time}>
                                {format(item.lastMessageTime, 'HH:mm', { locale: tr })}
                            </Text>
                        )}
                    </View>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.lastMessage || 'Sohbet başlatıldı'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mesajlar</Text>
            {loading ? (
                <Text style={styles.loading}>Yükleniyor...</Text>
            ) : (
                <FlatList
                    data={chats}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Henüz mesajınız yok.</Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1a1a1a',
    },
    list: {
        paddingBottom: 20,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        backgroundColor: '#e0e0e0',
    },
    chatInfo: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
    loading: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
        fontSize: 16,
    },
});
