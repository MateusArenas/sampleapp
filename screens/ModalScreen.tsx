import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Image, useWindowDimensions, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import AuthContext from '../contexts/auth';
import React from 'react';
import Animated from 'react-native-reanimated';
import { sharedElementTransition } from '../helpers/SharedElementTransition';
import { RootStackScreenProps } from '../types';
import { Ionicons } from '@expo/vector-icons';

export default function ModalScreen({ navigation, route }: RootStackScreenProps<'Modal'>) {

  return (
    <View style={styles.container}>
      <Animated.Image
        sharedTransitionTag={`image-${route.params.id}`}
        style={styles.image}
        source={{ uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhV1EAO3P7bw5xvkWCUHHWnIgfYMXHPoXXakS8R5U-JP0iZEjq18KMk26vFZe1w938gHU9HAGPHWDVPirPhq6HAF4Fm6otLkz8tBSG3MnaPxzrf3AaXusia7dBCcJPbFtOFTWm6LYiEabmLds9F4-ors8dIKe_dxt3SxV2LGLx26iJuTaYO8xtatDf1/w640-h360/Lamborghini%201.jpg" }}
      />
      <Animated.Text
        sharedTransitionTag={`title-${route.params.id}`}
        style={styles.name}
      >
        {"maua"}
      </Animated.Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Details:</Text>
        <Text style={styles.detailsText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
          euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
          est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
          amet semper molestie. Sed euismod ligula sit amet urna maximus
          dignissim. Praesent aliquam, nunc vel interdum dignissim, risus neque
          dignissim elit, id posuere mauris tortor at quam. Duis euismod
          lobortis enim, vel sollicitudin purus bibendum eu. Pellentesque luctus
          leo id elit congue faucibus. Morbi vel nulla enim.
        </Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <Ionicons name="ios-arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
  },
  detailsContainer: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 16,
    lineHeight: 24,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#000000',
    opacity: 0.8,
  },
});
