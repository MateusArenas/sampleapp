import React from 'react';

import { View, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics'

import { event } from '../../services/event';

import { MD3Theme, Button, Text, IconButton, Divider } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import Animated, { Easing, KeyboardState, SharedValue, runOnJS, useAnimatedKeyboard, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface BottomActionBarOption {
  icon?: IconSource;
  label?: string;
  value?: string;
  onPress?: () => void;
}

export interface BottomActionBarConfig {
  id?: string,

  disabled?: boolean;
  left?: BottomActionBarOption[];
  description?: string;
  right?: BottomActionBarOption[];

  onChangeOption?: (option?: BottomActionBarOption) => void;
  onClose?: () => void;
} 

interface BottomActionBarProps { 
  staticHeight?: number;
  bottomInset: number;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (visible: boolean) => void;
  theme: MD3Theme;

  onAimatedPosition?: (aimatedPositionValue: number) => void;
}

export interface BottomActionBarEvent {
  type: string; 
  config?: BottomActionBarConfig;
  option?: BottomActionBarOption;
}

export interface BottomActionBarMethods {
  open(config?: BottomActionBarConfig): () => void;
  close(duration?: number): void;
  enable(): void;
  disable(): void;
  on(type: BottomActionBarEvent['type'], fn: (event: BottomActionBarEvent) => void): () => void;
} 

export const BottomActionBarHandler = React.forwardRef<BottomActionBarMethods, BottomActionBarProps>(({
  theme,
  staticHeight = 56,
  bottomInset,
  onChange,
  onOpen,
  onClose,
  onAimatedPosition,
}, ref) => {
  const insets = useSafeAreaInsets();

  const [shouldRender, setShouldRender] = React.useState(false); // Estado para controlar a renderização
  
  const [config, setConfig] = React.useState<BottomActionBarConfig | undefined>(undefined);

  const translateY = useSharedValue(staticHeight);

  const isCanceled = React.useRef(false);

  function showVisibility (duration = 300) {
    onChange?.(true);
    setShouldRender(true); // Começa a renderizar o componente
    translateY.value = withTiming(0, { duration, easing: Easing.inOut(Easing.quad) });
  }

  function hideVisibility (duration = 300) {
    onChange?.(false);
    translateY.value = withTiming(staticHeight, { duration, easing: Easing.inOut(Easing.quad) });
    // não é recomendado po dentro do calback das animações do reanimated.
    setTimeout(() => { 
      setShouldRender(false);
    }, duration);

    event.emit('bottomActionBar:height', { height: 0, visible: false });
  }

  const methods = React.useMemo(() => ({
    open (config?: BottomActionBarConfig) {
      isCanceled.current = false;
      onOpen?.();

      if (!Keyboard.isVisible()) showVisibility();
      
      setConfig(config);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
      
      return () => this.close();
    },
    close () {
      isCanceled.current = true;
      onClose?.();

      hideVisibility();

      setTimeout(() => { 
        setConfig(undefined);
      }, 300);

      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Soft
      );
    },
    enable() {
      setConfig(config => config ? ({ ...config, disabled: false }) : config);
    },
    disable() {
      setConfig(config => config ? ({ ...config, disabled: true })  : config);
    },
    on(type: string, fn: (event: any) => void) {
      event.on(`bottomActionBar:${type}`, fn);
  
      return () => {
        event.off(`bottomActionBar:${type}`, fn);
      };
    }
  }), [])


  React.useImperativeHandle(ref, () => methods, [methods]);

  const onBottomActionBarEvent = React.useCallback((event: BottomActionBarEvent) => {
    switch (event.type) {
      case 'open':
        methods.open(event?.config);
        break;
      case 'close':
        methods.close();
        break;
      case 'enable':
        methods.enable();
        break;
      case 'disable':
        methods.disable();
        break;
      default:
        break;
    }
  }, [methods])

  React.useEffect(() => {
    const unsubscribe = methods.on('root', onBottomActionBarEvent);

    return () => {
      unsubscribe();
    };
  }, [onBottomActionBarEvent, methods]);

  const onChangeOption = React.useCallback((option: BottomActionBarOption) => {
    event.emit('bottomActionBar:change', { type: 'change', config, option });
    option?.onPress?.();
    config?.onChangeOption?.(option);
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );
  }, [config, methods])

  // Use useAnimatedReaction para reagir às mudanças em translateY
  useAnimatedReaction(
    () => staticHeight - translateY.value, // O valor que você está monitorando
    (currentValue, previousValue) => {
      // Callback que é chamado quando currentValue muda
      if (currentValue !== previousValue) {
        if(onAimatedPosition) runOnJS(onAimatedPosition)(currentValue)
      }
    },
    [translateY.value, onAimatedPosition, staticHeight] // Dependências para o efeito
  );
    
  // Estilo animado para a notificação
  const animatedStyle = useAnimatedStyle(() => {
    // console.log({ translateY: translateY.value });
    
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const onKeyboardDidShow = React.useCallback(() => {
    hideVisibility(100); // O teclado está aberto
  }, [])

  const onKeyboardDidHide = React.useCallback(() => {
    if (!isCanceled.current) showVisibility(300);
  }, [])

  // const keyboard = useAnimatedKeyboard();

  // // Use useAnimatedReaction para reagir às mudanças em translateY
  // useAnimatedReaction(
  //   () => keyboard.state.value, // O valor que você está monitorando
  //   (currentValue, previousValue) => {
  //     // Callback que é chamado quando currentValue muda
  //     if (currentValue !== previousValue) {
  //       if (currentValue === KeyboardState.OPENING) {
  //         runOnJS(onKeyboardDidShow)();
  //       } else if (currentValue === KeyboardState.CLOSING) {
  //         runOnJS(onKeyboardDidHide)();
  //       }
  //     }
  //   },
  //   [keyboard.state.value, onKeyboardDidShow, onKeyboardDidHide] // Dependências para o efeito
  // );

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

  if (!shouldRender) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "position" : "height"}
    >

      <View style={[styles.wrapper]} >

        <Animated.View style={[
            styles.contentContainer,
            { backgroundColor: 'transparent' },
            { backgroundColor: theme.colors.surface },
            animatedStyle,
            { bottom: insets.bottom },
            { height: staticHeight },
            { borderTopWidth: 1, borderColor: theme.colors.outlineVariant }
          ]}
          onLayout={e => {
            const height = e.nativeEvent.layout.height;
            event.emit('bottomActionBar:height', { height, visible: true });
          }}
        >
          
          <View style={[styles.contentContainer]}>

                <View style={[styles.rightContainer]}>
                  {config?.right?.map((option, index) => {

                    if (option.label) {
                      return (
                        <Button mode="text" key={`bottom-action-bar-right:${index}`}
                          icon={option.icon}
                          onPress={() => onChangeOption(option)}
                          labelStyle={{ fontSize: 16 }}
                          disabled={config?.disabled}
                        >
                          {option.label}
                        </Button>
                      )
                    }
                    
                    if (option.icon) {
                      return (
                        <IconButton key={`bottom-action-bar-right:${index}`}
                          icon={option.icon}
                          onPress={() => onChangeOption(option)}
                          size={24}
                          disabled={config?.disabled}
                        />
                      )
                    }

                    
                    return null;
                  })}
                </View>

                {!!config?.description && (
                  <View style={[styles.middleContainer]}>
                    <Text style={[
                      styles.descriptionText, 
                      { color: theme.colors.onSurfaceVariant },
                      config?.disabled && { color: theme.colors.onSurfaceDisabled }
                    ]}
                      numberOfLines={2}
                    >
                      {config.description}
                    </Text>
                  </View>
                )}

                <View style={[styles.leftContainer]}>
                  {config?.left?.map((option, index) => {

                    if (option.label) {
                      return (
                        <Button mode="text" key={`bottom-action-bar-left:${index}`}
                          icon={option.icon}
                          onPress={() => onChangeOption(option)}
                          labelStyle={{ fontSize: 16 }}
                          disabled={config?.disabled}
                        >
                          {option.label}
                        </Button>
                      )
                    }

                    if (option.icon) {
                      return (
                        <IconButton key={`bottom-action-bar-left:${index}`}
                          icon={option.icon}
                          onPress={() => onChangeOption(option)}
                          size={24}
                          disabled={config?.disabled}
                        />
                      )
                    }


                    return null;
                  })}
                </View>
            </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
})


export const BottomActionBar: BottomActionBarMethods = {
  open(config: BottomActionBarConfig) {
    event.emit('bottomActionBar:root', { type: 'open', config });
    return () => this.close();
  },
  close() {
    event.emit('bottomActionBar:root', { type: 'close' })
  },
  enable() {
    event.emit('bottomActionBar:root', { type: 'enable' })
  },
  disable() {
    event.emit('bottomActionBar:root', { type: 'disable' })
  },
  on(type: string, fn: (event: BottomActionBarEvent) => void): () => void {
    event.on(`bottomActionBar:${type}`, fn);

    return () => {
      event.off(`bottomActionBar:${type}`, fn);
    };
  }
}

// Styles used for the action sheet components.
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  sheetBackground: {
    borderBottomRightRadius: 0, 
    borderBottomLeftRadius: 0,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
    minHeight: 50,
    flexDirection: "row-reverse", 
    alignItems: "center", 
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: 'row', 
    position: 'relative',
  },
  headerTitle: {
    flex: 1, 
    textAlign: 'center', 
    fontWeight: '700', 
    alignSelf: 'center',
    marginTop: 6, 
    paddingHorizontal: 60
  },
  closeButton: {
    position: 'absolute', 
    top: 0, 
    right: 0, 
    margin: 0,
  },
  leftContainer: {
    flex: 1, 
    flexDirection: "row", 
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  middleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    flex: 1, 
    flexDirection: "row", 
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  descriptionText: {
    textAlign: "center",
    verticalAlign: 'middle',
    textAlignVertical: 'center',
  },
  optionsContainer: {
    borderRadius: 10, 
    overflow: 'hidden', 
  },
  optionsButton: {
    borderRadius: 0,
  },
  optionsButtonContent: {
    justifyContent: 'flex-start', 
    padding: 4,
  },
  optionsButtonLabel: {
    fontSize: 16,
  },
});