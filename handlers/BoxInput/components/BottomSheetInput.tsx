import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React from 'react';
import { Keyboard, View, StyleSheet, TextInput as NativeTextInput, ViewStyle, StyleProp } from 'react-native';
import { TextInput, IconButton, useTheme } from 'react-native-paper';

// import { Container } from './styles';

export interface BottomSheetInputOptions {
  onSubmit?: (value: string) => Promise<void> | void;
  placeholder?: string;
  defaultValue?: string;
} 

export interface BottomSheetInputMethods {
  open(options: BottomSheetInputOptions): () => void;
  close(): void;
} 

export interface BottomSheetInputProps {
} 

export const BottomSheetInput = React.forwardRef<BottomSheetInputMethods, BottomSheetInputProps>(({
}, ref) => {
  const [options, setOptions] = React.useState<BottomSheetInputOptions | undefined>({});

  const bottomSheetInputRef = React.useRef<BottomSheet>(null);
  const boxInputRef = React.useRef<BoxInputMethods>(null);

  const theme = useTheme();

  function handleSubmit () {
    const value = boxInputRef.current?.getValue();
    if (value) {
      options?.onSubmit?.(value);
      boxInputRef.current?.cleanup();
      Keyboard.dismiss();
    }
  }

  const methods = React.useMemo(() => ({
    open (options?: BottomSheetInputOptions) {
      bottomSheetInputRef.current?.expand();
      setOptions(options);
      return () => this.close();
    },
    close () {
      setOptions({});
      bottomSheetInputRef.current?.forceClose();
    }
  }), [])


  React.useImperativeHandle(ref, () => methods, []);

  return (
    <BottomSheet
      ref={bottomSheetInputRef}
      index={-1}
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
              <BoxInput style={styles.textInput}
                ref={boxInputRef}
                // label="Email"
                placeholder={options?.placeholder}
                defaultValue={options?.defaultValue}
              />
              <IconButton mode="contained"
                icon="send"
                onPress={handleSubmit}
              />
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  )
})

interface BoxInputProps {
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  defaultValue?: string;
}

interface BoxInputMethods {
  getValue(): string|undefined;
  cleanup(): void;
}

const BoxInput = React.forwardRef<BoxInputMethods, BoxInputProps>(({
  placeholder = "Adicione uma pergunta para...",
  defaultValue = "Awesome 🎉",
}, ref) => {
  const textInputRef = React.useRef<NativeTextInput>(null);
  const [value, setValue] = React.useState(defaultValue);

  React.useImperativeHandle(ref, () => ({
    getValue() {
      return value;
    },
    cleanup() {
      setValue("");
    },
  }), [value])

  return (
    <TextInput style={styles.textInput}
      ref={textInputRef}
      // label="Email"
      // label=""
      placeholder={placeholder}
      // defaultValue={defaultValue}
      value={value}
      onChangeText={text => setValue(text)}
      mode="outlined"
      contentStyle={{ paddingTop: 18}}
      multiline
      render={props => (
        <BottomSheetTextInput {...props} ref={props.ref as any} />
      )}
    />
  )
})

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
    padding: 24,
    backgroundColor: "grey",
  },
  sheetContainer: {

  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    flex: 1,
  },
});