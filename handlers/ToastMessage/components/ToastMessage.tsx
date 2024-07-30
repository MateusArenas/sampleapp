import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';

interface ToastMessageProps {
  visible: boolean;
  message: string;
}

// 4. ConfirmDialog
// Se precisar de um diálogo de confirmação, pode usar um componente personalizado:
// 5. ToastMessage
// Para exibir mensagens de feedback simples, você pode usar um componente de toast personalizado:

export const ToastMessage: React.FC<ToastMessageProps> = ({ visible, message }) => {
  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.toast}>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toast: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  message: {
    color: 'white',
    fontSize: 16,
  },
});

