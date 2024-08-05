import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView, BottomSheetTextInput, useBottomSheet } from '@gorhom/bottom-sheet';
import React from 'react';
import * as Haptics from 'expo-haptics'
import { Keyboard, View, StyleSheet, TextInput as NativeTextInput, ViewStyle, StyleProp, Pressable, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, IconButton, useTheme, MD3Theme } from 'react-native-paper';
import { event } from '../../services/event';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Easing, Extrapolate, KeyboardState, SharedValue, interpolate, isSharedValue, runOnJS, useAnimatedKeyboard, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export interface InputSheetConfig {
  dismissible?: boolean;
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
  bottomOffset: SharedValue<number>;
  theme: MD3Theme;
  maxHeight?: number;
  onChange?: (visible: boolean) => void;
  duration?: number;

  onAimatedPosition?: (aimatedPositionValue: number) => void;
} 

export const InputSheetHandler = React.forwardRef<InputSheetMethods, InputSheetProps>(({
  bottomInset,
  theme,
  maxHeight = 160,
  duration = 300,
  onChange,
  bottomOffset,
  onAimatedPosition,
}, ref) => {
  const keyboard = useAnimatedKeyboard();

  const [currentHeight, setCurrentHeight] = React.useState(maxHeight);

  const [isFocused, setIsFocused] = React.useState(false);

  const inputState = useSharedValue(0);

  const [shouldRender, setShouldRender] = React.useState(false); // Estado para controlar a renderização
  
  const translateY = useSharedValue(currentHeight);

  const isOpened = React.useRef(false);

  const [config, setConfig] = React.useState<InputSheetConfig | undefined>({});

  const boxInputRef = React.useRef<BoxInputMethods>(null);

  console.log({ currentHeight });
  

  const showVisibility = React.useCallback((duration = 300) => {
    onChange?.(true);
    setShouldRender(true); // Começa a renderizar o componente
    translateY.value = withTiming(0, { duration, easing: Easing.inOut(Easing.quad) });
  }, [])

  const hideVisibility = React.useCallback((duration = 300) => {
    onChange?.(false);
    translateY.value = withTiming(currentHeight, { duration, easing: Easing.inOut(Easing.quad) });
    // não é recomendado po dentro do calback das animações do reanimated.
    setTimeout(() => { 
      setShouldRender(false);
    }, duration);

    event.emit('inputSheet:height', { height: 0, visible: false });
  }, [currentHeight])

  const handleSubmit = React.useCallback(() => {
    const value = boxInputRef.current?.getValue();
    if (value) {
      config?.onSubmit?.(value);
      if (config?.dismissible) {
        methods.close();
      }
      boxInputRef.current?.cleanup();
      Keyboard.dismiss();
    }
  }, [boxInputRef, config]);

  const methods = React.useMemo(() => ({
    open (config?: InputSheetConfig) {
      isOpened.current = true;

      showVisibility();
      
      setConfig(config);
      
      if (config?.autoFocus) {
        setTimeout(() => {
          boxInputRef.current?.focus();
        }, duration);
      }

      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Rigid
      );
      
      return () => this.close();
    },
    close () {
      isOpened.current = false;

      hideVisibility();

      setConfig({});

      boxInputRef.current?.blur();

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
  }), [showVisibility, hideVisibility])


  React.useImperativeHandle(ref, () => methods, [methods]);

  const onInputSheetEvent = React.useCallback((event: InputSheetEvent) => {
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
  }, [methods])

  React.useEffect(() => {
    const unsubscribe = methods.on('root', onInputSheetEvent);

    return () => {
      unsubscribe();
    };
  }, [onInputSheetEvent, methods]);

  // Estilo animado para a notificação
  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  }, []);

  // Estilo animado para a notificação
  const animatedWrapperStyle = useAnimatedStyle(() => {
    let bottomOffsetValue = bottomOffset.value;
    // tentar arrumar a forma do bttomActionBar de abrir.
    return {
        bottom: (bottomInset + bottomOffsetValue) + (keyboard.height.value),
    };
  }, [keyboard, bottomOffset, bottomInset]);

  // Use useAnimatedReaction para reagir às mudanças em translateY
  useAnimatedReaction(
    () => currentHeight - translateY.value, // O valor que você está monitorando
    (currentValue, previousValue) => {
      // Callback que é chamado quando currentValue muda
      if (currentValue !== previousValue) {
        if(onAimatedPosition) runOnJS(onAimatedPosition)(currentValue)
      }
    },
    [translateY.value, onAimatedPosition, currentHeight] // Dependências para o efeito
  );

  const onKeyboardDidShow = React.useCallback(() => {
    if (!isOpened.current) return;
    // O teclado está aberto e está ativado.
    const isFocused = boxInputRef.current?.isFocused();

    if (!isFocused) hideVisibility(100); 
  }, [boxInputRef, isOpened, hideVisibility])

  const onKeyboardDidHide = React.useCallback(() => {
    if (!isOpened.current) return;
    showVisibility();
  }, [isOpened, showVisibility])

  React.useEffect(() => {

    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      onKeyboardDidShow
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      onKeyboardDidHide
    );

    // Limpar os listeners ao desmontar o componente
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [onKeyboardDidShow, onKeyboardDidHide]);


  const hanldePressBackdrop = React.useCallback(() => {
    Keyboard.dismiss();
    if (config?.dismissible) {
      methods.close();
    }
  }, [methods, config])

  if (!shouldRender) return null;

  return (
    <>
        <KeyboardBottomSheetBackdrop style={[styles.overlay]}
          inputState={inputState}
          onPress={hanldePressBackdrop}
        />
        <Animated.View style={[
          styles.wrapper,
          animatedWrapperStyle,
        ]} >
          <Animated.View style={[
            styles.contentContainer,
            { backgroundColor: 'transparent' },
            { backgroundColor: theme.colors.surface },
            animatedContentStyle,
            { maxHeight: maxHeight },
            { borderTopWidth: 1, borderColor: theme.colors.outlineVariant },
          ]}
            onLayout={e => {
              if (isOpened.current) {
                const height = e.nativeEvent.layout.height;
                event.emit('inputSheet:height', { height, visible: true });
                setCurrentHeight(height);
              }
            }}
          >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
                  <BoxInput style={styles.textInput}
                    ref={boxInputRef}
                    label={config?.label}
                    theme={theme}
                    placeholder={config?.placeholder}
                    value={config?.value}
                    onFocus={() => {
                      inputState.value = 1;
                    }}
                    onBlur={() => {
                      inputState.value = 0;
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
          </Animated.View>

        </Animated.View>
    </>
  );
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
  blur(): void;
  isFocused: () => boolean;
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
    blur() {
      textInputRef.current?.blur();
    },
    isFocused() {
      return textInputRef.current?.isFocused() ?? false;
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
      // render={props => (
      //   <BottomSheetTextInput {...props} ref={props.ref as any} 
      //   />
      // )}
    />
  )
})

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KeyboardBottomSheetBackdropProps {
  style?: StyleProp<ViewStyle>;
  inputState: SharedValue<number>;
  onPress?: () => void;
}

const KeyboardBottomSheetBackdrop: React.FC<KeyboardBottomSheetBackdropProps> = React.memo(({ inputState, onPress, style }) => {
  const keyboard = useAnimatedKeyboard();

  // Define the animated style based on the shared value
  const animatedOverlayStyle = useAnimatedStyle(() => {
    // Interpola a opacidade baseada na abertura do teclado
    let visible = ( keyboard.state.value === KeyboardState.OPENING || keyboard.state.value === KeyboardState.OPEN);

    if (inputState.value === 0) visible = false;
    
    const opacity = withTiming(visible ? 1 : 0, { duration: 100 }); // Opacidade 1 se o teclado estiver aberto, caso contrário, 0
    // Permite interação com o conteúdo abaixo
    const pointerEvents = visible ? 'auto' : 'none';
    // styles
    return { opacity, pointerEvents };
  }, [inputState]);

  return (
    <AnimatedPressable onPress={onPress}
      style={[
        style,
        { backgroundColor: "rgba(0,0,0,.5)" },
        animatedOverlayStyle
      ]}
    />
  );
})

export const InputSheet: InputSheetMethods = {
  open(config: InputSheetConfig) {
    event.emit('inputSheet:root', { type: 'open', config });
    return () => this.close();
  },
  close() {
    event.emit('inputSheet:root', { type: 'close' });
  },
  on(type: string, fn: (event: InputSheetEvent) => void): () => void {
    event.on(`inputSheet:${type}`, fn);

    return () => {
      event.off(`inputSheet:${type}`, fn);
    };
  }
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
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