import './global.css';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}
