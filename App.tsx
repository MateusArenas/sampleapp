import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { AuthProvider } from './contexts/auth';
import { View } from 'react-native';
import React from 'react';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  
  if (!isLoadingComplete) {
    return <View style={{ flex: 1, backgroundColor: '#2f95dc'}} />;
  } else {
    return (
      <SafeAreaProvider style={{ backgroundColor: '#2f95dc'}} >
        <AuthProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
        </AuthProvider>
      </SafeAreaProvider>
    );
  }
}
