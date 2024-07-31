import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Icon, useTheme, Text } from 'react-native-paper';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface ToastFeedbackProps {
  visible: boolean;
  message?: string;
  icon?: any;
  delay?: number;
}

// 4. ConfirmDialog
// Se precisar de um diálogo de confirmação, pode usar um componente personalizado:
// 5. ToastFeedback
// Para exibir mensagens de feedback simples, você pode usar um componente de toast personalizado:

export const ToastFeedback: React.FC<ToastFeedbackProps> = ({ visible, icon, message, delay = 300 }) => {
  const theme = useTheme();
    
  const [shouldRender, setShouldRender] = React.useState(visible); // Estado para controlar a renderização
  
  const opacity = useSharedValue(0); // Valor inicial da opacidade

  React.useEffect(() => {
    if (visible) {
      setShouldRender(true); // Começa a renderizar o componente
      opacity.value = withTiming(1, { duration: delay, easing: Easing.out(Easing.exp) });
    } else {
      opacity.value = withTiming(0, { duration: delay, easing: Easing.in(Easing.exp) }, () => {
        runOnJS(setShouldRender)(false); // Remove o componente após a animação
      });
    }
  }, [visible]);

  // Animação de opacidade
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  if (!shouldRender) return null;

  return (
    <View style={[styles.overlay, StyleSheet.absoluteFillObject]}>
      <Animated.View style={[styles.toast, { backgroundColor: theme.colors.surface }, animatedStyle]}>
        {!!icon && (
          <Icon 
            source={icon} 
            size={32} 
            color={theme.colors.onSurface}
          />
        )}
        {!!message && (
          <Text style={[styles.message, { color: theme.colors.onSurface }]}
            variant="labelLarge"
          >
            {message}
          </Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', // Permite interação com o conteúdo abaixo
  },
  toast: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  icon: {

  },
  message: {
    fontSize: 16,
  },
});

