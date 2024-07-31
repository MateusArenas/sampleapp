import React from 'react';
import { View, Text, StyleSheet, Modal, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics'

import { ToastNotification as ToastNotificationComponent } from './components/ToastNotification';

import { event } from '../../services/event';

interface ToastNotificationProps {
  delay?: number;
}

export interface ToastNotificationConfig {
  type?: "info" | "question" | "success" | "warning" | "danger";
  title?: string;
  description?: string;
  duration?: number; // Tempo opcional de exibição em milissegundos
  onPress?: () => void;
  onDismiss?: () => void;
} 

export interface ToastNotificationEvent {
  type: string; 
  config?: ToastNotificationConfig;
}

export interface ToastNotificationMethods {
  open(config?: ToastNotificationConfig): () => void;
  close(): void;
  on(type: string, fn: (event: ToastNotificationEvent) => void): () => void
} 

export const ToastNotificationHandler = React.forwardRef<ToastNotificationMethods, ToastNotificationProps>(({
  delay = 300
}, ref) => {
  const [config, setConfig] = React.useState<ToastNotificationConfig | undefined>(undefined);
  const [visible, setVisible] = React.useState<boolean>(false);

  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const methods = React.useMemo(() => ({
    open (config?: ToastNotificationConfig) {

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      Keyboard.dismiss();

      setConfig(config);

      setVisible(true);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

      timeoutRef.current = setTimeout(this.close, config?.duration ?? 3000);
      
      return () => this.close();
    },
    close () {

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setVisible(false);

      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Soft
      );

      timeoutRef.current = setTimeout(() => {
        setConfig(undefined);
      }, delay);
    },
    on(type: string, fn: (event: any) => void) {
      event.on(`toastNotification:${type}`, fn);
  
      return () => {
        event.off(`toastNotification:${type}`, fn);
      };
    }
  }), [timeoutRef])


  React.useImperativeHandle(ref, () => methods, [methods]);

  function onToastNotificationEvent (event: ToastNotificationEvent) {
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
    const unsubscribe = methods.on('root', onToastNotificationEvent);

    return () => {
      unsubscribe();
    };
  }, [onToastNotificationEvent, methods]);

  const onPress = React.useCallback(() => {
    config?.onPress?.();
    methods.close();
  }, [config])

  const onDismiss = React.useCallback(() => {
    config?.onDismiss?.();
    methods.close();
  }, [config])

  return (
    <ToastNotificationComponent 
      visible={visible} 
      type={config?.type} 
      title={config?.title} 
      description={config?.description} 
      onDismiss={onDismiss}
      onPress={onPress}
    />
  );
})

export const ToastNotification: ToastNotificationMethods = {
  open(config?: ToastNotificationConfig) {
    event.emit('toastNotification:root', { type: 'open', config });
    return () => this.close();
  },
  close() {
    event.emit('toastNotification:root', { type: 'close' })
  },
  on(type: string, fn: (event: ToastNotificationEvent) => void): () => void {
    event.on(`toastNotification:${type}`, fn);

    return () => {
      event.off(`toastNotification:${type}`, fn);
    };
  }
}