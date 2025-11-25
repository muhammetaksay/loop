import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MessageCircle, ArrowLeft } from 'lucide-react-native';
import { useChatStore } from '../../store/chatStore';
import { getMarketplaceListings, MarketplaceListing } from '../../services/marketplaceService';

export default function PublicProfileScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { userId, userName, userAvatar } = route.params;
    const { startChat } = useChatStore();
    const [listings, setListings] = useState<MarketplaceListing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserListings();
    }, [userId]);

    const loadUserListings = async () => {
        try {
            // We need a way to get listings for a specific user.
            // Currently getMarketplaceListings excludes the current user.
            // We might need a new service function or filter on client side if we fetch all (inefficient).
            // For now, let's assume we can't easily fetch their listings without a new index/query.
            // Or we can try to use getMarketplaceListings and filter? No, that excludes userId.
            // Let's just show basic profile info for now to satisfy the "Message" requirement.
            setLoading(false);
        } catch (error) {
            console.error('Error loading user listings:', error);
            setLoading(false);
        }
    };

    const handleMessage = async () => {
        try {
            const chatId = await startChat(userId, userName, userAvatar);
            navigation.navigate('Chat', { chatId, otherUserName: userName });
        } catch (error) {
            Alert.alert('Hata', 'Sohbet başlatılamadı.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profil</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileHeader}>
                    <Image
                        source={{ uri: userAvatar || 'https://via.placeholder.com/100' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{userName}</Text>
                    <Text style={styles.bio}>Loop Kullanıcısı</Text>

                    <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
                        <MessageCircle color="#fff" size={20} />
                        <Text style={styles.messageButtonText}>Mesaj Gönder</Text>
                    </TouchableOpacity>
                </View>

                {/* Future: Show user's items here */}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    content: {
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        backgroundColor: '#f0f0f0',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 5,
    },
    bio: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    messageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    messageButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 16,
    },
});
