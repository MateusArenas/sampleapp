import React from 'react';
import { StyleSheet, Pressable, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, NativeSyntheticEvent, NativeScrollEvent, Button } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { RootTabScreenProps } from '../types';
import AuthContext from '../contexts/auth';
import { apiHandler } from '../services/ApiService';
import Animated from 'react-native-reanimated';
import { sharedElementTransition } from '../helpers/SharedElementTransition';
import { useNavigation } from '@react-navigation/native';

import { LinearGradient } from 'expo-linear-gradient';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);


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

  const [showTitle, setShowTitle] = React.useState(false);

  React.useLayoutEffect(() => {
      navigation.setOptions({
          headerStyle: {
              backgroundColor: '#D9D9D9',
              shadowOpacity: 0,
              borderBottomColor: '#CDCDCD',
              borderBottomWidth: showTitle ? 1 : 0
          },
          headerTitle: () => {
              if (!showTitle)
                  return

              return (
                  <Text style={{
                      fontSize: 18,
                      fontWeight: '600'
                  }}>
                      Bem-vindo
                  </Text>
              )
          }
      });
  }, [showTitle]);


  const scrollHandle = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (event.nativeEvent.contentOffset.y < 44) {
          setShowTitle(false)
      } else {
          setShowTitle(true)
      }
  }


  console.log({ TabOneScreen: 'render' });
  
  return (
    <View style={{ flex: 1, backgroundColor: '#D9D9D9' }}>

      <Button title='Chatbot' onPress={() => navigation.navigate('Chatbot')} />

      <FlatList
        onScroll={scrollHandle}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
              Olá, Mateus
            </Text>
          </View>
        }
        data={[
          { id: 1, name: "maua 1", uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhV1EAO3P7bw5xvkWCUHHWnIgfYMXHPoXXakS8R5U-JP0iZEjq18KMk26vFZe1w938gHU9HAGPHWDVPirPhq6HAF4Fm6otLkz8tBSG3MnaPxzrf3AaXusia7dBCcJPbFtOFTWm6LYiEabmLds9F4-ors8dIKe_dxt3SxV2LGLx26iJuTaYO8xtatDf1/w640-h360/Lamborghini%201.jpg" },
          { id: 2, name: "maua 2", uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhV1EAO3P7bw5xvkWCUHHWnIgfYMXHPoXXakS8R5U-JP0iZEjq18KMk26vFZe1w938gHU9HAGPHWDVPirPhq6HAF4Fm6otLkz8tBSG3MnaPxzrf3AaXusia7dBCcJPbFtOFTWm6LYiEabmLds9F4-ors8dIKe_dxt3SxV2LGLx26iJuTaYO8xtatDf1/w640-h360/Lamborghini%201.jpg" },
          { id: 3, name: "maua 3", uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhV1EAO3P7bw5xvkWCUHHWnIgfYMXHPoXXakS8R5U-JP0iZEjq18KMk26vFZe1w938gHU9HAGPHWDVPirPhq6HAF4Fm6otLkz8tBSG3MnaPxzrf3AaXusia7dBCcJPbFtOFTWm6LYiEabmLds9F4-ors8dIKe_dxt3SxV2LGLx26iJuTaYO8xtatDf1/w640-h360/Lamborghini%201.jpg" },
          { id: 4, name: "maua 4", uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhV1EAO3P7bw5xvkWCUHHWnIgfYMXHPoXXakS8R5U-JP0iZEjq18KMk26vFZe1w938gHU9HAGPHWDVPirPhq6HAF4Fm6otLkz8tBSG3MnaPxzrf3AaXusia7dBCcJPbFtOFTWm6LYiEabmLds9F4-ors8dIKe_dxt3SxV2LGLx26iJuTaYO8xtatDf1/w640-h360/Lamborghini%201.jpg" },
          { id: 5, name: "maua 4", uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhV1EAO3P7bw5xvkWCUHHWnIgfYMXHPoXXakS8R5U-JP0iZEjq18KMk26vFZe1w938gHU9HAGPHWDVPirPhq6HAF4Fm6otLkz8tBSG3MnaPxzrf3AaXusia7dBCcJPbFtOFTWm6LYiEabmLds9F4-ors8dIKe_dxt3SxV2LGLx26iJuTaYO8xtatDf1/w640-h360/Lamborghini%201.jpg" },
          { id: 6, name: "maua 5", uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhV1EAO3P7bw5xvkWCUHHWnIgfYMXHPoXXakS8R5U-JP0iZEjq18KMk26vFZe1w938gHU9HAGPHWDVPirPhq6HAF4Fm6otLkz8tBSG3MnaPxzrf3AaXusia7dBCcJPbFtOFTWm6LYiEabmLds9F4-ors8dIKe_dxt3SxV2LGLx26iJuTaYO8xtatDf1/w640-h360/Lamborghini%201.jpg" },
          { id: 7, name: "maua 6", uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhV1EAO3P7bw5xvkWCUHHWnIgfYMXHPoXXakS8R5U-JP0iZEjq18KMk26vFZe1w938gHU9HAGPHWDVPirPhq6HAF4Fm6otLkz8tBSG3MnaPxzrf3AaXusia7dBCcJPbFtOFTWm6LYiEabmLds9F4-ors8dIKe_dxt3SxV2LGLx26iJuTaYO8xtatDf1/w640-h360/Lamborghini%201.jpg" },
          { id: 8, name: "maua 7", uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhV1EAO3P7bw5xvkWCUHHWnIgfYMXHPoXXakS8R5U-JP0iZEjq18KMk26vFZe1w938gHU9HAGPHWDVPirPhq6HAF4Fm6otLkz8tBSG3MnaPxzrf3AaXusia7dBCcJPbFtOFTWm6LYiEabmLds9F4-ors8dIKe_dxt3SxV2LGLx26iJuTaYO8xtatDf1/w640-h360/Lamborghini%201.jpg" },
        ]}
        renderItem={({ item }) => <CityItem item={item} />}
        keyExtractor={(item) => item.name}
        numColumns={2}

        ListFooterComponent={
          <Pressable onPress={() => navigation.navigate("BlogPost")}
            style={{ marginBottom: 16, marginLeft: 16 }}
          >
            <View style={{ width: 320 }}>
                <Text>ESPORTES</Text>

                <Animated.View style={[
                  { width: "100%", position: 'relative', overflow: 'hidden' },
                  { backgroundColor: "#E4E4E4", borderRadius: 10 }
                ]}
                  sharedTransitionTag={`tag-container`}
                >
                    
                  <View style={{ flex: 1 }}>
                    <AnimatedLinearGradient style={{ position: 'absolute', top: 0, width: '100%', height: '100%', zIndex: 3 }}
                      colors={['transparent', 'rgba(0,0,0,0.3)']}
                      sharedTransitionTag={`tag-lineargradient`}
                    />

                    <Animated.Image style={{ 
                          zIndex: 2,
                          width: '100%',
                          height: 186,
                          backgroundColor: '#E4E4E4',
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                      }}
                      source={{ uri: "https://redecredauto-blog.s3.sa-east-1.amazonaws.com/wp-content/uploads/2023/07/12120406/capa-89.jpg" }}
                      sharedTransitionTag={`tag-image`}
                    />

                    <View style={{ padding: 16, position: 'absolute', bottom: 0, zIndex: 2 }}
                    >
                      <Text style={{ color: 'white' }}
                      >
                        Blog CredAuto
                      </Text>
                      <Text numberOfLines={2} style={{ color: 'white' }}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                        euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                        est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                        amet semper molestie. Sed euismod ligula sit amet urna maximus
                      </Text>
                    </View>
                  </View>



                  <Animated.View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}
                    sharedTransitionTag={`tag-bottom`}
                  >

                    <View style={{ flex: 1, paddingRight:20}}>
                        <Animated.Text style={{ color: "black" }}
                            sharedTransitionTag={`tag-subcard-title`}
                        >
                            Blog CredAuto
                        </Animated.Text>
                        <Animated.Text style={{ color: "black" }} numberOfLines={1}
                            sharedTransitionTag={`tag-subcard-content`}
                        >
                            www.blog.redecredauto.com
                        </Animated.Text>
                    </View>

                    <Animated.View style={{ width: 67, height: 25, backgroundColor: 'red' }} 
                      sharedTransitionTag={`tag-subcard-button`}
                    >
                      <Text>ABRIR</Text>
                    </Animated.View>


                  </Animated.View>



                </Animated.View>


            </View>
          </Pressable>
        }
      />
    </View>
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