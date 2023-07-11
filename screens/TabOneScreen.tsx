import React from 'react';
import { StyleSheet, Pressable, Image, TouchableOpacity, FlatList } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import AuthContext from '../contexts/auth';
import { apiHandler } from '../services/apiHandler';
import Animated from 'react-native-reanimated';
import { sharedElementTransition } from '../helpers/SharedElementTransition';
import { useNavigation } from '@react-navigation/native';


const CityItem = ({ item }: any) => {
  const navigation = useNavigation();
  
  return (
      <Pressable style={styles.city} onPress={() => navigation.navigate("Modal", { id: item.id })}>
        <Animated.Image
          sharedTransitionTag={`image-${item.id}`}
          style={styles.image}
          source={{ uri: item.uri }}
        />
        <Animated.Text
          sharedTransitionTag={`title-${item.id}`}
          style={styles.name}
        >
          {item.name}
        </Animated.Text>
      </Pressable>
  );
}


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const { signOut } = React.useContext(AuthContext);


  console.log({ TabOneScreen: 'render' });
  
  return (
      <FlatList
        data={[
          { id: 1, name: "maua 1", uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhV1EAO3P7bw5xvkWCUHHWnIgfYMXHPoXXakS8R5U-JP0iZEjq18KMk26vFZe1w938gHU9HAGPHWDVPirPhq6HAF4Fm6otLkz8tBSG3MnaPxzrf3AaXusia7dBCcJPbFtOFTWm6LYiEabmLds9F4-ors8dIKe_dxt3SxV2LGLx26iJuTaYO8xtatDf1/w640-h360/Lamborghini%201.jpg" },
          { id: 2, name: "maua 2", uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhV1EAO3P7bw5xvkWCUHHWnIgfYMXHPoXXakS8R5U-JP0iZEjq18KMk26vFZe1w938gHU9HAGPHWDVPirPhq6HAF4Fm6otLkz8tBSG3MnaPxzrf3AaXusia7dBCcJPbFtOFTWm6LYiEabmLds9F4-ors8dIKe_dxt3SxV2LGLx26iJuTaYO8xtatDf1/w640-h360/Lamborghini%201.jpg" },
          { id: 3, name: "maua 3", uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhV1EAO3P7bw5xvkWCUHHWnIgfYMXHPoXXakS8R5U-JP0iZEjq18KMk26vFZe1w938gHU9HAGPHWDVPirPhq6HAF4Fm6otLkz8tBSG3MnaPxzrf3AaXusia7dBCcJPbFtOFTWm6LYiEabmLds9F4-ors8dIKe_dxt3SxV2LGLx26iJuTaYO8xtatDf1/w640-h360/Lamborghini%201.jpg" },
          { id: 4, name: "maua 4", uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhV1EAO3P7bw5xvkWCUHHWnIgfYMXHPoXXakS8R5U-JP0iZEjq18KMk26vFZe1w938gHU9HAGPHWDVPirPhq6HAF4Fm6otLkz8tBSG3MnaPxzrf3AaXusia7dBCcJPbFtOFTWm6LYiEabmLds9F4-ors8dIKe_dxt3SxV2LGLx26iJuTaYO8xtatDf1/w640-h360/Lamborghini%201.jpg" },
        ]}
        renderItem={({ item }) => <CityItem item={item} />}
        keyExtractor={(item) => item.name}
        numColumns={2}
      />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  city: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '70%',
    backgroundColor: 'gainsboro',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
});