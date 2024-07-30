
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

export default function WelcomeScreen({ navigation }: RootStackScreenProps<'Welcome'>) {
  const insets = useSafeAreaInsets();

  const webviewRef = React.useRef<WebView>(null);
  const [webViewHeight, setWebViewHeight] = React.useState(100);

  const [selecteds, setSelecteds] = React.useState<(string|number)[]>([]);

  const [editMode, setEditMode] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: (props) => (
        <NativeButton color={props.tintColor}
          title={editMode ? "OK" : "Editar"}
          onPress={toggleEditMode} 
        />
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

          <style>
              #send {
                position: absolute; 
                bottom: 10px; 
                right: 10px; 
                display: flex; 
                align-items: center; /* Centraliza o texto verticalmente */
                justify-content: center; /* Centraliza o texto horizontalmente */
                padding: 8px 8px; 
                border-width: 0px;
                border-radius: 4px;

                font-size: 16px; /* Adicionando um tamanho de fonte para melhor visualização */
                cursor: pointer; /* Indica que é um botão clicável */
                background-color: #007bff;
                color: #fff;
              }

              #send:hover {
                background-color: #0056b3; /* Azul mais escuro para hover */
                box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* Aumenta a sombra para um efeito mais profundo */
              }

              #send:active {
                background-color: #003d7a; /* Azul ainda mais escuro para click */
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Ajusta a sombra para o estado de clique */
              }

              #send:disabled {
                background-color: #c0c0c0; /* Cor de fundo cinza claro para indicar desativado */
                color: #6c757d; /* Cor do texto cinza para contraste */
                cursor: not-allowed; /* Cursor de não permitido para indicar que o botão está desativado */
                box-shadow: none; /* Remove a sombra para um efeito mais plano */
                transform: none; /* Remove qualquer transformação aplicada no estado de clique */
                opacity: 0.65; /* Diminui a opacidade para indicar que está desativado */
              }

              #editor {
                min-height: 60px;
              }
          </style>
      </head>
      <body style="margin: 0px; position: relative;">

        <!-- Create the editor container -->
        <div id="editor">
          <p>Hello World!</p>
          <p>Some initial <strong>bold</strong> text</p>
          <p><br /></p>
        </div>

        <button
          id="send"
          type="button"
        >
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m476.59 227.05-.16-.07L49.35 49.84A23.56 23.56 0 0 0 27.14 52 24.65 24.65 0 0 0 16 72.59v113.29a24 24 0 0 0 19.52 23.57l232.93 43.07a4 4 0 0 1 0 7.86L35.53 303.45A24 24 0 0 0 16 327v113.31A23.57 23.57 0 0 0 26.59 460a23.94 23.94 0 0 0 13.22 4 24.55 24.55 0 0 0 9.52-1.93L476.4 285.94l.19-.09a32 32 0 0 0 0-58.8z"></path></svg>
        </button>

        <!-- Include the Quill library -->
        <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>

        <!-- Initialize Quill editor -->
        <script>

          function main () {
            // window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);

            var rect = document.body.getBoundingClientRect();

            const data = { type: "height", height: rect.height };
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
          }

          const quill = new Quill('#editor', {
            theme: 'snow'
          });

          function getPlainText() {
              return quill.getText().trim(); // Obtém o texto e remove espaços em branco nas extremidades
          }

          quill.on('text-change', function(delta, oldDelta, source) {
            const text = getPlainText();
            console.log('Conteúdo do Quill alterado:', quill.root.innerHTML, { delta, oldDelta, source, text: text.length });


            var sendButtonEl = document.getElementById('send');

            console.log(sendButtonEl);

            
            if (text) {
              console.log('enabled');
              sendButtonEl.removeAttribute('disabled');
            } else {
              console.log('disabled');
              sendButtonEl.setAttribute('disabled', true);
            }

            main();
          });
          
          setTimeout(main, 500);

          function onSubmit () {
              const html = quill.root.innerHTML;
              const text = quill.getText();
              const delta = quill.getContents();

              const data = { type: "submit", html, text, delta };
              console.log({ data });
              window.ReactNativeWebView.postMessage(JSON.stringify(data));

              quill.root.innerHTML = '';
          }

          document.getElementById('send').addEventListener('click', onSubmit);

          function setValue(html = '<p>Este é o novo conteúdo <strong>em HTML</strong> para o editor.</p>') {
              quill.root.innerHTML = html;
          }

        </script>
      </body>
    </html>
  `;

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

      <View style={[{ width: "100%", height: webViewHeight }]}>
        <WebView 
          ref={webviewRef}
          bounces={false}
          scrollEnabled={false}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          javaScriptEnabled={true}
          injectedJavaScript={script}
          onMessage={(event) => {
            const data = JSON.parse(event.nativeEvent.data);

            switch (data.type) {
              case "height":
                const height = parseInt(data.height);
                console.log({ height });
                // Ajuste o tamanho do WebView com base na altura recebida
                setWebViewHeight(height);
                break;
              case "submit":
                const html = String(data.html);
                console.log({ html });
                break;
              default:
                break;
            }
          }}
          style={{ flex: 1 }}
        />
      </View>

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
