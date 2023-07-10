import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import AuthContext from '../contexts/auth';
import React from 'react';
import Animated from 'react-native-reanimated';
import { sharedElementTransition } from '../helpers/SharedElementTransition';
import { RootStackScreenProps } from '../types';

export default function SettingsScreen({ navigation }: RootStackScreenProps<'Settings'>) {

  console.log({ SettingsScreen: 'render' });

  
  return (
    <View style={styles.container}>
      <Animated.View
        style={{ width: 100, height: 100, backgroundColor: 'green', marginTop: 100 }}
        sharedTransitionTag="sharedTag"
        // sharedTransitionStyle={sharedElementTransition}
      />


     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
