import React from 'react';
import { View, Text, StyleSheet, Modal, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics'

import { ToastFeedback as ToastFeedbackComponent } from './components/ToastFeedback';

import { event } from '../../services/event';

interface ToastFeedbackProps {
  delay?: number;
}

export interface ToastFeedbackConfig {
  animationType?: "none" | "fade" | "slide";
  message?: string;
  icon?: any;
  duration?: number; // Tempo opcional de exibição em milissegundos
} 

export interface ToastFeedbackEvent {
  type: string; 
  config?: ToastFeedbackConfig;
}

export interface ToastFeedbackMethods {
  open(config?: ToastFeedbackConfig): () => void;
  close(): void;
  on(type: string, fn: (event: ToastFeedbackEvent) => void): () => void
} 

export const ToastFeedbackHandler = React.forwardRef<ToastFeedbackMethods, ToastFeedbackProps>(({
  delay = 300
}, ref) => {
  const [config, setConfig] = React.useState<ToastFeedbackConfig | undefined>(undefined);
  const [visible, setVisible] = React.useState<boolean>(false);

  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const methods = React.useMemo(() => ({
    open (config?: ToastFeedbackConfig) {

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      Keyboard.dismiss();

      setConfig(config);

      setVisible(true);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

      if (config?.duration) {
        timeoutRef.current = setTimeout(this.close, config.duration);
      }
      
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
      event.on(`toastFeedback:${type}`, fn);
  
      return () => {
        event.off(`toastFeedback:${type}`, fn);
      };
    }
  }), [timeoutRef])


  React.useImperativeHandle(ref, () => methods, [methods]);

  function onToastFeedbackEvent (event: ToastFeedbackEvent) {
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
    const unsubscribe = methods.on('root', onToastFeedbackEvent);

    return () => {
      unsubscribe();
    };
  }, [onToastFeedbackEvent, methods]);

  return (
    <ToastFeedbackComponent 
      delay={delay}
      visible={visible} 
      message={config?.message} 
      icon={config?.icon}
    />
  );
})

export const ToastFeedback: ToastFeedbackMethods = {
  open(config?: ToastFeedbackConfig) {
    event.emit('toastFeedback:root', { type: 'open', config });
    return () => this.close();
  },
  close() {
    event.emit('toastFeedback:root', { type: 'close' })
  },
  on(type: string, fn: (event: ToastFeedbackEvent) => void): () => void {
    event.on(`toastFeedback:${type}`, fn);

    return () => {
      event.off(`toastFeedback:${type}`, fn);
    };
  }
}




























// // ConfirmDialog.tsx
// import React from 'react';
// import { View, Text, Button, Modal, StyleSheet } from 'react-native';

// interface ConfirmDialogProps {
//   visible: boolean;
//   onConfirm: () => void;
//   onCancel: () => void;
//   message: string;
// }

// const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ visible, onConfirm, onCancel, message }) => {
//   return (
//     <Modal
//       transparent={true}
//       visible={visible}
//       animationType="fade"
//       onRequestClose={onCancel}
//     >
//       <View style={styles.overlay}>
//         <View style={styles.dialog}>
//           <Text style={styles.message}>{message}</Text>
//           <View style={styles.buttonContainer}>
//             <Button title="Cancelar" onPress={onCancel} />
//             <Button title="Confirmar" onPress={onConfirm} />
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   dialog: {
//     width: 300,
//     padding: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   message: {
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
// });
