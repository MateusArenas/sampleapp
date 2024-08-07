import React from "react";

import * as Haptics from 'expo-haptics'
import { ColorSchemeName, Keyboard, View, StyleSheet, useWindowDimensions } from "react-native";
import { Portal, useTheme, Text, Divider, Button, IconButton, MD3Theme } from "react-native-paper";
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { event } from '../../services/event';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { SceneMap, SceneRendererProps, TabView } from "react-native-tab-view";

/**
 * Defines an option in the action sheet.
 * @interface ActionSheetOption
 * @property {IconSource} [icon] - Optional icon for the option.
 * @property {string} label - The label of the option.
 * @property {string} [value] - Optional value associated with the option.
 * @property {() => void} [onPress] - Callback function to execute when the option is pressed.
 */
export interface ActionSheetOption {
  key?: string;
  icon?: IconSource;
  label: string;
  value?: string;
  onPress?: () => void;
  options?: ActionSheetOption[];
}

/**
 * Configuration for the action sheet.
 * @interface ActionSheetConfig
 * @property {string} [id] - Optional identifier for the action sheet.
 * @property {string} [title] - Optional title of the action sheet.
 * @property {string} [description] - Optional description for additional information.
 * @property {ActionSheetOption[]} [options] - Array of options to display in the action sheet.
 * @property {(option?: ActionSheetOption) => void} [onChangeOption] - Callback function when an option is changed.
 * @property {() => void} [onClose] - Callback function when the action sheet is closed.
 */
export interface ActionSheetConfig {
  id?: string,
  title?: string;
  description?: string;
  options?: ActionSheetOption[];
  onChangeOption?: (option?: ActionSheetOption) => void;
  onClose?: () => void;
} 

/**
 * Properties for the ActionSheetHandler component.
 * @interface ActionSheetProps
 * @property {number} [bottomInset] - bottom inset value for adjusting the bottom padding of the action sheet content. This is useful for accommodating safe area insets on devices with notches or special screen cutouts.
 * @property {MD3Theme} theme - Theme object for styling.
 */
interface ActionSheetProps { 
  bottomInset: number;
  theme: MD3Theme;
}

/**
 * Methods to control the ActionSheet.
 * @interface ActionSheetMethods
 * @property {(config?: ActionSheetConfig) => void} open - Opens the action sheet with the given configuration.
 * @property {(duration?: number) => void} close - Closes the action sheet with an optional duration.
 * @property {(type: ActionSheetEvent['type'], fn: (event: ActionSheetEvent) => void) => () => void} on - Registers an event handler for the specified event type.
 */
export interface ActionSheetMethods {
  open(config?: ActionSheetConfig): void;
  close(duration?: number): void;
  on(type: ActionSheetEvent['type'], fn: (event: ActionSheetEvent) => void): () => void;
} 

/**
 * Event data for the action sheet.
 * @interface ActionSheetEvent
 * @property {string} type - The type of event (e.g., 'open', 'close').
 * @property {ActionSheetConfig} [config] - Configuration associated with the event.
 * @property {ActionSheetOption} [option] - Option related to the event.
 */
export interface ActionSheetEvent {
  type: string; 
  config?: ActionSheetConfig;
  option?: ActionSheetOption;
}

/**
 * Properties for the header of the action sheet.
 * @interface ActionSheetHeaderProps
 * @property {string} [title] - Optional title to display in the header.
 * @property {() => void} [onClose] - Callback function to execute when the close button is pressed.
 * @property {MD3Theme} theme - Theme object for styling.
 */
interface ActionSheetHeaderProps {
  title?: string;
  onClose?: () => void;
  theme: MD3Theme;
}

/**
 * A memoized component that renders the header of the action sheet.
 * @component ActionSheetHeader
 * @param {ActionSheetHeaderProps} props - Properties for the header.
 */
const ActionSheetHeader: React.FC<ActionSheetHeaderProps> = React.memo(({ title, onClose }) => {
  const theme = useTheme();
  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]} 
        variant="titleLarge" 
      >
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
  )
});

/**
 * Properties for the description of the action sheet.
 * @interface ActionSheetDescriptionProps
 * @property {string} [description] - Optional description to display.
 * @property {MD3Theme} theme - Theme object for styling.
 */
interface ActionSheetDescriptionProps {
  description?: string;
  theme: MD3Theme;
}

/**
 * A memoized component that renders the description of the action sheet.
 * @component ActionSheetDescription
 * @param {ActionSheetDescriptionProps} props - Properties for the description.
 */
const ActionSheetDescription: React.FC<ActionSheetDescriptionProps> = React.memo(({ description, theme }) => {
  if (!description) return null;

  return (
    <View style={[styles.descriptionContainer, { backgroundColor: theme.colors.elevation.level1 }]}>
      <Text style={{ color: theme.colors.onSurfaceVariant }}>
        {description}
      </Text>
    </View>
  );
});

/**
 * Properties for the list of options in the action sheet.
 * @interface ActionSheetOptionsListProps
 * @property {ActionSheetOption[]} [options] - Array of options to display.
 * @property {(option: ActionSheetOption) => void} onChangeOption - Callback function when an option is changed.
 * @property {MD3Theme} theme - Theme object for styling.
 */
interface ActionSheetOptionsListProps {
  options?: ActionSheetOption[];
  onChangeOption: (option: ActionSheetOption) => void;
  theme: MD3Theme;
}

/**
 * A memoized component that renders a list of options in the action sheet.
 * @component ActionSheetOptionsList
 * @param {ActionSheetOptionsListProps} props - Properties for the options list.
 */
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

/**
 * Properties for an individual option item in the action sheet.
 * @interface ActionSheetOptionsItemProps
 * @property {ActionSheetOption} [option] - The option to display.
 * @property {() => void} [onPress] - Callback function to execute when the option is pressed.
 */
interface ActionSheetOptionsItemProps {
  option?: ActionSheetOption;
  onPress?: () => void;
}

/**
 * A memoized component that renders an individual option item in the action sheet.
 * @component ActionSheetOptionsItem
 * @param {ActionSheetOptionsItemProps} props - Properties for the option item.
 */
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

/**
 * Properties for the footer of the action sheet.
 * @interface ActionSheetFooterProps
 * @property {string} [label] - Optional label to display in the footer.
 * @property {() => void} onClose - Callback function to execute when the footer button is pressed.
 * @property {MD3Theme} theme - Theme object for styling.
 */
interface ActionSheetFooterProps {
  label?: string;
  onClose: () => void;
  theme: MD3Theme;
}

/**
 * A memoized component that renders the footer of the action sheet.
 * @component ActionSheetFooter
 * @param {ActionSheetFooterProps} props - Properties for the footer.
 */
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

/**
 * A component that manages the lifecycle and interaction of the action sheet.
 * @component ActionSheetHandler
 * @param {ActionSheetProps} props - Properties for the action sheet handler.
 * @param {React.Ref<ActionSheetMethods>} ref - Ref object for the action sheet methods.
 * @returns {React.ReactElement} - The rendered action sheet component.
 */
export const ActionSheetHandler = React.forwardRef<ActionSheetMethods, ActionSheetProps>(({
  theme,
  bottomInset,
}, ref) => {
  const closeTimeoutRef = React.useRef<NodeJS.Timeout>();
  const changeTimeoutRef = React.useRef<NodeJS.Timeout>();

  const [config, setConfig] = React.useState<ActionSheetConfig | undefined>({});

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const methods = React.useMemo(() => ({
    open (config?: ActionSheetConfig) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

      setConfig(config);

      bottomSheetRef.current?.expand({ duration: 300 });

      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Rigid
      );
      event.emit('actionSheet:open', { type: 'open', config });
    },
    close (duration: number = 300) {
      bottomSheetRef.current?.close({ duration });
      
      config?.onClose?.();

      closeTimeoutRef.current = setTimeout(() => {
        setConfig({});
      }, duration);
      
      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Soft
      );
      event.emit('actionSheet:close', { type: 'open', config });
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
      clearTimeout(closeTimeoutRef.current);
      clearTimeout(changeTimeoutRef.current);
    };
  }, [onActionSheetEvent, methods]);

  const onChangeOption = React.useCallback((option: ActionSheetOption) => {
    
    const closeDuration = 300;
    methods.close(closeDuration);
    
    changeTimeoutRef.current = setTimeout(() => {
      config?.onChangeOption?.(option);
      option?.onPress?.();
    }, closeDuration);

    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );
    event.emit('actionSheet:change', { type: 'change', config, option });
  }, [config, methods])

  const backdropComponent = React.useCallback((props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop 
      {...props} 
      style={[props.style, styles.sheetBackdrop, { backgroundColor: theme.colors.backdrop }]} 
      appearsOnIndex={0} 
      disappearsOnIndex={-1} 
    />
  ), [theme]);

  return (
      <BottomSheet // Esse Componente já é memo.
        ref={bottomSheetRef}
        index={-1}
        backdropComponent={backdropComponent}
        backgroundStyle={[
          styles.sheetBackground,
          { backgroundColor: theme.colors.surface },
        ]}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.onSurfaceDisabled,
          width: 50,
          height: 6,
        }}
        enableDynamicSizing // deixa setado com a tamanho interno
        enablePanDownToClose
        keyboardBehavior="interactive" // sobe junto com o keyboard.
        keyboardBlurBehavior="restore" // volta para o lugar quando faz dimiss no keyboard;
        // enableHandlePanningGesture={false}
        // enableContentPanningGesture={false}
        // handleComponent={null}
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
          <View style={[styles.contentContainer, { marginBottom: bottomInset }]}>

            <ActionSheetHeader 
              theme={theme}
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
              theme={theme}
              label="Cancelar"
              onClose={() => methods.close()}
            />

          </View>
        </BottomSheetScrollView>
      </BottomSheet>
  );
})

/**
 * Provides a static interface to control the action sheet.
 * @constant ActionSheet
 */
export const ActionSheet: ActionSheetMethods = {
  /**
   * Opens the action sheet with the specified configuration.
   * @param {ActionSheetConfig} [config] - The configuration to use when opening the action sheet.
   */
  open(config: ActionSheetConfig) {
    event.emit('actionSheet:root', { type: 'open', config });
  },

  /**
   * Closes the action sheet.
   */
  close() {
    event.emit('actionSheet:root', { type: 'close' })
  },

  /**
   * Registers an event handler for a specific event type.
   * @param {string} type - The type of event to listen for.
   * @param {(event: ActionSheetEvent) => void} fn - The event handler function.
   * @returns {() => void} - A function to unregister the event handler.
   */
  on(type: string, fn: (event: ActionSheetEvent) => void): () => void {
    event.on(`actionSheet:${type}`, fn);

    return () => {
      event.off(`actionSheet:${type}`, fn);
    };
  }
}

// Styles used for the action sheet components.
const styles = StyleSheet.create({
  sheetBackdrop: {
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