
import React from 'react';
import { Platform, Pressable, StyleSheet, View, Keyboard, ScrollView, TouchableHighlight, Button as NativeButton } from 'react-native';
import { Text, TextInput, useTheme, Button, IconButton, Divider, Icon } from 'react-native-paper';
import { sharedElementTransition } from '../helpers/SharedElementTransition';
import { RootStackScreenProps } from '../types';
import useAlert from '../handlers/hooks/useAlert';
import { sleep } from '../utils/sleep';

import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetProps, BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import WebView from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionSheet } from '../handlers/ActionSheet';
import { InputSheet } from '../handlers/InputSheet';
import { BottomActionBar } from '../handlers/BottomActionBar';
import { RichTextEditorSheet } from '../handlers/RichTextEditorSheet';
import { SpinnerOverlay } from '../handlers/SpinnerOverlay';
import { ToastFeedback } from '../handlers/ToastFeedback';
import { Snackbar } from '../handlers/Snackbar';
import { ToastNotification } from '../handlers/ToastNotification';

export default function WelcomeScreen({ navigation }: RootStackScreenProps<'Welcome'>) {
  const insets = useSafeAreaInsets();

  const [selecteds, setSelecteds] = React.useState<(string|number)[]>([]);

  const [editMode, setEditMode] = React.useState<boolean>(false);

  React.useEffect(() => {
    const unsubscribe = SpinnerOverlay.open();

    setTimeout(() => {
      unsubscribe();

      ToastFeedback.open({  message: "Success!", duration: 1200 });

    }, 900);

    return () => {
      unsubscribe();
    }
  }, []);

  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: (props) => (
        <Button mode="text"
          onPress={toggleEditMode} 
        >
          {editMode ? "OK" : "Editar"}
        </Button>
      ),
    });
  }, [navigation, editMode]);

  function toggleEditMode (): void {
    setEditMode(editMode => !editMode);
    setSelecteds([]);
  }

  function isSelectd (id: number|string): boolean {
    return !!selecteds.find(selected => selected === id);
  }

  function toggleSelected (id: number|string): void {
    setSelecteds(selecteds => {
      const isSelected = selecteds.find(selected => selected === id);
      if (isSelected) {
        const filtered = selecteds.filter(selected => selected !== id);
        return [...filtered];
      }
      return [...selecteds, id];
    })
  }

  // const [content, setContent] = React.useState("Awesome 🎉");
  const theme = useTheme();
  // ref
  // const bottomSheetInputRef = React.useRef<BottomSheet>(null);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log("foucs in screen");

  //     const unsubscribe = InputSheet.open({
  //       placeholder: "Adicione uma pergunta para...",
  //       // value: "Awesome 🎉",
  //       onSubmit (value) {
  //         console.log({ value });
  //       }
  //     });

  //     return () => unsubscribe();
  //   }, [])
  // );

  React.useEffect(() => {
    if (editMode) {
      BottomActionBar.open({
        disabled: true,
        left: [
          { label: "Editar" },
          { icon: "chevron-up" },
        ],
        description: "foucs in screen",
        right: [
          { icon: "chevron-down" },
          { label: "Excluir" },
        ]
      });
    } else {
      BottomActionBar.close();
    }
  }, [editMode])

  React.useEffect(() => {
    if (selecteds.length) {
      BottomActionBar.enable();
    } else {
      BottomActionBar.disable();
    }
  }, [selecteds])

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

   

  // const runJavaScript = () => {
  //   if (webviewRef.current) {
  //     webviewRef.current.injectJavaScript(`
  //       // Código JavaScript que você deseja executar
  //       if (typeof myFunction === 'function') {
  //         myFunction();
  //       }
  //     `);
  //   }
  // };

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
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}
        keyboardShouldPersistTaps="handled"
      >

      <TouchableHighlight
        underlayColor={theme.colors.elevation.level3}
        disabled={editMode}
        onPress={() => {}}
      >
        <Pressable
          style={[
            { flexDirection: "row", alignItems: "center" },
            { paddingVertical: 12, paddingHorizontal: 20, gap: 12 },
            isSelectd("id") && { backgroundColor: theme.colors.elevation.level5 },
          ]} 
          disabled={!editMode}
          onPress={() => toggleSelected("id")}
        >
          
          {editMode && (
            <Icon 
              color={theme.colors.primary}
              source={
                isSelectd("id") ?
                "check-circle"
                : "checkbox-blank-circle-outline"
              } 
              size={32} 
            />
          )}
          
          <View style={{ flex: 1, minHeight: 120, backgroundColor: "gray" }} />
        </Pressable>
      </TouchableHighlight>

      <Button 
          onPress={() => {
            new Array(20).fill(null).forEach((_, index) => {
              ToastNotification.open({
                type: 'info',
                title: "What is Lorem Ipsum? i: " + index,
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
              })
            });
          }}
      >
        Open Toast Notification
      </Button>
      
      <Button 
          onPress={() => {
            RichTextEditorSheet.open({
              value: "<p>Este é o novo conteúdo <strong>em HTML</strong> para o editor.</p>",
              placeholder: "Digite seu texto aqui...",
              onSubmit(value) {
                console.log({ value });
                
              },
            })
          }}
      >
        Open RichText Editor Sheet
      </Button>

      <Button 
          onPress={() => {
            ToastFeedback.open({
              icon: "check-circle-outline",
              message: "Hey there! I'm a Toast Feedback.",
              duration: 3000,
            });
          }}
      >
        Open Toast Feedback
      </Button>


      <Button 
          onPress={() => {
            Snackbar.open({
              message: "Hey there! I'm a Snackbar.",
              duration: 1200,
              action: {
                label: 'Undo',
                onPress: () => {
                  // Do something
                },
              }
            });
          }}
      >
        Open Snackbar
      </Button>


      <Button 
          onPress={handlePress}
      >
        Open Alert
      </Button>

      <Button 
          onPress={() => navigation.navigate("SignIn")}
      >
        Navigate
      </Button>

      <Button 
          onPress={() => {
            InputSheet.open({
              onSubmit (value) {
                console.log({ value }, "in handle");
              }
            });
          }}
      >
        Open InputSheet
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
        Open ActionSheet
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
