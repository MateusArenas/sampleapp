import { Platform, Pressable, StyleSheet, Button } from 'react-native';

import { Text, View } from '../components/Themed';
import React from 'react';
import { sharedElementTransition } from '../helpers/SharedElementTransition';
import { RootStackScreenProps } from '../types';
import useAlert from '../handlers/hooks/useAlert';
import { sleep } from '../utils/sleep';

import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";

export default function WelcomeScreen({ navigation }: RootStackScreenProps<'Welcome'>) {
  // ref
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // variables
  const snapPoints = React.useMemo(() => ["25%"], []);

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
    <>
      <View style={styles.container}>
      
      <Button 
          title="Handle Test"
          onPress={handlePress}
      />

      </View>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        // keyboardBehavior="fillParent"
        // keyboardBlurBehavior="none"
        // android_keyboardInputMode="adjustPan"
        // add bottom inset to elevate the sheet
        bottomInset={46}
        // set `detached` to true
        detached={true}
        style={styles.sheetContainer}
        index={0}
      >
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
          <BottomSheetTextInput value="Awesome 🎉" style={styles.textInput} />
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  sheetContainer: {
    // add horizontal space
    borderRadius: 20,
    marginHorizontal: 24,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  textInput: {
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "grey",
    color: "white",
    textAlign: "center",
  },
});
