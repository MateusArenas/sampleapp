import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { Snackbar as SnackbarPaper, useTheme, Text, MD3Theme } from 'react-native-paper';
import * as Haptics from 'expo-haptics'
import { event } from '../../services/event';
import Animated, { SharedValue, useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';

interface SnackbarProps {
  bottomInset: number;
  theme: MD3Theme;
  bottomOffset: SharedValue<number>;
}

export interface SnackbarAction {
  label: string;
  onPress?: () => void;
}

export interface SnackbarConfig {
  message: string;
  duration?: number; // Tempo opcional de exibição em milissegundos
  action?: SnackbarAction;
} 

export interface SnackbarEvent {
  type: string; 
  config?: SnackbarConfig;
}

export interface SnackbarMethods {
  open(config?: SnackbarConfig): () => void;
  close(): void;
  on(type: string, fn: (event: SnackbarEvent) => void): () => void
} 

export const SnackbarHandler = React.forwardRef<SnackbarMethods, SnackbarProps>(({
  bottomInset,
  theme,
  bottomOffset,
}, ref) => {
  const keyboard = useAnimatedKeyboard();

  const [config, setConfig] = React.useState<SnackbarConfig | undefined>(undefined);
  const [visible, setVisible] = React.useState<boolean>(false);

  const methods = React.useMemo(() => ({
    open (config?: SnackbarConfig) {
      Keyboard.dismiss();

      setConfig(config);

      setVisible(true);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

      return () => this.close();
    },
    close () {
      setVisible(false);

      setConfig(undefined);

      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Soft
      );
    },
    on(type: string, fn: (event: any) => void) {
      event.on(`snackbar:${type}`, fn);
  
      return () => {
        event.off(`snackbar:${type}`, fn);
      };
    }
  }), [])


  React.useImperativeHandle(ref, () => methods, [methods]);

  function onSnackbarEvent (event: SnackbarEvent) {
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
    const unsubscribe = methods.on('root', onSnackbarEvent);

    return () => {
      unsubscribe();
    };
  }, [onSnackbarEvent, methods]);

  const onDismiss = () => {
    methods.close();
  }


  // Estilo animado para a notificação
  const animatedWrapperStyle = useAnimatedStyle(() => {
    let bottomOffsetValue = bottomOffset.value;
    return {
        bottom: (bottomInset + bottomOffsetValue) + (keyboard.height.value),
      //  backgroundColor: "red"
    };
  }, [bottomInset]);

  return (
    <Animated.View style={[
      styles.wrapper,
      animatedWrapperStyle,
    ]} >
      <SnackbarPaper 
        elevation={1}
        duration={config?.duration}
        visible={visible}
        onDismiss={onDismiss}
        theme={theme}
        wrapperStyle={{ paddingBottom: bottomInset + 16 }}
        style={{ backgroundColor: theme.colors.surface }}
        // onIconPress={() => {}}
        action={config?.action}
        
        shouldRasterizeIOS
        collapsable
      >
        <Text style={[{ color: theme.colors.onSurface }]}>
          {config?.message}
        </Text>
      </SnackbarPaper>
    </Animated.View>
  );
})

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export const Snackbar: SnackbarMethods = {
  open(config?: SnackbarConfig) {
    event.emit('snackbar:root', { type: 'open', config });
    return () => this.close();
  },
  close() {
    event.emit('snackbar:root', { type: 'close' })
  },
  on(type: string, fn: (event: SnackbarEvent) => void): () => void {
    event.on(`snackbar:${type}`, fn);

    return () => {
      event.off(`snackbar:${type}`, fn);
    };
  }
}