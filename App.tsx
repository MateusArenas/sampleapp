import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { AuthProvider } from './contexts/auth';
import { View, TextInput, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import React from 'react';

import 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { HandlersProvider } from './handlers';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  
  if (!isLoadingComplete) {
    return <View style={{ flex: 1, backgroundColor: '#2f95dc'}} />;
  } else {
    return (
      <SafeAreaProvider style={{ flex: 1 }} >
        <GestureHandlerRootView style={{ flex: 1  }} >
            <PaperProvider>
              <HandlersProvider>
                <AuthProvider>
                  <Navigation colorScheme={colorScheme} />
                  <StatusBar 
                    style="auto"
                    backgroundColor={colorScheme === "dark" ? "black" : "white"}
                  />
                </AuthProvider>
              </HandlersProvider>
            </PaperProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }
}
