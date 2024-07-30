import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: IconSource; // Nome do ícone (e.g., 'add')
  label?: string; // Texto opcional que pode aparecer ao lado do ícone
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onPress, icon, label }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Icon source={icon} size={24} color="#fff" />
      </TouchableOpacity>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Para Android
    shadowColor: '#000', // Para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  label: {
    marginTop: 8,
    color: '#f50',
    fontWeight: 'bold',
    fontSize: 14,
  },
});