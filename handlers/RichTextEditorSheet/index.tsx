import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView, BottomSheetTextInput, useBottomSheet, useBottomSheetInternal } from '@gorhom/bottom-sheet';
import React from 'react';
import * as Haptics from 'expo-haptics'
import { Keyboard, View, StyleSheet, TextInput as NativeTextInput, ViewStyle, StyleProp, Pressable, Dimensions } from 'react-native';
import { TextInput, IconButton, useTheme, MD3Theme } from 'react-native-paper';
import { event } from '../../services/event';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Extrapolate, interpolate, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import WebView from 'react-native-webview';

export interface RichTextEditorSheetConfig {
  onSubmit?: (value: string) => Promise<void> | void;
  placeholder?: string;
  value?: string;
} 

export interface RichTextEditorSheetMethods {
  open(config: RichTextEditorSheetConfig): () => void;
  close(): void;
  on(type: string, fn: (event: RichTextEditorSheetEvent) => void): () => void
} 

export interface RichTextEditorSheetEvent {
  type: string; 
  config?: RichTextEditorSheetConfig;
}

export interface RichTextEditorSheetProps {
  bottomInset: number;
  theme: MD3Theme;
} 

export const RichTextEditorSheetHandler = React.forwardRef<RichTextEditorSheetMethods, RichTextEditorSheetProps>(({
  bottomInset,
  theme,
}, ref) => {
  const [config, setConfig] = React.useState<RichTextEditorSheetConfig | undefined>({});
  const [index, setIndex] = React.useState<number>(-1);
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const RichTextEditorSheetRef = React.useRef<BottomSheet>(null);

  const richTextEditorRef = React.useRef<RichTextEditorMethods>(null);

  function onSubmit (value: string) {
    config?.onSubmit?.(value);
    Keyboard.dismiss();
  }

  const methods = React.useMemo(() => ({
    open (config?: RichTextEditorSheetConfig) {
      setConfig(config);

      RichTextEditorSheetRef.current?.expand();
      // Força a abertura inicial para corrigir um problema que ocorre quando o componente é exibido imediatamente.
      // Isso garante que a animação ocorra corretamente na primeira montagem.      
      setIndex(0);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
      
      return () => this.close();
    },
    close () {
      RichTextEditorSheetRef.current?.forceClose();

      setConfig({});

      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Soft
      );
    },
    on(type: string, fn: (event: any) => void) {
      event.on(`richTextEditorSheet:${type}`, fn);
  
      return () => {
        event.off(`richTextEditorSheet:${type}`, fn);
      };
    }
  }), [RichTextEditorSheetRef])


  React.useImperativeHandle(ref, () => methods, [methods]);

  function onRichTextEditorSheetEvent (event: RichTextEditorSheetEvent) {
    switch (event.type) {
      case 'open':
        methods.open(event?.config);
        break;
      case 'close':
        methods.close();
        break;
      default:
        break;
    }
  }

  React.useEffect(() => {
    const unsubscribe = methods.on('root', onRichTextEditorSheetEvent);

    return () => {
      unsubscribe();
    };
  }, [onRichTextEditorSheetEvent, methods]);

  return (
    <BottomSheet
      ref={RichTextEditorSheetRef}
      index={index}
      backdropComponent={props => (
        <KeyboardBottomSheetBackdrop {...props} 
          isFocused={isFocused} 
          onPress={() => richTextEditorRef.current?.dismiss()}
        />
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
      bottomInset={bottomInset}
      onChange={(index) => {
        // console.log("onChange", { index });
      }}
      onClose={() => {
        // console.log("onClose");
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
                <RichTextEditor style={styles.textInput}
                  ref={richTextEditorRef}
                  // label="Email"
                  theme={theme}
                  placeholder={config?.placeholder}
                  value={config?.value}
                  onFocus={() => setIsFocused(true)}
                  // onBlur={() => setIsFocused(false)}
                  onDismiss={() => setIsFocused(false)}
                  onSubmit={onSubmit}
                />
            </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  )
})

interface RichTextEditorProps {
  theme: MD3Theme;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  value?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: (value: string) => void;
  onDismiss?: () => void;
}

interface RichTextEditorMethods {
  dismiss: () => void;
}

const RichTextEditor = React.forwardRef<RichTextEditorMethods, RichTextEditorProps>(({
  theme,
  placeholder = " ",
  value, // Renomeie para evitar confusão
  onSubmit,
  onDismiss,
  onFocus,
  onBlur,
}, ref) => {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

  React.useEffect(() => {
    return () => {
      // Reset the flag on unmount
      shouldHandleKeyboardEvents.value = false;
    };
  }, [shouldHandleKeyboardEvents]);
  //#endregion

  //#region callbacks
  const handleOnFocus = React.useCallback(
    () => {
      shouldHandleKeyboardEvents.value = true;
      if (onFocus) {
        onFocus();
      }
    },
    [onFocus, shouldHandleKeyboardEvents]
  );
  const handleOnBlur = React.useCallback(
    () => {
      shouldHandleKeyboardEvents.value = false;
      if (onBlur) {
        onBlur();
      }
    },
    [onBlur, shouldHandleKeyboardEvents]
  );
  //#endregion
  
  const webviewRef = React.useRef<WebView>(null);
  const [webViewHeight, setWebViewHeight] = React.useState(100);


  React.useImperativeHandle(ref, () => ({
    dismiss() {
      webviewRef.current?.injectJavaScript(`
        document.activeElement.blur(); // Remove o foco do elemento ativo
        Array.from(document.querySelectorAll('input, textarea')).forEach(el => el.blur()); // Remove o foco de todos os inputs e textareas
      `);
      onDismiss?.();
    }
  }), [])

  const script = `
     
  `;

  const styleDark = `
       html {
        background: ${theme.colors.background} !important;
        color: #cacaca !important;
      }

      * {
        font-size: 1.1em;
      }

      .ql-toolbar.ql-snow {
        border: 1px solid ${theme.colors.outlineVariant} !important;
        border-right-width: 0px !important;
        border-left-width: 0px !important;
      }

      .ql-container.ql-snow {
        border: 1px solid ${theme.colors.outlineVariant} !important;
      }

      #editor {
        border-top-width: 0px !important;
        border-width: 0px !important;
      }

      .ql-editor {
        border-top-width: 0px !important;
        border-right-color: ${theme.colors.outlineVariant} !important;
      }

      .ql-snow.ql-toolbar button .ql-stroke {
        stroke: ${theme.colors.outline};
      }

      .ql-snow.ql-toolbar button.ql-active .ql-stroke {
        stroke: ${theme.colors.primary};
      }

      .ql-snow.ql-toolbar button .ql-fill {
        fill: ${theme.colors.outline};
      }

      .ql-snow.ql-toolbar button.ql-active .ql-fill {
        fill: ${theme.colors.primary};
      }

      .ql-snow .ql-picker {
        color: ${theme.colors.outline};
      }

      .ql-snow .ql-stroke {
        stroke: ${theme.colors.outline};
      }

      .ql-snow .ql-picker .ql-picker-label {
        color: ${theme.colors.outline};
      }

      .ql-snow .ql-picker .ql-picker-label.ql-active {
        color: ${theme.colors.primary};
      }

      .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {
        border-color: ${theme.colors.outlineVariant} !important;
      }

      .ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
        stroke: ${theme.colors.outline};
      }

      .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke {
        stroke: ${theme.colors.primary};
      }


      .ql-snow.ql-toolbar .ql-picker-item:hover {
        color: ${theme.colors.primary};
      }

      .ql-picker-options {
        z-index: 9999;
      }

      .ql-snow.ql-toolbar .ql-picker-item.ql-selected {
        color: ${theme.colors.primary} !important;
      }

      .ql-picker-options {
        background: ${theme.colors.background} !important;
        color: #cacaca !important;
        border: 1px solid ${theme.colors.outlineVariant} !important;
      }

      .ql-snow .ql-tooltip {
        background-color: ${theme.colors.background} !important;
        border: 1px solid ${theme.colors.outlineVariant} !important;
        box-shadow: 0 0 5px rgba(200,200,200,.2);
        color: ${theme.colors.outline} !important;
      }

      .ql-snow .ql-tooltip input[type=text] {
        border: 1px solid ${theme.colors.outlineVariant} !important;
        background-color: ${theme.colors.background} !important;
        color: ${theme.colors.outline} !important;
      }

      .ql-snow .ql-picker-options .ql-picker-item {
        padding-bottom: 4px;
        padding-top: 0px;
      }

      .ql-snow .ql-picker {
      }

      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
        font-size: 1.25em;
      }

      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
        font-size: 1.15em;
      }

      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
        font-size: 1.05em;
      }

      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
        font-size: .95em;
      }

      .ql-snow .ql-picker.ql-header .ql-picker-label::before, .ql-snow .ql-picker.ql-header .ql-picker-item::before {
        content: 'Normal';
      }

      .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
          content: 'Salvar';
      }

      .ql-snow .ql-tooltip[data-mode=link]::before {
        content: "Por link:";
      }

      .ql-snow .ql-picker-options {
        overflow-y: auto;
        height: 60vh !important;
        min-height: 66px;
        max-height: 110px;
      }

      #editor {
        min-height: 56px;

        padding-right: 60px;
      }

      .ql-editor {
        min-height: 56px;

        max-height: ${Dimensions.get("screen").height / 2}px;
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: #ccc;

        height: 100%;
      }


    .ql-editor.ql-blank::before {
        color: ${theme.colors.outline} !important;
        content: attr(data-placeholder);
        left: 16px;
        pointer-events: none;
        position: absolute;
        right: 16px;
        font-style: normal;
        opacity: .8;
        font-size: 1.2em;
    }
  `;


  console.log({ dark: theme.dark  });
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <!-- Include stylesheet -->
      <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />

      <!-- Include the Quill library -->
      <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>

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
            background-color: ${theme.colors.onPrimary};
            color: #fff;
          }

          #send:hover {
            background-color: #0056b3; /* Azul mais escuro para hover */
            box-shadow: 0 6px 8px ${theme.colors.primary}; /* Aumenta a sombra para um efeito mais profundo */
          }

          #send:active {
            background-color: #003d7a; /* Azul ainda mais escuro para click */
            box-shadow: 0 2px 4px ${theme.colors.primary}; /* Ajusta a sombra para o estado de clique */
          }

          #send:disabled {
            background-color: ${theme.colors.elevation.level2}; /* Cor de fundo cinza claro para indicar desativado */
            color: ${theme.colors.outline}; /* Cor do texto cinza para contraste */
            cursor: not-allowed; /* Cursor de não permitido para indicar que o botão está desativado */
            box-shadow: none; /* Remove a sombra para um efeito mais plano */
            transform: none; /* Remove qualquer transformação aplicada no estado de clique */
            opacity: 0.65; /* Diminui a opacidade para indicar que está desativado */
          }


          /* Para navegadores Webkit */
          ::-webkit-scrollbar {
            width: 4px; /* Largura da scrollbar */
            height: 4px; /* Altura da scrollbar para scroll horizontal */
          }

          ::-webkit-scrollbar-track {
            background: transparent !important; /* Cor do fundo da scrollbar */
          }

          ::-webkit-scrollbar-thumb {
            background: #c1bcbc !important; /* Cor do polegar da scrollbar */
            border-radius: 6px; /* Borda arredondada para o polegar */
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #a09b9b !important; /* Cor do polegar quando hover */
          }

          /* Para Firefox */
          * {
            scrollbar-width: thin;          /* "auto" or "thin" */
            scrollbar-color: #c1bcbc transparent !important;   /* scroll thumb and track */
          }
          
          /* Para Internet Explorer e Edge (versões antigas) */
          body {
            scrollbar-face-color: #c1bcbc !important; /* Cor do polegar */
            scrollbar-track-color: transparent; /* Cor do fundo da scrollbar */
            scrollbar-shadow-color: transparent; /* Cor da sombra */
            scrollbar-highlight-color: transparent; /* Cor do destaque */
            scrollbar-3dlight-color: transparent; /* Cor da luz 3D */
            scrollbar-darkshadow-color: transparent; /* Cor da sombra escura */
          }

      @media (prefers-color-scheme: light) {
        ::-webkit-scrollbar {
          width: 12px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #c1bcbc;
          border-radius: 6px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a09b9b;
        }
      }

      @media (prefers-color-scheme: dark) {
        ::-webkit-scrollbar {
          width: 12px;
        }
        ::-webkit-scrollbar-track {
          background: #333333;
        }
        ::-webkit-scrollbar-thumb {
          background: #666666;
          border-radius: 6px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #888888;
        }
      }

      ${styleDark}

      </style>
  </head>
  <body style="margin: 0px; position: relative;">

    <!-- Create the editor container -->
    <div id="editor">
      ${value}
    </div>

    <button
      id="send"
      type="button"
    >
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m476.59 227.05-.16-.07L49.35 49.84A23.56 23.56 0 0 0 27.14 52 24.65 24.65 0 0 0 16 72.59v113.29a24 24 0 0 0 19.52 23.57l232.93 43.07a4 4 0 0 1 0 7.86L35.53 303.45A24 24 0 0 0 16 327v113.31A23.57 23.57 0 0 0 26.59 460a23.94 23.94 0 0 0 13.22 4 24.55 24.55 0 0 0 9.52-1.93L476.4 285.94l.19-.09a32 32 0 0 0 0-58.8z"></path></svg>
    </button>

    <!-- Initialize Quill editor -->
    <script>

      function main () {
        // window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);

        var rect = document.body.getBoundingClientRect();

        const data = { type: "height", height: rect.height };
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      }

      const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
          toolbar: true,
        },
      });

      // Configura o placeholder customizado
      document.querySelector('.ql-editor').setAttribute('data-placeholder', '${placeholder ?? 'Digite seu texto aqui...'}');

      function getPlainText() {
          return quill.getText().trim(); // Obtém o texto e remove espaços em branco nas extremidades
      }

      // Get the editor's container
      var editorContainer = document.querySelector('.ql-editor');

      // Focus event
      editorContainer.addEventListener('focus', function() {
          console.log('Editor is focused');
          const data = { type: "focus" };
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
      });

      // Blur event
      editorContainer.addEventListener('blur', function() {
          console.log('Editor has lost focus');
          const data = { type: "blur" };
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
      });

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

      var formats = document.querySelector('.ql-formats');

      // Manter o foco no editor após clicar no dropdown
      formats.addEventListener('click', function(event) {
          quill.focus();

          // Remover a seleção de texto
          const range = quill.getSelection();
          if (range) {
            quill.setSelection(range.index + range.length, 0); // Move a seleção para o final do intervalo
          }
      });

    </script>
  </body>
</html>
  `;

  return (
    <View style={[{ width: "100%", height: webViewHeight, backgroundColor: theme.colors.background }]}>
      <WebView style={[{ flex: 1 }]}
        ref={webviewRef}
        bounces={false}
        scrollEnabled={false}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        injectedJavaScript={script}
        hideKeyboardAccessoryView
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
              onSubmit?.(html);
              break;
            case "focus":
              handleOnFocus?.();
              break;
            case "blur":
              handleOnBlur?.();
              break;
            default:
              break;
          }
        }}
      />
    </View>
    // <TextInput style={styles.textInput}
    //   ref={textInputRef}
    //   // label="Email"
    //   // label=""
    //   placeholder={placeholder}
    //   value={value} // Utilize value em vez de defaultValue
    //   onChangeText={text => setValue(text)}
    //   mode="outlined"
    //   contentStyle={{ paddingTop: 18}}
    //   multiline
    //   onFocus={onFocus}
    //   onBlur={onBlur}
    //   render={props => (
    //     <BottomSheetTextInput {...props} ref={props.ref as any} />
    //   )}
    // />
  )
})

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KeyboardBottomSheetBackdropProps extends BottomSheetBackdropProps {
  isFocused?: boolean;
  onPress: () => void;
}

const KeyboardBottomSheetBackdrop: React.FC<KeyboardBottomSheetBackdropProps> = ({ isFocused, onPress, animatedIndex, animatedPosition, style }) => {
  const [visible, setVisible] = React.useState(false);

  // Define a shared value for opacity
  const opacity = useSharedValue(0);

  // Define the animated style based on the shared value
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, []);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setVisible(true); // O teclado está aberto
        // Animate opacity to 1 when visible
        opacity.value = withSpring(1, { duration: 300 });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // Animate opacity to 0 when hidden
        opacity.value = withSpring(0, { duration: 300 });
        // Set visible to false after animation completes
        setTimeout(() => setVisible(false), 300);
      }
    );

    // Limpar os listeners ao desmontar o componente
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handlePress = React.useCallback(() => {
    Keyboard.dismiss();
    onPress?.();
  }, [])

  if (!visible || !isFocused) return null;

  return (
    <AnimatedPressable onPress={handlePress}
      style={[
        style,
        { backgroundColor: "rgba(0,0,0,.9)" },
        animatedStyle
      ]}
    />
  );
};

export const RichTextEditorSheet: RichTextEditorSheetMethods = {
  open(config: RichTextEditorSheetConfig) {
    event.emit('richTextEditorSheet:root', { type: 'open', config });
    return () => this.close();
  },
  close() {
    event.emit('richTextEditorSheet:root', { type: 'close' })
  },
  on(type: string, fn: (event: RichTextEditorSheetEvent) => void): () => void {
    event.on(`richTextEditorSheet:${type}`, fn);

    return () => {
      event.off(`richTextEditorSheet:${type}`, fn);
    };
  }
}

const styles = StyleSheet.create({
  sheetContainer: {

  },
  contentContainer: {
    flex: 1,
    // padding: 20,
  },
  textInput: {
    flex: 1,
  },
});