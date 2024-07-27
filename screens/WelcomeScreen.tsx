
import React from 'react';
import { Platform, Pressable, StyleSheet, View, Keyboard, ScrollView } from 'react-native';
import { Text, TextInput, useTheme, Button, IconButton, Divider } from 'react-native-paper';
import { sharedElementTransition } from '../helpers/SharedElementTransition';
import { RootStackScreenProps } from '../types';
import useAlert from '../handlers/hooks/useAlert';
import { sleep } from '../utils/sleep';

import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetProps, BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import WebView from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import useBottomSheetInput from '../handlers/hooks/useBottomSheetInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionSheet } from '../handlers/ActionSheet';

export default function WelcomeScreen({ navigation }: RootStackScreenProps<'Welcome'>) {
  const insets = useSafeAreaInsets();
  const [webViewHeight, setWebViewHeight] = React.useState(100);

  // const [content, setContent] = React.useState("Awesome 🎉");
  const theme = useTheme();
  // ref
  // const bottomSheetInputRef = React.useRef<BottomSheet>(null);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const BottomSheetInput = useBottomSheetInput();

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const unsubscribe = BottomSheetInput.open({
  //       onSubmit (value) {
  //         console.log({ value });
  //       }
  //     });
  
  //     return () => unsubscribe();
  //   }, [])
  // );

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

   
  const script = `
     
  `;

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en" data-bs-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <!-- Include stylesheet -->
        <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />
    </head>
    <body style="margin: 0px;">

      <!-- Create the editor container -->
      <div id="editor">
        <p>Hello World!</p>
        <p>Some initial <strong>bold</strong> text</p>
        <p><br /></p>
      </div>

      <!-- Include the Quill library -->
      <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>

      <!-- Initialize Quill editor -->
      <script>
        function main () {
          // window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);

          var rect = document.body.getBoundingClientRect();

          window.ReactNativeWebView.postMessage(rect.height);
        }

        const quill = new Quill('#editor', {
          theme: 'snow'
        });

        quill.on('text-change', function(delta, oldDelta, source) {
          console.log('Conteúdo do Quill alterado:', quill.root.innerHTML);

          main();
        });

        setTimeout(main, 500);

      </script>
    </body>
  </html>
`;

  React.useEffect(() => {
    const unsubscribe = ActionSheet.on('change', ({ type, config, option }) => {
      if (config!.id === 'welcomeActionSheet') {
        console.log({ option });
      }
    });

    return () => {
      unsubscribe();
    }
  }, [])


  return (
    <>
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}>

      <View style={[{ width: "100%", height: webViewHeight }]}>
        <WebView bounces={false}
          scrollEnabled={false}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          javaScriptEnabled={true}

          injectedJavaScript={script}
          onMessage={(event) => {
            const height = parseInt(event.nativeEvent.data);

            console.log({ height });
            
            // Ajuste o tamanho do WebView com base na altura recebida
            setWebViewHeight(height);
          }}
          style={{ flex: 1 }}
        />
      </View>
      
      <Button 
          onPress={handlePress}
      >
        Handle Test
      </Button>

      <Button 
          onPress={() => {
            // bottomSheetRef.current?.expand();
            Keyboard.dismiss();
            ActionSheet.open({
              id: 'welcomeActionSheet',
              title: 'Silenciar notificações',
              description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ',
              onChangeOption(option) {
                
              },
              onClose() {

              },
              options: [
                { 
                  icon: 'camera', 
                  label: '8 horas', 
                  value: '1', 
                  onPress() {

                  }
                },
                { 
                  icon: 'camera', 
                  label: '1 semana', 
                  value: '2',
                  onPress() {
                    
                  }
                },
                { 
                  icon: 'camera', 
                  label: 'Sempre', 
                  value: '3',
                  onPress() {
                    
                  }
                },
              ]
            });
          }}
      >
        Open Modal
      </Button>

      </ScrollView>
{/* 
      <BottomSheet
        ref={bottomSheetInputRef}
        index={0}
        // backdropComponent={BottomSheetBackdrop}
        backdropComponent={(props) => (
          <CustomBottomSheetBackdropBackdrop {...props} />
        )}
        backgroundStyle={{ backgroundColor: theme.colors.background, borderRadius: 0 }}
        enableDynamicSizing // deixa setado com a tamanho interno
        enablePanDownToClose={false} // não deixa fechar com gesto.
        keyboardBehavior="interactive" // sobe junto com o keyboard.
        keyboardBlurBehavior="restore" // volta para o lugar quando faz dimiss no keyboard;
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        handleComponent={null}
        android_keyboardInputMode="adjustResize"
        onClose={() => {
          bottomSheetInputRef.current?.expand();
        }}
      >
        <BottomSheetScrollView 
          // scrollEnabled={false} 
          // pinchGestureEnabled={false}
          bounces={false}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="always"
        >
          <View style={[styles.contentContainer]}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
                <TextInput style={styles.textInput}
                  // label="Email"
                  // label=""
                  placeholder="Adicione uma pergunta para..."
                  defaultValue="Awesome 🎉"
                  // value={content}
                  // onChangeText={text => setContent(text)}
                  mode="outlined"
                  contentStyle={{ paddingTop: 18}}
                  multiline
                  render={props => (
                    <BottomSheetTextInput {...props} ref={props.ref as any} />
                  )}
                />
                <IconButton mode="contained"
                  icon="send"
                  onPress={handlePress}
                />
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet> */}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        // backdropComponent={BottomSheetBackdrop}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} 
            style={[props.style, { backgroundColor: 'rgba(0,0,0,.2)' }]}
            appearsOnIndex={0} 
            disappearsOnIndex={-1} 
          />
        )}
        backgroundStyle={[
          { backgroundColor: theme.colors.background },
          { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }
        ]}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.outline
        }}
        enableDynamicSizing // deixa setado com a tamanho interno
        enablePanDownToClose
        keyboardBehavior="interactive" // sobe junto com o keyboard.
        keyboardBlurBehavior="restore" // volta para o lugar quando faz dimiss no keyboard;
        // enableHandlePanningGesture={false}
        // enableContentPanningGesture={false}
        handleComponent={null}
        android_keyboardInputMode="adjustResize"
        // bottomInset={90}
        // onChange={() => {
        //   Keyboard.dismiss();
        // }}
        // onClose={() => {
        //   Keyboard.dismiss();
        // }}
      >
        <BottomSheetScrollView 
          // scrollEnabled={false} 
          // pinchGestureEnabled={false}
          bounces={false}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="always"
        >
          <View style={[styles.contentContainer, { gap: 20 }]}>

            <View style={{ flexDirection: 'row', position: 'relative' }}>

              <Text style={[
                { flex: 1, textAlign: 'center', fontWeight: '700', alignSelf: 'center' },
                { marginTop: 6, paddingHorizontal: 60 }
              ]}
                variant="titleMedium"
              >
                Silenciar notificações
              </Text>

              <IconButton style={{ position: 'absolute', top: 0, right: 0, margin: 0 }}
                icon="close"
                mode="contained"
                size={20}
                onPress={() => bottomSheetRef?.current?.close()}
              />
            </View>

            <View style={[
              { borderRadius: 10, overflow: 'hidden', backgroundColor: theme.colors.elevation.level1 },
              { padding: 16 }
            ]}>
              <Text style={{ color: theme.colors.outline }}>
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
              </Text>
            </View>

            <View style={[
              { borderRadius: 10, overflow: 'hidden', backgroundColor: theme.colors.elevation.level1 },
            ]}>
              <Button style={{ borderRadius: 0 }}
                contentStyle={{ justifyContent: 'flex-start', padding: 4 }} 
                // icon="camera"
                labelStyle={{ fontSize: 16 }} 
                mode="text" 
                onPress={() => console.log('Pressed')}
              >
                8 horas
              </Button>
              <Divider leftInset />
              <Button style={{ borderRadius: 0 }} 
                contentStyle={{ justifyContent: 'flex-start', padding: 4 }} 
                // icon="camera" 
                labelStyle={{ fontSize: 16 }} 
                mode="text" 
                onPress={() => console.log('Pressed')}
              >
                1 semana
              </Button>
              <Divider leftInset />
              <Button style={{ borderRadius: 0 }} 
                contentStyle={{ justifyContent: 'flex-start', padding: 4 }} 
                // icon="camera" 
                labelStyle={{ fontSize: 16 }} 
                mode="text" 
                onPress={() => console.log('Pressed')}
              >
                Sempre
              </Button>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
}


const CustomBottomSheetBackdropBackdrop = (props: BottomSheetBackdropProps) => {
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // O teclado está aberto
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // O teclado está fechado
      }
    );

    // Limpar os listeners ao desmontar o componente
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (!isKeyboardVisible) return null;

  return (
    <BottomSheetBackdrop {...props} 
      style={[props.style, { backgroundColor: 'transparent' }]}
      onPress={() => {
        Keyboard.dismiss();
      }}
      appearsOnIndex={0} 
      disappearsOnIndex={-1} 
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 24,
    // backgroundColor: "grey",
  },
  sheetContainer: {
    // add horizontal space
    // borderRadius: 20,
    // marginHorizontal: 24,
    // overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    // alignItems: "center",
    padding: 16,
  },
  textInput: {
    flex: 1,
    // alignSelf: "stretch",
    // padding: 12,
    // borderRadius: 12,
    // backgroundColor: "grey",
    // color: "white",
    // textAlign: "center",
  },
});
