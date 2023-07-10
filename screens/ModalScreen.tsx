import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import AuthContext from '../contexts/auth';
import React from 'react';
import Animated from 'react-native-reanimated';
import { sharedElementTransition } from '../helpers/SharedElementTransition';
import { RootStackScreenProps } from '../types';

export default function ModalScreen({ navigation }: RootStackScreenProps<'Modal'>) {

  console.log({ ModalScreen: 'render' });

  
  return (
    <View style={styles.container}>


      <Animated.View
        style={{ width: 100, height: 100, backgroundColor: 'green' }}
        sharedTransitionTag="sharedTag"
        // sharedTransitionStyle={sharedElementTransition}
      />


      <Pressable onPress={() => navigation.navigate("Settings")}>
        {({ pressed }) => (
          <Text style={[pressed && { color: 'red' }]}>hello world</Text>
        )}
      </Pressable>

     
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
