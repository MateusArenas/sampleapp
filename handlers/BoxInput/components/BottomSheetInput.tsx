import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React from 'react';
import { Keyboard, View, StyleSheet, TextInput as NativeTextInput, ViewStyle, StyleProp } from 'react-native';
import { TextInput, IconButton, useTheme } from 'react-native-paper';

// import { Container } from './styles';

export const BottomSheetInput: React.FC = () => {
  const bottomSheetInputRef = React.useRef<BottomSheet>(null);
  const boxInputRef = React.useRef<BoxInputMethods>(null);

  const theme = useTheme();

  function onSubmit () {
    const value = boxInputRef.current?.getValue();
    console.log({ value });
  }

  return (
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
              <BoxInput style={styles.textInput}
                ref={boxInputRef}
                // label="Email"
                placeholder="Adicione uma pergunta para..."
                defaultValue="Awesome 🎉"
              />
              <IconButton mode="contained"
                icon="send"
                onPress={onSubmit}
              />
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}

interface BoxInputProps {
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  defaultValue?: string;
}

interface BoxInputMethods {
  getValue(): string|undefined;
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