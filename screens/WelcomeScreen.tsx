import { Platform, Pressable, StyleSheet, Button } from 'react-native';

import { Text, View } from '../components/Themed';
import React from 'react';
import { sharedElementTransition } from '../helpers/SharedElementTransition';
import { RootStackScreenProps } from '../types';
import useAlert from '../handlers/hooks/useAlert';
import { sleep } from '../utils/sleep';

export default function WelcomeScreen({ navigation }: RootStackScreenProps<'Welcome'>) {
  const Alert = useAlert();

  const handlePress = async () => {
    try {
      
      let isAllowed = true;
  
      const loading = Alert.loading({
        title: "Loading...",
        subtitle: "Do you wish to continue?",
        cancelMessage: "Cancel",
        cancelable: true,
        // progress: 0,
        cancel: () => { // cancela a request.
          console.log("Alert is canceled.");
          isAllowed = false;
        },
      });

      await sleep(900);
      loading.setProgress(.2);
      await sleep(900);
      loading.setProgress(.4);
      await sleep(900);
      loading.setProgress(.6);
      await sleep(900);
      loading.setProgress(.8);
      await sleep(900);
      loading.setProgress(1);
      await sleep(900);

      if (!isAllowed) return;
  
      loading.hide();
  
      Alert.loading();
  
      await sleep(3000);
  
      isAllowed = await Alert.confirm({
        title: "Hello World!",
        subtitle: "Do you wish to continue?",
        confirmMessage: "Allow",
        cancelMessage: "Deny",
      });
  
      if (isAllowed) {
        console.log("Alert is allowed!");
      } else {
        console.log("Alert is denyed.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
     
        <Button 
            title="Handle Test"
            onPress={handlePress}
        />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: 'blue'
  },
});
