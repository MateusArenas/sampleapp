import React from 'react';
import { StyleSheet, Pressable, TouchableHighlight, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import AuthContext from '../contexts/auth';
import { apiHandler } from '../services/apiHandler';
import Animated from 'react-native-reanimated';
import { sharedElementTransition } from '../helpers/SharedElementTransition';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const { signOut } = React.useContext(AuthContext);


  console.log({ TabOneScreen: 'render' });
  
  return (
    <View style={styles.container}>

      <Animated.View
        style={{ width: 100, height: 100, backgroundColor: 'green', marginTop: 100 }}
        sharedTransitionTag="sharedTag"        
        // sharedTransitionStyle={sharedElementTransition}
      />
     
     <Pressable onPress={() => signOut()}>
        {({ pressed }) => (
          <Text style={[pressed && { color: 'red' }, { marginBottom: 30}]}>signOut</Text>
        )}
      </Pressable>

      <Pressable onPress={() => apiHandler.helloWorld()}>
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
    alignItems: 'center',
    justifyContent: 'center',
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
