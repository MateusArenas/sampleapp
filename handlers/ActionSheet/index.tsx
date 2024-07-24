import React from "react";

import * as Haptics from 'expo-haptics'
import { ColorSchemeName, Keyboard, View, StyleSheet } from "react-native";
import { Portal, useTheme, Text, Divider, Button, IconButton } from "react-native-paper";
import sleep from "../utils/sleep";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { event } from '../../services/event';

export interface ActionSheetOptions {
  title?: string;
  description?: string;
  options?: Array<{
    label: string;
    value?: string;
    onPress?: () => void;
  }>;
  onChangeOption?: (value?: string) => void;
} 

export interface ActionSheetContextData {
  close(): void;
  open(options?: ActionSheetOptions): void;
}

const ActionSheetContext = React.createContext<ActionSheetContextData>({} as ActionSheetContextData)

interface ActionSheetProviderProps { 
  children: React.ReactNode;
  colorScheme?: ColorSchemeName;
}

export const ActionSheetProvider: React.FC<ActionSheetProviderProps> = ({ colorScheme, children }) => {
  const ActionSheetRef = React.useRef<ActionSheetMethods>(null);

  function onActionSheetEvent (event: { type: string, options?: ActionSheetOptions }) {
    switch (event.type) {
      case 'open':
          open(event?.options);
        break;
      case 'close':
          close();
        break;
      default:
        break;
    }
  }

  React.useEffect(() => {
    event.on("actionSheet", onActionSheetEvent);

    return () => {
      event.off("actionSheet", onActionSheetEvent);
    };
  }, [onActionSheetEvent]);

  function open (options?: ActionSheetOptions) {
    ActionSheetRef.current?.open(options);
  }

  function close () {
    ActionSheetRef.current?.close();
  }

  return (
    <ActionSheetContext.Provider value={{ open, close }} >
      {children}
        
      <Portal>

        <ActionSheetComponent ref={ActionSheetRef}

        />


      </Portal>
    </ActionSheetContext.Provider>
  )
}

export default ActionSheetContext

export interface ActionSheetMethods {
  open(options?: ActionSheetOptions): () => void;
  close(): void;
} 

const ActionSheetComponent = React.forwardRef(({

}, ref) => {
  const [options, setOptions] = React.useState<ActionSheetOptions | undefined>({});
  const theme = useTheme();
  const bottomSheetRef = React.useRef<BottomSheet>(null);


  const methods = React.useMemo(() => ({
    open (options?: ActionSheetOptions) {
      bottomSheetRef.current?.expand();
      setOptions(options);
    },
    close () {
      setOptions({});
      bottomSheetRef.current?.forceClose();
    }
  }), [])


  React.useImperativeHandle(ref, () => methods, []);

  return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        // backdropComponent={BottomSheetBackdrop}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} 
            style={[props.style, { backgroundColor: 'rgba(0,0,0,.2)' }]}
            appearsOnIndex={0} 
            disappearsOnIndex={-1} 
          />
        )}
        backgroundStyle={[
          { backgroundColor: theme.colors.background },
          { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }
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
        // bottomInset={90}
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
          <View style={[styles.contentContainer, { gap: 20 }]}>

            <View style={{ flexDirection: 'row', position: 'relative' }}>

              <Text style={[
                { flex: 1, textAlign: 'center', fontWeight: '700', alignSelf: 'center' },
                { marginTop: 6, paddingHorizontal: 60 }
              ]}
                variant="titleMedium"
              >
                {options?.title}
              </Text>

              <IconButton style={{ position: 'absolute', top: 0, right: 0, margin: 0 }}
                icon="close"
                mode="contained"
                size={20}
                onPress={() => {
                  methods.close();
                }}
              />
            </View>

            {!!options?.description && (
              <View style={[
                { borderRadius: 10, overflow: 'hidden', backgroundColor: theme.colors.elevation.level1 },
                { padding: 16 }
              ]}>
                <Text style={{ color: theme.colors.outline }}>
                  {options.description}
                </Text>
              </View>
            )}

            <View style={[
              { borderRadius: 10, overflow: 'hidden', backgroundColor: theme.colors.elevation.level1 },
            ]}>
              {options?.options?.map((option, index) => (
                  <>
                    <Button style={{ borderRadius: 0 }}
                      contentStyle={{ justifyContent: 'flex-start', padding: 4 }} 
                      // icon="camera"
                      labelStyle={{ fontSize: 16 }} 
                      mode="text" 
                      onPress={() => {
                        option?.onPress?.();
                        options.onChangeOption?.(option?.value);
                        methods.close();
                      }}
                    >
                      {option.label}
                    </Button>
                    {(options?.options!.length - 1) === index && (
                      <Divider leftInset />
                    )}
                  </>
                )
              )}
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
  );
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sheetContainer: {
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});


export const ActionSheet = {
  open(options?: ActionSheetOptions) {
    event.emit('actionSheet', { type: 'open', options })
  },
  close() {
    event.emit('actionSheet', { type: 'close' })
  }
}