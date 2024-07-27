import React from "react";

import * as Haptics from 'expo-haptics'
import { ColorSchemeName, Keyboard, View, StyleSheet } from "react-native";
import { Portal, useTheme, Text, Divider, Button, IconButton, MD3Theme } from "react-native-paper";
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { event } from '../../services/event';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

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

interface ActionSheetHeaderProps {
  title?: string;
  onClose?: () => void;
}

const ActionSheetHeader: React.FC<ActionSheetHeaderProps> = React.memo(({ title, onClose }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle} variant="titleMedium">
      {title}
    </Text>
    {!!onClose && (
      <IconButton style={styles.closeButton}
        icon="close"
        mode="contained"
        size={20}
        onPress={onClose}
      />
    )}
  </View>
));

interface ActionSheetDescriptionProps {
  description?: string;
  theme: MD3Theme;
}

const ActionSheetDescription: React.FC<ActionSheetDescriptionProps> = React.memo(({ description, theme }) => {
  if (!description) return null;

  return (
    <View style={[styles.descriptionContainer, { backgroundColor: theme.colors.elevation.level1 }]}>
      <Text style={{ color: theme.colors.outline }}>
        {description}
      </Text>
    </View>
  );
});

interface ActionSheetOptionsListProps {
  options?: ActionSheetOption[];
  onChangeOption: (option: ActionSheetOption) => void;
  theme: MD3Theme;
}


const ActionSheetOptionsList: React.FC<ActionSheetOptionsListProps> = React.memo(({ options, onChangeOption, theme }) => {
  if (!options || options.length === 0) return null;

  return (
    <View style={[styles.optionsContainer, { backgroundColor: theme.colors.elevation.level1 }]}>
      {options.map((option, index) => (
        <React.Fragment key={option.label ?? option.value ?? index}>
          <ActionSheetOptionsItem 
            option={option}
            onPress={() => onChangeOption(option)}
          />
          {(options.length - 1) !== index && <Divider leftInset bold={false} />}
        </React.Fragment>
      ))}
    </View>
  );
});

interface ActionSheetOptionsItemProps {
  option?: ActionSheetOption;
  onPress?: () => void;
}

const ActionSheetOptionsItem: React.FC<ActionSheetOptionsItemProps> = React.memo(({ option, onPress }) => (
  <Button
    style={styles.optionsButton}
    contentStyle={styles.optionsButtonContent}
    icon={option?.icon}
    labelStyle={styles.optionsButtonLabel}
    mode="text"
    onPress={onPress}
  >
    {option?.label}
  </Button>
));

interface ActionSheetFooterProps {
  label?: string;
  onClose: () => void;
}

const ActionSheetFooter: React.FC<ActionSheetFooterProps> = React.memo(({ label, onClose }) => (
  <Button
    style={[{}]}
    contentStyle={[styles.optionsButtonContent, { justifyContent: 'center' }]}
    labelStyle={styles.optionsButtonLabel}
    mode="contained-tonal"
    onPress={onClose}
  >
    {label}
  </Button>
));

export const ActionSheetHandler = React.forwardRef<ActionSheetMethods, ActionSheetProps>(({
  colorScheme,
}, ref) => {
  const [config, setConfig] = React.useState<ActionSheetConfig | undefined>({});

  const theme = useTheme();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

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
      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Soft
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


  React.useImperativeHandle(ref, () => methods, [methods]);

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
  }, [onActionSheetEvent, methods]);

  const onChangeOption = React.useCallback((option: ActionSheetOption) => {
    event.emit('actionSheet:change', { type: 'change', config, option });
    option?.onPress?.();
    config?.onChangeOption?.(option);
    methods.close(300);
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );
  }, [config, methods])

  const backdropComponent = React.useCallback((props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop 
      {...props} 
      style={[props.style, styles.sheetBackdrop]} 
      appearsOnIndex={0} 
      disappearsOnIndex={-1} 
    />
  ), []);

  return (
      <BottomSheet // Esse Componente já é memo.
        ref={bottomSheetRef}
        index={-1}
        backdropComponent={backdropComponent}
        backgroundStyle={[
          styles.sheetBackground,
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
          <View style={[styles.contentContainer, { marginBottom: insets.bottom }]}>

            <ActionSheetHeader 
              title={config?.title}
              // onClose={() => methods.close()}
            />

            <ActionSheetDescription 
              theme={theme}
              description={config?.description}
            />

            <ActionSheetOptionsList
              theme={theme}
              options={config?.options}
              onChangeOption={onChangeOption}
            />

            <ActionSheetFooter 
              label="Cancelar"
              onClose={() => methods.close()}
            />

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