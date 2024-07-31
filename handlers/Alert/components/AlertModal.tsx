import React from 'react';
import { View, StyleSheet, ColorSchemeName, StyleProp, ViewStyle } from 'react-native';
import { Text, Dialog, Button, Divider, useTheme, ProgressBar, MD3Colors, Icon } from 'react-native-paper';

import * as Animatable from 'react-native-animatable';

import { UIActivityIndicator } from 'react-native-indicators';

export interface AlertModalButton  {
  text?: string
  onPress?: () => any 
  style?: ('confirm' | 'cancel')
}

export interface AlertModalConfig {
  type?: "info" | "question" | "success" | "warning" | "danger";
  title?: string;
  subtitle?: string;
  buttons?: AlertModalButton[];
  loading?: boolean;
  progress?: number | null;
}

type AlertModalExtraProps = Partial<React.ComponentProps<typeof Dialog>> & AlertModalConfig;

interface AlertModalProps extends AlertModalExtraProps {
  children?: React.ReactNode
  visible?: boolean
  colorScheme?: ColorSchemeName
  style?: StyleProp<ViewStyle>
}

export interface AlertModalMethods {
  show:   (config: AlertModalConfig) => void
  hidden: () => void
  setProgress: React.Dispatch<React.SetStateAction<number | null>>
}

const AlertModal = React.forwardRef<AlertModalMethods, AlertModalProps>(({ 
  style, 
  colorScheme: customColorScheme,
  ...props 
}, ref) => {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const [settings, setSettings] = React.useState<AlertModalConfig>({} as AlertModalConfig);
  const [progress, setProgress] = React.useState<number | null>(null);

  React.useImperativeHandle(ref, () => ({ 
    setProgress,
    show: (settings: AlertModalConfig) => {
      setVisible(true);
      setSettings({
        type: settings?.type ?? undefined,
        title: settings?.title ?? "",
        subtitle: settings?.subtitle ?? "",
        buttons: settings?.buttons ?? [],
        loading: settings?.loading ?? false,
      });

      setProgress(
        typeof settings.progress === "number" ? 
        settings.progress : null
      );
    }, 
    hidden: () => {
      setVisible(false);
    }
  }), [])

  const buttomcustom = React.useMemo(() => ({
    cancel: {
      textColor: "#f72200",
      buttonColor: "transparent",
    },
    confirm: {
      textColor: "#0069f7",
      buttonColor: "transparent",
    },
  }), []);

  const getButtomCustomProps = React.useCallback((style?: string, index?: number) => {
    const key = style || Object.keys(buttomcustom)?.[index || 1];
    return (buttomcustom[key as keyof typeof buttomcustom] || {});
  }, [buttomcustom]);

  const iconColor = React.useMemo(() => {
    switch (settings.type) {
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
  }, [settings.type]);


  const iconSource = React.useMemo(() => {
    switch (settings.type) {
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
  }, [settings.type]);

  return (
    <Dialog {...props} visible={visible}
        theme={{ colors: { backdrop: "rgba(0,0,0,.75)" } }}
        style={[
          style, 
          { backgroundColor: 'transparent' },
        ]}
      >
      <Animatable.View animation="pulse" style={[
          { backgroundColor: theme.colors.background },
          { borderRadius: 10, overflow: 'hidden' }, 
          style
        ]}
      >

        {!!settings?.type && (
          <View style={[{ alignSelf: 'center', marginTop: 20 }]}>
            <Icon 
              source={iconSource}
              size={40} 
              color={iconColor}
            />
          </View>
        )}

        {!!settings?.title && (
          <Dialog.Title style={{ textAlign: 'center' }}>
            {settings?.title}
          </Dialog.Title>
        )}

        <Dialog.Content >

            {!!settings?.subtitle && (
              <Text style={{ textAlign: 'center' }}
                variant="bodyMedium"
              >
                {settings?.subtitle}
              </Text>
            )}

            {!!settings?.loading && (
              <View style={[
                (!settings?.subtitle) && { marginTop: 24 }
              ]}>
                {typeof progress === "number" ? (
                  <View style={[
                    {
                      height: 32,
                      width: '100%',
                      display: "flex",
                      justifyContent: 'center', 
                      alignSelf: 'center',  
                    },
                  ]}>
                    <ProgressBar progress={progress} color={"#0069f7"} />
                  </View>
                ) : (
                  <View style={[
                    { 
                    height: 28, 
                    width: 28, 
                    display: 'flex',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    alignSelf: 'center',  
                    },
                    (!!settings?.subtitle) && { marginTop: 12 }
                  ]}>
                    <UIActivityIndicator size={28} color={theme.colors.outline} count={12}  />
                  </View>
                )}
              </View>
            )}
        </Dialog.Content>
        <Divider style={{ bottom: -1 }} />
        <View style={[
          { flexDirection: 'row', bottom: -1 },
        ]}>
            {settings?.buttons?.map((button, index) => (
              <View key={index} style={{ flex: 1 }}>
                <Button key={index} mode="contained"
                  onPress={button.onPress}
                  style={[
                    { borderRadius: 0 },
                    { elevation: 0, shadowColor: 'transparent',  },
                    index !== ((settings?.buttons?.length ?? 0) -1) && { 
                      borderRightWidth: StyleSheet.hairlineWidth, 
                      borderColor: theme.colors.outlineVariant,
                    }
                  ]} 
                  labelStyle={{ fontWeight: '400' }}
                  contentStyle={{ padding: 6 }}
                  {...getButtomCustomProps(button?.style, index)}
                >
                  {button?.text}
                </Button>
              </View>
            ))}
        </View>
        </Animatable.View>
    </Dialog>
  )
})

export default React.memo(AlertModal);