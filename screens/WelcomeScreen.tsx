
import React from 'react';
import { Platform, Image, Pressable, StyleSheet, View, Keyboard, ScrollView, TouchableHighlight, Button as NativeButton, KeyboardAvoidingView, TouchableOpacity, Modal, TextStyle } from 'react-native';
import { Text, TextInput, useTheme, Button, IconButton, Divider, Icon, Searchbar, Avatar, ToggleButton } from 'react-native-paper';
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
import Animated, { KeyboardState, useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import AwesomeCard from '../components/AwesomeCard/AwesomeCard';
import { Calendar } from '../handlers/Calendar';

export default function WelcomeScreen({ navigation }: RootStackScreenProps<'Welcome'>) {
  const insets = useSafeAreaInsets();

  const [selecteds, setSelecteds] = React.useState<(string|number)[]>([]);

  const [editMode, setEditMode] = React.useState<boolean>(false);

  const [bottomActionBar, setBottomActionBar] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = BottomActionBar.on("height", ({ visible, height }) => {
      setBottomActionBar(visible ? height : 0);
    });

    return () => {
      unsubscribe();
    }
  }, [])

  const [inputSheetHeight, setInputSheetHeight] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = InputSheet.on("height", ({ visible, height }) => {
      setInputSheetHeight(visible ? height : 0);
    });

    return () => {
      unsubscribe();
    }
  }, [])

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
    // Keyboard.dismiss(); // deixar obrigatório. para não conflitar com o tamanho do keyboard.
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
          { label: "Excluir" },
          { icon: "chevron-up" },
        ],
        description: "foucs in screen",
        right: [
          { icon: "chevron-down" },
          { 
            label: "Editar",
            onPress: () => {
              ActionSheet.open({
                id: 'subActionSheet',
                title: 'Silenciar notificações',
                description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ',
                options: [
                  { 
                    icon: 'camera', 
                    label: '8 horas', 
                    value: '1', 
                    onPress: () => {
                      const unsubscribe = InputSheet.open({
                        icon: "square-edit-outline",
                        label: "Descrição da Notícia (em edição)",
                        value: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered",
                        autoFocus: true,
                        dismissible: true,
                        onSubmit (value) {
                          console.log({ value }, "in handle");
                          unsubscribe();
                          ToastFeedback.open({
                            icon: "check-circle-outline",
                            message: "Hey there! I'm a Toast Feedback.",
                            duration: 3000,
                          });
                        }
                      });
                    }
                  },
                ]
              });
            }
          },
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

  const keyboad = useAnimatedKeyboard();

  const animatedContainerStyle = useAnimatedStyle(() => {
    return { paddingBottom: keyboad.height.value + inputSheetHeight + bottomActionBar };
  }, [inputSheetHeight, bottomActionBar])

  const [status, setStatus] = React.useState<"checked" | "unchecked" | undefined>('checked');

  const onButtonToggle = (value: any) => {
    setStatus(status === 'checked' ? 'unchecked' : 'checked');
  };


  const [date, setDate] = React.useState('2024-08-06');

  return (
      <Animated.View style={[
        styles.container, 
        animatedContainerStyle,
        {  backgroundColor: theme.colors.background },
      ]}>

        <ScrollView style={[styles.container]}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          contentContainerStyle={[
            { flexGrow: 1 },
          ]}
        >

          <View style={{ flexDirection: "row", padding: 16, alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1 }}>
              <Text style={[{ color: theme.colors.onSurfaceDisabled }]}
                variant="labelSmall"
              >
                SELECIONE A DATA
              </Text>
              <Text style={[{ color: theme.colors.onSurface }]}
                variant="headlineSmall"
              >
                {Calendar.formatToLongDate(date)}
              </Text>
            </View>
            <IconButton style={{ margin: 0, alignSelf: "center" }}
              icon="calendar"
              mode="contained"
              size={24}
              disabled={editMode}
              onPress={() => {
                Calendar.open({
                  selectedDate: "2024-08-06",
                  onSelected(date) {
                    console.log({ date });
                    setDate(date);
                  },
                });
              }}
            />
          </View>

        <View style={[{ flexDirection: "row", justifyContent: "space-between", gap: 12, padding: 16 }]}>
            <Searchbar style={[{ flexGrow: 1, maxHeight: 40 }]}
              inputStyle={{ padding: 0, alignSelf: "center" }}
              value=''
              placeholder='Buscar'
            />

            <View style={[
              { borderRadius: 100, overflow: "hidden" },
              { backgroundColor: theme.colors.elevation.level1 },
            ]}>
              <ToggleButton style={[
                { margin: 0, alignSelf: "center", borderRadius: 100 },
                { height: 40, width: 40 },
              ]}
                icon="filter"
                iconColor={theme.colors.primary}
                // mode="contained"
                disabled={editMode}
                value="bluetooth"
                size={24}
                status={status}
                onPress={onButtonToggle}
              />
            </View>
          </View>

        <Divider />

        <AwesomeCard
          mode={isSelectd("id") ? "selected" : undefined}
          onPress={() => {
            if (editMode) {
              toggleSelected("id");
            } else {
              navigation.navigate("SignIn");
            }
          }}
        >
            {editMode && (
              <AwesomeCard.CheckboxIcon
                checked={isSelectd("id")}
              />
            )}
            
            <AwesomeCard.Row >

              <AwesomeCard.Avatar style={{ borderRadius: 8 }}
                source={{
                  uri: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=1380&t=st=1722611925~exp=1722612525~hmac=57bf584fbd7dd5e3a4ddd0a128f8496522bf57cbfdc58182d6d8e5c46a0142eb"
                }}
              />

              <AwesomeCard.Content >
                  <AwesomeCard.Header >
                    <AwesomeCard.Title>
                      Título da Notícia
                    </AwesomeCard.Title>

                    <AwesomeCard.Status >
                      Não respondida
                    </AwesomeCard.Status>
                  </AwesomeCard.Header>
                  <AwesomeCard.Row>
                    <AwesomeCard.Body >
                      <AwesomeCard.Link 
                        disabled={editMode}
                        onPress={() => console.log("Open Category")}
                      >
                        Categoria
                      </AwesomeCard.Link>
                      <AwesomeCard.Description >
                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered
                      </AwesomeCard.Description>
                      <AwesomeCard.Link 
                        disabled={editMode}
                        onPress={() => console.log("Open Quetsions")}
                      >
                        Ver as perguntas realizadas
                      </AwesomeCard.Link>
                    </AwesomeCard.Body>

                    <AwesomeCard.ActionIconButton 
                      disabled={editMode}
                      icon="star"
                      label="+99"
                      onPress={() => console.log("Press in Icon Right")}
                    />
                
                </AwesomeCard.Row>
                <AwesomeCard.Footer >
                  <TouchableOpacity
                    disabled={editMode}
                    activeOpacity={0.7}
                    onPress={() => {
                      console.log("Press in Creator");
                    }}
                  >
                    <AwesomeCard.Row style={[{ alignItems: "center", gap: 8 }]}>
                      <AwesomeCard.Avatar 
                        size={24}
                        source={{
                          uri: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=1380&t=st=1722611925~exp=1722612525~hmac=57bf584fbd7dd5e3a4ddd0a128f8496522bf57cbfdc58182d6d8e5c46a0142eb"
                        }}
                      />
                      <AwesomeCard.Description 
                        variant="labelSmall" 
                      >
                        Criado por Fulano. em 01 de fevereiro de 2024, às 15:00.
                      </AwesomeCard.Description>
                    </AwesomeCard.Row>
                  </TouchableOpacity>
                </AwesomeCard.Footer>
              </AwesomeCard.Content>
            </AwesomeCard.Row>
        </AwesomeCard>

        <Divider />


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
            onPress={() => {
              Alert.custom({
                type: "info",
                title: "Hello World!",
                subtitle: "Do you wish to continue?",
                dismissable: true,
                buttons: [
                  {
                    label: "Permitir Copiar",
                    onPress() {

                    }
                  },
                  {
                    label: "Permitir Copiar2",
                    onPress() {

                    }
                  },
                  {
                    label: "Permitir Copiar3",
                    onPress() {

                    }
                  },
                ],
              })
            }}
        >
          Open Custom Alert
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
                  ActionSheet.open({
                    id: 'subActionSheet',
                    title: option!.label,
                    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ',
                    options: [
                      { 
                        icon: 'camera', 
                        label: '8 horas', 
                        value: '1', 
                        onPress() {
    
                        }
                      },
                    ]
                  });
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
      </Animated.View>
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
