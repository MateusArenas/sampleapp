import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

interface SnackBarProps {
  message: string;
  visible: boolean;
  duration?: number; // Tempo em milissegundos
  onClose: () => void;
}

export const SnackBar: React.FC<SnackBarProps> = ({ message, visible, duration = 3000, onClose }) => {
  const slideAnim = new Animated.Value(-100);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const hideTimeout = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onClose());
      }, duration);

      return () => clearTimeout(hideTimeout);
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim, duration, onClose]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.snackbar}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  snackbar: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    marginLeft: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
  },
});

