import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Text, View } from '../components/Themed';
import Logo from '../svgs/Logo';
import Animated from 'react-native-reanimated';

export default function SplashScreen() {

  console.log({ SplashScreen: 'render' });

  return (
    <View style={styles.container}>



        <Animatable.View animation="bounceInDown" duration={600} iterationCount={1}>
            <Animatable.View animation="pulse" delay={600} iterationCount="infinite">
                <Animated.View sharedTransitionTag="logoTag" >
                    <Logo />
                </Animated.View>
            </Animatable.View>
        </Animatable.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2f95dc',
    justifyContent: 'center',
  },
});
