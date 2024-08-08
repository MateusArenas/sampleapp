import React from "react";
import { Button, Dialog, Divider, Icon, MD3Theme, ProgressBar, Text, useTheme } from "react-native-paper";
import * as Animatable from 'react-native-animatable';
import { Keyboard, View, StyleSheet } from "react-native";
import { event } from '../../services/event';
import * as Haptics from 'expo-haptics'

import { UIActivityIndicator, UIActivityIndicatorProps } from 'react-native-indicators';
import sleep from "../utils/sleep";

const ActivityIndicator = UIActivityIndicator as unknown as React.FC<UIActivityIndicatorProps>;

export type AlertType = "info" | "question" | "success" | "warning" | "danger";

export interface AlertConfig {
  type?: AlertType;
  title?: string;
  subtitle?: string;
  dismissable?: boolean;
  dismiss?: () => void;
  buttons?: Array<{
    label?: string;
    color?: string;
    onPress?: () => void; 
  }>;
} 

export interface AlertEvent {
  type: string; 
  config?: AlertSimpleConfig | AlertConfirmConfig | AlertCustomConfig;
}

interface AlertConfirmConfig {
  type?: AlertType;
  title?: string;
  subtitle?: string;
  cancelLabel?: string;
  cancel?: () => void;
  acceptLabel?: string;
  accept?: () => void;
  dismissable?: boolean;
  dismiss?: () => void;
}

interface AlertSimpleConfig {
  type?: AlertType;
  title?: string;
  subtitle?: string;
  acceptLabel?: string;
  accept?: () => void;
  dismissable?: boolean;
  dismiss?: () => void;
}

interface AlertCustomConfig {
  type?: AlertType;
  title?: string;
  subtitle?: string;
  cancel?: () => void;
  dismissable?: boolean;
  dismiss?: () => void;
  buttons?: Array<{
    label: string;
    color?: string;
    onPress?: () => void;
  }>
}

interface AlertMethods {
  simple(config: AlertSimpleConfig): Promise<boolean>;
  confirm(config: AlertConfirmConfig): Promise<boolean>;
  custom(config: AlertCustomConfig): Promise<boolean>;
  on(type: string, fn: (event: any) => void): () => void;
}

interface AlertProps {
  bottomInset: number;
  theme: MD3Theme;
}

export const AlertHandler = React.forwardRef<AlertMethods, AlertProps>(({
  bottomInset,
  theme,
}, ref) => {
  const [visible, setVisible] = React.useState(false);
  const [config, setConfig] = React.useState<AlertConfig>({} as AlertConfig);

  const handleAction = async (callback?: () => any) => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );
    setVisible(false);
    await sleep(250);
    callback?.();
  }

  const methods = React.useMemo(() => ({
    async simple (config: AlertSimpleConfig): Promise<boolean> {
      return new Promise<boolean>((resolve) => {

        Keyboard.dismiss();

        Haptics.impactAsync(
          Haptics.ImpactFeedbackStyle.Heavy
        );

        setVisible(true);

        setConfig({
          type: config.type || "info",
          title: config.title || 'Attention',
          subtitle: config.subtitle || '',
          dismissable: config?.dismissable || false,
          buttons: [
            {
              label: config?.acceptLabel || "OK",
              onPress: async () => {
                await handleAction(config.accept);
                resolve(true);
              }
            }
          ]
        });
      });
    },
    async confirm (config: AlertConfirmConfig): Promise<boolean> {
      return new Promise<boolean>((resolve) => {

        Keyboard.dismiss();

        Haptics.impactAsync(
          Haptics.ImpactFeedbackStyle.Heavy
        );

        setVisible(true);
        
        setConfig({
          type: config.type || "question",
          title: config.title || 'Attention',
          subtitle: config.subtitle || '',
          dismissable: config?.dismissable || false,
          dismiss: async () => {
            await handleAction(config.dismiss);
            resolve(false);
          },
          buttons: [
            {
              label: config.cancelLabel || "No",
              color: "#FF3B30",
              onPress: async () => {
                await handleAction(config.cancel);
                resolve(false);
              },
            },
            {
              label: config.cancelLabel || "Yes",
              color: "#0A84FF",
              onPress: async () => {
                await handleAction(config.accept);
                resolve(true);
              }
            }
          ]
        });
      });
    },
    async custom (config: AlertCustomConfig): Promise<boolean> {
      return new Promise<boolean>((resolve) => {

        Keyboard.dismiss();

        Haptics.impactAsync(
          Haptics.ImpactFeedbackStyle.Heavy
        );

        setVisible(true);

        setConfig({
          type: config.type,
          title: config.title || '',
          subtitle: config.subtitle || '',
          dismissable: config?.dismissable || true,
          dismiss: async () => {
            await handleAction(config.dismiss);
            resolve(false);
          },
          buttons: config?.buttons?.map(button => ({
            label: button?.label || 'OK',
            color: "#0A84FF",
            onPress: async () => {
              await handleAction(button?.onPress);
              resolve(true);
            }
          })) ?? []
        });
      });
    },
    on(type: string, fn: (event: any) => void) {
      event.on(`alert:${type}`, fn);
  
      return () => {
        event.off(`alert:${type}`, fn);
      };
    },
  }), [])

  React.useImperativeHandle(ref, () => methods, [methods]);

  const iconColor = React.useMemo(() => {
    switch (config?.type) {
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
  }, [config?.type]);


  const iconSource = React.useMemo(() => {
    switch (config?.type) {
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
  }, [config?.type]);

  const onAlertEvent = React.useCallback((event: AlertEvent) => {
    switch (event.type) {
      case 'simple':
        methods.simple(event?.config!);
        break;
      case 'confirm':
        methods.confirm(event?.config!);
        break;
      case 'custom':
        methods.custom(event?.config!);
        break;
      default:
        break;
    }
  }, [methods])

  React.useEffect(() => {
    const unsubscribe = methods.on('root', onAlertEvent);

    return () => {
      unsubscribe();
    };
  }, [onAlertEvent, methods]);

  return (
    <Dialog visible={visible}
        onDismiss={config?.dismiss}
        dismissable={config?.dismissable || false}
        dismissableBackButton={config?.dismissable || false}
        theme={{ colors: { backdrop: "rgba(0,0,0,.75)" } }}
        style={[
          { minWidth: 260, maxWidth: 280, alignSelf: 'center' },
          { backgroundColor: 'transparent' },
        ]}
      >
      <Animatable.View animation="pulse" style={[
          { backgroundColor: theme.colors.surface },
          { borderRadius: 10, overflow: 'hidden' }, 
          { minWidth: 260, maxWidth: 280, alignSelf: 'center' },
        ]}
      >

        {!!config?.type && (
          <View style={[{ alignSelf: 'center', marginTop: 20 }]}>
            <Icon 
              source={iconSource}
              size={40} 
              color={iconColor}
            />
          </View>
        )}

        {!!config?.title && (
          <Dialog.Title style={{ textAlign: 'center' }}>
            {config.title}
          </Dialog.Title>
        )}

        <Dialog.Content >

            {!!config?.subtitle && (
              <Text style={{ textAlign: 'center' }}
                variant="bodyMedium"
              >
                {config.subtitle}
              </Text>
            )}

        </Dialog.Content>
        <Divider style={{ bottom: -1 }} />
        {!!config?.buttons && (
          <View style={[
            { flexDirection: 'row', bottom: -1 },
            config.buttons.length > 2 && { flexDirection: 'column' }
          ]}>
              {config?.buttons?.map((button, index) => (
                <View key={index} style={[
                  config.buttons!.length <= 2 && { flex: 1 },
                ]}>
                  <Button key={index} mode="contained"
                    onPress={button.onPress}
                    style={[
                      { borderRadius: 0 },
                      { elevation: 0, shadowColor: 'transparent',  },
                      index !== (config.buttons!.length -1) && (
                        config.buttons!.length > 2 ?
                        {
                          borderBottomWidth: StyleSheet.hairlineWidth, 
                          borderColor: theme.colors.outlineVariant,
                        }
                        :
                        { 
                          borderRightWidth: StyleSheet.hairlineWidth, 
                          borderColor: theme.colors.outlineVariant,
                        }
                      )
                    ]} 
                    labelStyle={{ fontWeight: '400' }}
                    contentStyle={{ padding: 6 }}
                    textColor={button?.color}
                    buttonColor={"transparent"}
                    // {...getButtomCustomProps(button?.style, index)}
                  >
                    {button?.label}
                  </Button>
                </View>
              ))}
          </View>
        )}
        </Animatable.View>
    </Dialog>
  );
});

export const Alert: AlertMethods = {
  simple(config: AlertSimpleConfig) {
    return new Promise((resolve) => {
      event.emit('alert:root', { 
        type: 'simple', 
        config: {
          ...config,
          accept() {
            config?.accept?.();
            resolve(true);
          },
          dimiss() {
            config?.dismiss?.();
            resolve(false);
          },
        }
      });
    })
  },
  confirm(config: AlertConfirmConfig) {
    return new Promise((resolve) => {
      event.emit('alert:root', { 
        type: 'confirm', 
        config: {
          ...config,
          accept() {
            config?.accept?.();
            resolve(true);
          },
          cancel() {
            config?.cancel?.();
            resolve(false);
          },
          dimiss() {
            config?.dismiss?.();
            resolve(false);
          },
        }
      });
    })
  },
  custom(config: AlertCustomConfig) {
    return new Promise((resolve) => {
      event.emit('alert:root', { 
        type: 'custom', 
        config: {
          ...config,
          dimiss() {
            config?.dismiss?.();
            resolve(false);
          },
          buttons: config?.buttons?.map(button => ({
            ...button,
            onPress: async () => {
              button?.onPress?.();
              resolve(true);
            }
          })) ?? []
        }
      });
    })
  },
  on(type: string, fn: (event: AlertEvent) => void): () => void {
    event.on(`alert:${type}`, fn);

    return () => {
      event.off(`alert:${type}`, fn);
    };
  },
}