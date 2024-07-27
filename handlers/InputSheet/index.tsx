import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView, BottomSheetTextInput, useBottomSheet } from '@gorhom/bottom-sheet';
import React from 'react';
import * as Haptics from 'expo-haptics'
import { Keyboard, View, StyleSheet, TextInput as NativeTextInput, ViewStyle, StyleProp, Pressable } from 'react-native';
import { TextInput, IconButton, useTheme, MD3Theme } from 'react-native-paper';
import { event } from '../../services/event';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Extrapolate, interpolate, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';

export interface InputSheetConfig {
  onSubmit?: (value: string) => Promise<void> | void;
  placeholder?: string;
  value?: string;
} 

export interface InputSheetMethods {
  open(config: InputSheetConfig): () => void;
  close(): void;
  on(type: string, fn: (event: InputSheetEvent) => void): () => void
} 

export interface InputSheetEvent {
  type: string; 
  config?: InputSheetConfig;
}

export interface InputSheetProps {
  bottomInset: number;
  theme: MD3Theme;
} 

export const InputSheetHandler = React.forwardRef<InputSheetMethods, InputSheetProps>(({
  bottomInset,
  theme,
}, ref) => {
  const [config, setConfig] = React.useState<InputSheetConfig | undefined>({});
  const [index, setIndex] = React.useState<number>(-1);

  const InputSheetRef = React.useRef<BottomSheet>(null);
  const boxInputRef = React.useRef<BoxInputMethods>(null);

  function handleSubmit () {
    const value = boxInputRef.current?.getValue();
    if (value) {
      config?.onSubmit?.(value);
      boxInputRef.current?.cleanup();
      Keyboard.dismiss();
    }
  }

  const methods = React.useMemo(() => ({
    open (config?: InputSheetConfig) {
      setConfig(config);

      InputSheetRef.current?.expand();
      // Força a abertura inicial para corrigir um problema que ocorre quando o componente é exibido imediatamente.
      // Isso garante que a animação ocorra corretamente na primeira montagem.      
      setIndex(0);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
      
      return () => this.close();
    },
    close () {
      InputSheetRef.current?.forceClose();

      setConfig({});

      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Soft
      );
    },
    on(type: string, fn: (event: any) => void) {
      event.on(`inputSheet:${type}`, fn);
  
      return () => {
        event.off(`inputSheet:${type}`, fn);
      };
    }
  }), [InputSheetRef])


  React.useImperativeHandle(ref, () => methods, [methods]);

  function onInputSheetEvent (event: InputSheetEvent) {
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
    const unsubscribe = methods.on('root', onInputSheetEvent);

    return () => {
      unsubscribe();
    };
  }, [onInputSheetEvent, methods]);

  return (
    <BottomSheet
      ref={InputSheetRef}
      index={index}
      backdropComponent={KeyboardBottomSheetBackdrop}
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
              <BoxInput style={styles.textInput}
                ref={boxInputRef}
                // label="Email"
                theme={theme}
                placeholder={config?.placeholder}
                value={config?.value}
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
  theme: MD3Theme;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  value?: string;
}

interface BoxInputMethods {
  getValue(): string|undefined;
  cleanup(): void;
}

const BoxInput = React.forwardRef<BoxInputMethods, BoxInputProps>(({
  theme,
  placeholder = " ",
  value: controlledValue, // Renomeie para evitar confusão
}, ref) => {
  const textInputRef = React.useRef<NativeTextInput>(null);
  const [value, setValue] = React.useState(controlledValue || undefined); // Use controlledValue como default

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue); // Atualize o valor quando controlledValue mudar
    }
  }, [controlledValue]);

  React.useImperativeHandle(ref, () => ({
    getValue() {
      return value;
    },
    cleanup() {
      setValue(""); // Limpar valor
    },
  }), [value])

  return (
    <TextInput style={styles.textInput}
      ref={textInputRef}
      // label="Email"
      // label=""
      placeholder={placeholder}
      value={value} // Utilize value em vez de defaultValue
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const KeyboardBottomSheetBackdrop: React.FC<any> = ({ animatedIndex, animatedPosition, style }) => {
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
      'keyboardWillChangeFrame',
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

  if (!visible) return null;

  return (
    <AnimatedPressable onPress={() => Keyboard.dismiss()}
      style={[
        style,
        { backgroundColor: "rgba(0,0,0,.1)" },
        animatedStyle
      ]}
    />
  );
};

export const InputSheet: InputSheetMethods = {
  open(config: InputSheetConfig) {
    event.emit('inputSheet:root', { type: 'open', config });
    return () => this.close();
  },
  close() {
    event.emit('inputSheet:root', { type: 'close' })
  },
  on(type: string, fn: (event: InputSheetEvent) => void): () => void {
    event.on(`inputSheet:${type}`, fn);

    return () => {
      event.off(`inputSheet:${type}`, fn);
    };
  }
}

const styles = StyleSheet.create({
  sheetContainer: {

  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    flex: 1,
  },
});