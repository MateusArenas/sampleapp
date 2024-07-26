import React from "react";

import * as Haptics from 'expo-haptics'
import { ColorSchemeName, Keyboard, View, StyleSheet } from "react-native";
import { Portal, useTheme, Text, Divider, Button, IconButton } from "react-native-paper";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { event } from '../../services/event';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

export interface ActionSheetOption {
  icon?: IconSource;
  label: string;
  value?: string;
  onPress?: () => void;
}

export interface ActionSheetConfig {
  id?: string,
  title?: string;
  description?: string;
  options?: ActionSheetOption[];
  onChangeOption?: (option?: ActionSheetOption) => void;
  onClose?: () => void;
} 

interface ActionSheetProps { 
  colorScheme?: ColorSchemeName;
}

export interface ActionSheetMethods {
  open(config?: ActionSheetConfig): void;
  close(duration?: number): void;
  on(type: ActionSheetEvent['type'], fn: (event: ActionSheetEvent) => void): () => void;
} 

export interface ActionSheetEvent {
  type: string; 
  config?: ActionSheetConfig;
  option?: ActionSheetOption;
}

export const ActionSheetHandler = React.forwardRef<ActionSheetMethods, ActionSheetProps>(({
  colorScheme,
}, ref) => {
  const [config, setConfig] = React.useState<ActionSheetConfig | undefined>({});
  const theme = useTheme();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  function onActionSheetEvent (event: ActionSheetEvent) {
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
    const unsubscribe = methods.on('root', onActionSheetEvent);

    return () => {
      unsubscribe();
    };
  }, [onActionSheetEvent]);

  function onChangeOption (option: ActionSheetOption) {
    event.emit('actionSheet:change', { type: 'change', config, option });
    option?.onPress?.();
    config?.onChangeOption?.(option);
    methods.close(300);
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
  }

  const methods = React.useMemo(() => ({
    open (config?: ActionSheetConfig) {
      event.emit('actionSheet:open', { type: 'open', config });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
      bottomSheetRef.current?.expand();
      setConfig(config);
    },
    close (duration: number = 300) {
      event.emit('actionSheet:close', { type: 'open', config });
      config?.onClose?.();
      bottomSheetRef.current?.forceClose({ duration });
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning
      );
      setTimeout(() => setConfig({}), duration);
    },
    on(type: string, fn: (event: any) => void) {
      event.on(`actionSheet:${type}`, fn);
  
      return () => {
        event.off(`actionSheet:${type}`, fn);
      };
    }
  }), [config])


  React.useImperativeHandle(ref, () => methods, []);

  return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        // backdropComponent={BottomSheetBackdrop}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} 
            style={[props.style, styles.sheetBackdrop]}
            appearsOnIndex={0} 
            disappearsOnIndex={-1} 
          />
        )}
        backgroundStyle={[
          styles.sheetBackground,
          { paddingBottom: insets.bottom },
          { backgroundColor: theme.colors.background },
        ]}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.outline
        }}
        enableDynamicSizing // deixa setado com a tamanho interno
        enablePanDownToClose
        keyboardBehavior="interactive" // sobe junto com o keyboard.
        keyboardBlurBehavior="restore" // volta para o lugar quando faz dimiss no keyboard;
        // enableHandlePanningGesture={false}
        // enableContentPanningGesture={false}
        handleComponent={null}
        android_keyboardInputMode="adjustResize"
        // bottomInset={insets.bottom}
        // onChange={() => {
        //   Keyboard.dismiss();
        // }}
        // onClose={() => {
        //   Keyboard.dismiss();
        // }}
      >
        <BottomSheetScrollView 
          // scrollEnabled={false} 
          // pinchGestureEnabled={false}
          bounces={false}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="always"
        >
          <View style={[styles.contentContainer]}>

            <View style={[styles.headerContainer]}>

              <Text style={[styles.headerTitle]}
                variant="titleMedium"
              >
                {config?.title}
              </Text>

              <IconButton style={[styles.closeButton]}
                icon="close"
                mode="contained"
                size={20}
                onPress={() => methods.close()}
              />
            </View>

            {!!config?.description && (
              <View style={[
                styles.descriptionContainer,
                { backgroundColor: theme.colors.elevation.level1 },
              ]}>
                <Text style={[{ color: theme.colors.outline }]}>
                  {config.description}
                </Text>
              </View>
            )}

            <View style={[
              styles.optionsContainer,
              { backgroundColor: theme.colors.elevation.level1 },
            ]}>
              {config?.options?.map((option, index) => (
                  <View key={option.label ?? option.value ?? index}>
                    <Button style={[styles.optionsButton]}
                      contentStyle={[styles.optionsButtonContent]} 
                      icon={option?.icon}
                      labelStyle={[styles.optionsButtonLabel]} 
                      mode="text" 
                      onPress={() => onChangeOption(option)}
                    >
                      {option.label}
                    </Button>
                    {(config?.options!.length - 1) !== index && (
                      <Divider leftInset bold={false}  />
                    )}
                  </View>
                )
              )}
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
  );
})

const styles = StyleSheet.create({
  sheetBackdrop: {
    backgroundColor: 'rgba(0,0,0,.2)'
  },
  sheetBackground: {
    borderBottomRightRadius: 0, 
    borderBottomLeftRadius: 0,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    gap: 20,
  },
  headerContainer: {
    flexDirection: 'row', 
    position: 'relative',
  },
  headerTitle: {
    flex: 1, 
    textAlign: 'center', 
    fontWeight: '700', 
    alignSelf: 'center',
    marginTop: 6, 
    paddingHorizontal: 60
  },
  closeButton: {
    position: 'absolute', 
    top: 0, 
    right: 0, 
    margin: 0,
  },
  descriptionContainer: {
    borderRadius: 10, 
    overflow: 'hidden', 
    padding: 16,
  },
  optionsContainer: {
    borderRadius: 10, 
    overflow: 'hidden', 
    marginBottom: 16,
  },
  optionsButton: {
    borderRadius: 0,
  },
  optionsButtonContent: {
    justifyContent: 'flex-start', 
    padding: 4,
  },
  optionsButtonLabel: {
    fontSize: 16,
  },
});


export const ActionSheet: ActionSheetMethods = {
  open(config) {
    event.emit('actionSheet:root', { type: 'open', config })
  },
  close() {
    event.emit('actionSheet:root', { type: 'close' })
  },
  on(type, fn) {
    event.on(`actionSheet:${type}`, fn);

    return () => {
      event.off(`actionSheet:${type}`, fn);
    };
  }
}