import React from 'react';
import { View, Text, StyleSheet, Modal, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics'

import { ToastMessage as ToastMessageComponent } from './components/ToastMessage';

import { event } from '../../services/event';

interface ToastMessageProps {

}

export interface ToastMessageConfig {
  animationType?: "none" | "fade" | "slide";
  message: string;
  duration?: number; // Tempo opcional de exibição em milissegundos
} 

export interface ToastMessageEvent {
  type: string; 
  config?: ToastMessageConfig;
}

export interface ToastMessageMethods {
  open(config?: ToastMessageConfig): () => void;
  close(): void;
  on(type: string, fn: (event: ToastMessageEvent) => void): () => void
} 

export const ToastMessageHandler = React.forwardRef<ToastMessageMethods, ToastMessageProps>(({  }, ref) => {
  const [config, setConfig] = React.useState<ToastMessageConfig | undefined>(undefined);
  const [visible, setVisible] = React.useState<boolean>(false);

  const methods = React.useMemo(() => ({
    open (config?: ToastMessageConfig) {
      Keyboard.dismiss();

      setConfig(config);

      setVisible(true);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

      if (!!config?.duration) {
        setTimeout(this.close, config.duration);
      }
      
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
      event.on(`toastMessage:${type}`, fn);
  
      return () => {
        event.off(`toastMessage:${type}`, fn);
      };
    }
  }), [])


  React.useImperativeHandle(ref, () => methods, [methods]);

  function onToastMessageEvent (event: ToastMessageEvent) {
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
    const unsubscribe = methods.on('root', onToastMessageEvent);

    return () => {
      unsubscribe();
    };
  }, [onToastMessageEvent, methods]);

  return (
    <ToastMessageComponent 
      visible={visible} 
      message={config?.message ?? "OK"} 
    />
  );
})

export const ToastMessage: ToastMessageMethods = {
  open(config?: ToastMessageConfig) {
    event.emit('toastMessage:root', { type: 'open', config });
    return () => this.close();
  },
  close() {
    event.emit('toastMessage:root', { type: 'close' })
  },
  on(type: string, fn: (event: ToastMessageEvent) => void): () => void {
    event.on(`toastMessage:${type}`, fn);

    return () => {
      event.off(`toastMessage:${type}`, fn);
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
