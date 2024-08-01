import React from 'react';

import { View, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics'
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { event } from '../../services/event';

import { MD3Theme, Button, Text, IconButton, Divider } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
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
  theme: MD3Theme;
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
  onOpen,
  onClose,
}, ref) => {
  const insets = useSafeAreaInsets();

  const [config, setConfig] = React.useState<BottomActionBarConfig | undefined>(undefined);

  const methods = React.useMemo(() => ({
    open (config?: BottomActionBarConfig) {
      onOpen?.();

      setVisible(true);
      setConfig(config);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
      
      return () => this.close();
    },
    close () {
      onClose?.();

      setVisible(false);

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

  function onBottomActionBarEvent (event: BottomActionBarEvent) {
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
  }

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

  const [visible, setVisible] = React.useState(false);

  const [shouldRender, setShouldRender] = React.useState(visible); // Estado para controlar a renderização

  const translateY = useSharedValue(staticHeight);

  React.useEffect(() => {

    let timeout: NodeJS.Timeout;

    const duration = 300;

    if (visible) {
      setShouldRender(true); // Começa a renderizar o componente

      translateY.value = withTiming(0, { duration, easing: Easing.inOut(Easing.quad) });
    } else {

      translateY.value = withTiming(staticHeight, { duration, easing: Easing.inOut(Easing.quad) });

      // não é recomendado po dentro do calback das animações do reanimated.
      timeout = setTimeout(() => { 
        setShouldRender(false);
      }, duration);
    }

    return () => {
      clearTimeout(timeout);
    }
  }, [visible]);

  // Estilo animado para a notificação
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const onKeyboardDidShow = React.useCallback(() => {
    setVisible(false); // O teclado está aberto
  }, [])

  const onKeyboardDidHide = React.useCallback(() => {
    if (config) setVisible(true);
  }, [config])

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
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
    <View style={[styles.wrapper]} >

      <Animated.View style={[
        styles.contentContainer,
        { backgroundColor: 'transparent' },
        { backgroundColor: theme.colors.surface },
        animatedStyle,
        { bottom: insets.bottom },
        { height: staticHeight },
      ]}>
        
        <Divider />

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
  );

  return (
    <BottomSheet // Esse Componente já é memo.
      ref={bottomSheetRef}
      index={index}
      backdropComponent={null}
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
      <BottomSheetScrollView style={[

      ]}
        // scrollEnabled={false} 
        pinchGestureEnabled={false}
        scrollEnabled={false}
        bounces={false}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        automaticallyAdjustKeyboardInsets
      >
        <Divider />

        <View style={[styles.contentContainer, { height: staticHeight - 1 }]}>

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
              <Text style={[styles.descriptionText, { color: theme.colors.outline }]}
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


          {/* <BottomActionBarOptionsList
            theme={theme}
            options={config?.options}
            onChangeOption={onChangeOption}
          /> */}

        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  )
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
  sheetBackdrop: {
    backgroundColor: 'rgba(0,0,0,.2)'
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