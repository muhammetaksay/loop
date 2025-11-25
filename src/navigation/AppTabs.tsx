import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Shirt, ShoppingBag, User, MessageCircle } from 'lucide-react-native';
import React from 'react';

import HomeScreen from '../screens/app/HomeScreen';
import MarketplaceScreen from '../screens/app/MarketplaceScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import WardrobeScreen from '../screens/app/WardrobeScreen';
import ChatListScreen from '../screens/app/ChatListScreen';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          tabBarLabel: 'Stilist',
        }}
      />
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Shirt color={color} size={size} />,
          tabBarLabel: 'Dolabım',
        }}
      />
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag color={color} size={size} />
          ),
          tabBarLabel: 'Takas',
        }}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={size} />
          ),
          tabBarLabel: 'Mesajlar',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
}
