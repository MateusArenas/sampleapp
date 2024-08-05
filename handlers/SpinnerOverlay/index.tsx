import React from 'react';
import { View, StyleSheet, Modal, Keyboard } from 'react-native';
import { useTheme, Text, Surface, MD3Theme } from 'react-native-paper';

import { UIActivityIndicator, UIActivityIndicatorProps } from 'react-native-indicators';

import * as Haptics from 'expo-haptics'
import { event } from '../../services/event';

const ActivityIndicator = UIActivityIndicator as unknown as React.FC<UIActivityIndicatorProps>;

interface SpinnerOverlayProps {
  bottomInset: number;
  theme: MD3Theme;
}

export interface SpinnerOverlayConfig {
  animationType?: "none" | "fade" | "slide";
  description?: string;
} 

export interface SpinnerOverlayEvent {
  type: string; 
  config?: SpinnerOverlayConfig;
}

export interface SpinnerOverlayMethods {
  open(config?: SpinnerOverlayConfig): () => void;
  close(): void;
  on(type: string, fn: (event: SpinnerOverlayEvent) => void): () => void
} 

export const SpinnerOverlayHandler = React.forwardRef<SpinnerOverlayMethods, SpinnerOverlayProps>(({}, ref) => {
  const theme = useTheme();

  const [config, setConfig] = React.useState<SpinnerOverlayConfig | undefined>({});
  const [visible, setVisible] = React.useState<boolean>(false);

  const methods = React.useMemo(() => ({
    open (config?: SpinnerOverlayConfig) {
      Keyboard.dismiss();

      setConfig(config);

      setVisible(true);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
      
      return () => this.close();
    },
    close () {
      setVisible(false);

      setConfig({});

      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Soft
      );
    },
    on(type: string, fn: (event: any) => void) {
      event.on(`spinnerOverlay:${type}`, fn);
  
      return () => {
        event.off(`spinnerOverlay:${type}`, fn);
      };
    }
  }), [])


  React.useImperativeHandle(ref, () => methods, [methods]);

  function onSpinnerOverlayEvent (event: SpinnerOverlayEvent) {
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
    const unsubscribe = methods.on('root', onSpinnerOverlayEvent);

    return () => {
      unsubscribe();
    };
  }, [onSpinnerOverlayEvent, methods]);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      animationType={config?.animationType ?? "fade"}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <Surface mode="elevated" elevation={2} style={[styles.cardContainer]}>

          <View style={[styles.activityIndicatorContainer]}>
            <ActivityIndicator size={32} color={theme.colors.onSurface} count={12} />
          </View>

          {!!config?.description && (
            <Text variant="labelLarge" >
              {config.description}
            </Text>
          )}
          
        </Surface>
      </View>
    </Modal>
  )
});

export const SpinnerOverlay: SpinnerOverlayMethods = {
  open(config: SpinnerOverlayConfig) {
    event.emit('spinnerOverlay:root', { type: 'open', config });
    return () => this.close();
  },
  close() {
    event.emit('spinnerOverlay:root', { type: 'close' })
  },
  on(type: string, fn: (event: SpinnerOverlayEvent) => void): () => void {
    event.on(`spinnerOverlay:${type}`, fn);

    return () => {
      event.off(`spinnerOverlay:${type}`, fn);
    };
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  activityIndicatorContainer: {
    minWidth: 42, 
    minHeight: 42, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
    minWidth: 120, 
    minHeight: 110, 
    borderRadius: 12,
    // // Sombra para iOS
    // shadowColor: '#000', // Cor da sombra
    // shadowOffset: { width: 0, height: 4 }, // Deslocamento da sombra
    // shadowOpacity: 0.15, // Opacidade da sombra
    // shadowRadius: 6, // Raio de desfoque da sombra
    // // Sombra para Android
    // elevation: 3, // Intensidade da sombra
  }
});