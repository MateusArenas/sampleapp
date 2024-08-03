import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView, BottomSheetTextInput, useBottomSheet } from '@gorhom/bottom-sheet';
import React from 'react';
import * as Haptics from 'expo-haptics'
import { Keyboard, View, StyleSheet, TextInput as NativeTextInput, ViewStyle, StyleProp, Pressable } from 'react-native';
import { TextInput, IconButton, useTheme, MD3Theme } from 'react-native-paper';
import { event } from '../../services/event';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Extrapolate, interpolate, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export interface InputSheetConfig {
  onSubmit?: (value: string) => Promise<void> | void;
  placeholder?: string;
  value?: string;
  autoFocus?: boolean;
  icon?: IconSource;
  label?: string;
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
  onChange?: (visible: boolean) => void;
} 

export const InputSheetHandler = React.forwardRef<InputSheetMethods, InputSheetProps>(({
  bottomInset,
  theme,
  onChange,
}, ref) => {
  const [config, setConfig] = React.useState<InputSheetConfig | undefined>({});
  const [index, setIndex] = React.useState<number>(-1);
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

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
      
      // Força a abertura inicial para corrigir um problema que ocorre quando o componente é exibido imediatamente.
      // Isso garante que a animação ocorra corretamente na primeira montagem.      
      setIndex(0);
      
      const duration = 600;

      InputSheetRef.current?.expand({ duration });

      setTimeout(() => {
        if (config?.autoFocus) {
          boxInputRef.current?.focus();
        }
      }, duration);
      

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

  const backdropComponent = React.useCallback((props: BottomSheetBackdropProps) => {
    return (
      <KeyboardBottomSheetBackdrop {...props} 
        isFocused={isFocused} 
      />
    )
  }, [isFocused])

  return (
    <BottomSheet
      ref={InputSheetRef}
      index={index}
      backdropComponent={backdropComponent}
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
      onMagicTap={() => {
        console.log("onMagicTap");
      }}
      onAnimate={(fromIndex, toIndex) => {
        console.log("onAnimate", { fromIndex, toIndex });
      }}
      onChange={(index) => {
        console.log("onChange", { index });
        onChange?.(index === 0);
      }}
      onClose={() => {
        console.log("onClose");
      }}
    >
      <BottomSheetScrollView 
        // scrollEnabled={false} 
        // pinchGestureEnabled={false}
        bounces={false}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        
      >
        <View style={[styles.contentContainer, { borderTopWidth: 1, borderColor: theme.colors.outlineVariant }]}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
              <BoxInput style={styles.textInput}
                ref={boxInputRef}
                label={config?.label}
                theme={theme}
                placeholder={config?.placeholder}
                value={config?.value}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false);
                  console.log("onBlur");
                }}
              />
              <IconButton mode="contained"
                size={20}
                style={{ borderRadius: 8, height: 48, width: 48, margin: 0 }}
                // icon="send"
                // icon="square-edit-outline"
                icon={config?.icon ?? "arrow-up"}
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
  label?: string;
  placeholder?: string;
  value?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface BoxInputMethods {
  getValue(): string|undefined;
  cleanup(): void;
  focus(): void;
}

const BoxInput = React.forwardRef<BoxInputMethods, BoxInputProps>(({
  theme,
  placeholder = " ",
  label,
  value: controlledValue, // Renomeie para evitar confusão
  onFocus,
  onBlur,
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
    focus() {
      textInputRef.current?.focus();
    },
  }), [value])

  return (
    <TextInput style={[styles.textInput, { maxHeight: 90 }]}
      ref={textInputRef}
      dense
      // label="Email"
      label={label}
      placeholder={placeholder}
      value={value} // Utilize value em vez de defaultValue
      onChangeText={text => setValue(text)}
      mode="outlined"
      contentStyle={{ paddingTop: 8, paddingBottom: 8, maxHeight: 90 }}
      multiline
      scrollEnabled
      inputMode="text"
      onFocus={onFocus}
      onBlur={onBlur}
      render={props => (
        <BottomSheetTextInput {...props} ref={props.ref as any} 
        />
      )}
    />
  )
})

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KeyboardBottomSheetBackdropProps extends BottomSheetBackdropProps {
  isFocused?: boolean;
}

const KeyboardBottomSheetBackdrop: React.FC<KeyboardBottomSheetBackdropProps> = ({ isFocused, animatedIndex, animatedPosition, style }) => {
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

  if (!visible || !isFocused) return null;

  return (
    <AnimatedPressable onPress={() => Keyboard.dismiss()}
      style={[
        style,
        { backgroundColor: "rgba(0,0,0,.5)" },
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
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
  },
});