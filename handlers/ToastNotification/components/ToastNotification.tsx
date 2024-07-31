import React from 'react';
import { Dimensions, PanResponder, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, TouchableHighlight } from 'react-native-gesture-handler';
import { Icon, useTheme, Text } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, Easing, useAnimatedGestureHandler, runOnJS, withSequence } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export interface ToastNotificationProps {
  type?: "info" | "question" | "success" | "warning" | "danger";
  title?: string;
  description?: string;
  visible?: boolean;
  onDismiss?: () => void;
  onPress?: () => void;
}

export const TOAST_NOTIFICATION_STATIC_HEIGHT = 112;

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  type,
  visible = false,
  title,
  description,
  onDismiss,
  onPress,
}) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const offset = 12;

  const RETRACTION_HEIGHT = (TOAST_NOTIFICATION_STATIC_HEIGHT + (offset * 2) + insets.top);

  const [shouldRender, setShouldRender] = React.useState(visible); // Estado para controlar a renderização

  // const panY = React.useRef(new Animated.Value(-RETRACTION_HEIGHT)).current;

  const scale = useSharedValue(1);
  const translateY = useSharedValue(-RETRACTION_HEIGHT);
  const panY = useSharedValue(0);

  // Easing para abrir (entrada)
  const openEasing = Easing.inOut(Easing.quad); // Acelera e desacelera suavemente

  // Easing para fechar (saída)
  const closeEasing = Easing.out(Easing.exp); // Começa rápido e desacelera exponencialmente
  

  // React.useEffect(() => {
  //   if (visible) {
  //     openAnim.start();
  //   } else {
  //     closeAnim.start();
  //   }

  //   return () => {
  //     console.log('cleanup!');
      
  //   }
  // }, [visible])

  React.useEffect(() => {
    if (visible) {
      setShouldRender(true); // Começa a renderizar o componente
      panY.value = 0;
      translateY.value = withTiming(0, { duration: 300, easing: openEasing });
    } else {
      panY.value = 0;
      translateY.value = withTiming(-RETRACTION_HEIGHT, { duration: 900, easing: closeEasing }, () => {
        runOnJS(setShouldRender)(false); // Remove o componente após a animação
      });
    }
  }, [visible]);

  // Estilo animado para o clique
  const handlePress = () => {
    onPress?.();
    scale.value = withSequence(
      withSpring(1.1, { damping: 2, stiffness: 150 }), // Expande o componente
      withSpring(1, { damping: 2, stiffness: 150 })  // Retorna ao tamanho original
    );
  };

  const handlePressIn = () => {
    scale.value = withSpring(1.01, { damping: 2, stiffness: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 2, stiffness: 100 });
  };

  // Easing para abrir (entrada)
  // const openEasing = Easing.inOut(Easing.quad); // Acelera e desacelera suavemente

  // const openAnim = Animated.timing(panY, {
  //   toValue: 0,
  //   duration: 300,
  //   useNativeDriver: false,
  //   easing: openEasing,
  // })
  
  // Easing para fechar (saída)
  // const closeEasing = Easing.out(Easing.exp); // Começa rápido e desacelera exponencialmente

  // const closeAnim = Animated.timing(panY, {
  //   toValue: -RETRACTION_HEIGHT,
  //   duration: 300,
  //   useNativeDriver: false,
  //   easing: closeEasing
  // })

  // const translateY = panY.interpolate({
  //   inputRange: [-RETRACTION_HEIGHT, 0],
  //   outputRange: [-RETRACTION_HEIGHT, 0],
  //   extrapolate: 'clamp',
  // });

  // Estilo animado para a notificação
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value + panY.value }, { scale: scale.value }],
    };
  });

  // const panResponders = React.useRef(PanResponder.create({
  //   onStartShouldSetPanResponder: () => true,
  //   onMoveShouldSetPanResponder: () => false,
  //   onPanResponderMove: Animated.event([
  //     null, {dy: panY}, 
  //   ], {useNativeDriver: false}),
  //   onPanResponderRelease: (e, gs) => {
  //     const isDistanceToClose = gs.dy < -30;
  //     const isVelocityToClose = gs.vy < -.2;

  //     console.log({ gv: gs.dy });
      
  //     if (gs.dy === 0 && gs.vy === 0) { // Quando é somente precionado.
  //       onPress?.();
  //       return closeAnim.start();
  //     }
      
  //     if (isDistanceToClose && isVelocityToClose) { // Ajuste o valor conforme necessário
  //       return closeAnim.start(() => onDismiss?.());
  //     }
  //     return openAnim.start();
  //   },
  // })).current;

  // Gestor de gestos
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
    },
    onActive: (event, context) => {
      if (event.translationY < 0) {
        panY.value = event.translationY * 0.75; // Reduz a força do arrasto
      }
    },
    onEnd: (event) => {
      if (panY.value < -30 && event.velocityY < -0.2) {
        // Se o arrasto for significativo, feche a notificação
        translateY.value = withTiming(-RETRACTION_HEIGHT, { duration: 900, easing: closeEasing }, () => {
          if (onDismiss) runOnJS(onDismiss)();
        });

      } else {
        // Caso contrário, retorne à posição original
        panY.value = withSpring(0, { damping: 2, stiffness: 100 });
      }
    },
  });

  const iconColor = React.useMemo(() => {
    switch (type) {
      case 'info':
        return "#6edff6";
      case 'question':
        return "#636f79";
      case 'success':
        return "#0069f7";
      case 'warning':
        return "#ff9500";
      case 'danger':
        return "#f72200";
    }

    return "";
  }, [type]);


  const iconSource = React.useMemo(() => {
    switch (type) {
      case 'info':
        return "information";
      case 'question':
        return "help-circle";
      case 'success':
        return "check-circle";
      case 'warning':
        return "alert-circle";
      case 'danger':
        return "close-circle";
    }

    return "";
  }, [type]);


  if (!shouldRender) return null;

  return (
    <GestureHandlerRootView style={[styles.wrapper, { padding: offset }]}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              styles.container,
              styles.shadow,
              { backgroundColor: theme.colors.surface },
              animatedStyle,
              { top: insets.top },
              { height: TOAST_NOTIFICATION_STATIC_HEIGHT },
            ]}
          >
            <TouchableHighlight
              underlayColor={theme.colors.elevation.level1}
              onPress={handlePress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', gap: 16 }]}>
                  <View style={[{ alignSelf: 'center' }]}>
                    {!!type && (
                      <Icon 
                        source={iconSource}
                        color={iconColor}
                        size={40} 
                      />
                    )}
                  </View>

                  <View style={[{ flex: 1 }]}>
                    <Text style={[{ color: theme.colors.onSurface}]}
                      variant="titleMedium"
                    >
                      {title}
                    </Text>
                    <Text style={[{ color: theme.colors.onSurfaceVariant }]}
                      variant="bodySmall"
                      numberOfLines={2}
                    >
                      {description}
                    </Text>
                  </View>
              </View>
              </TouchableHighlight>
              <View style={[styles.handle, { backgroundColor: theme.colors.surfaceDisabled },]}/>
          </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 8,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  card: {
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 50,
    height: 6,
    borderRadius: 10,
    alignSelf: 'center',
    margin: 12,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  shadow: {
    // Sombra para iOS
    shadowColor: '#000', // Cor da sombra
    shadowOffset: { width: 0, height: 4 }, // Deslocamento da sombra
    shadowOpacity: 0.15, // Opacidade da sombra
    shadowRadius: 6, // Raio de desfoque da sombra
    // Sombra para Android
    elevation: 3, // Intensidade da sombra
  }
});
