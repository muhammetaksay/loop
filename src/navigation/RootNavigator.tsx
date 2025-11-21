import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import AppTabs from './AppTabs';
import AuthStack from './AuthStack';
import AddItemScreen from '../screens/app/AddItemScreen';
import ItemDetailScreen from '../screens/app/ItemDetailScreen';
import OutfitScreen from '../screens/app/OutfitScreen';
import ListingDetailScreen from '../screens/app/ListingDetailScreen';
import TradesScreen from '../screens/app/TradesScreen';
import ChatScreen from '../screens/app/ChatScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import PremiumScreen from '../screens/app/PremiumScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="AuthStack"
      >
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="AppTabs" component={AppTabs} />
        <Stack.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
        <Stack.Screen name="Outfit" component={OutfitScreen} />
        <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
        <Stack.Screen name="Trades" component={TradesScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Premium" component={PremiumScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
