import React from 'react';
import { View, Text, StyleSheet, Modal, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics'

import { ToastNotification as ToastNotificationComponent } from './components/ToastNotification';

import { event } from '../../services/event';
import { randomID } from '../utils/randomID';

interface ToastNotificationProps {
  delay?: number;
}

export interface ToastNotificationConfig {
  id?: string;
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

  const [instances, setInstances] = React.useState<ToastNotificationConfig[]>([]);

  // Function to process the queue
  const processQueue = React.useCallback(async () => {
    if (instances.length === 0) return;

    const nextInstance = instances[0];

    // caso se repita a execução devido a ação de remoção acionar o useEfect.
    if (config?.id === nextInstance?.id) return;

    setConfig(nextInstance);
    setVisible(true);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

    // encapsula a acao automatica para ser dispencada caso tenha uma acao do usuario.
    const duration = config?.duration ?? 3000;
    
    timeoutRef.current = setTimeout(() => {
      methods.close();
    }, duration);

  }, [instances]);

  React.useEffect(() => {
    if (instances.length > 0) {
      processQueue();
    }
  }, [instances, processQueue]);

  console.log({ instances });
  
  const methods = React.useMemo(() => ({
    open (config?: ToastNotificationConfig) {
      Keyboard.dismiss();

      config!.id = randomID();

      setInstances((prev) => [...prev, config!]);

      return () => {
        methods.close();
      };
    },
    close () {
      // dispença sempre a ação autômatica 
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      setVisible(false);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

      setTimeout(() => { // isso é meio que necessario. ver se não dar problema ao ser desmontado.
        setConfig(undefined);
        setInstances((prev) => prev.slice(1));
      }, 750);

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
    // deixar somente ser executado uma vez aqui.
    // porque se da multiplos clicks ele fica passando para frente.
    config?.onPress?.();
    methods.close();
  }, [config, methods])

  const onDismiss = React.useCallback(() => {
    config?.onDismiss?.();
    methods.close();
  }, [config, methods])

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