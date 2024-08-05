import React from "react";
import { AlertProvider } from "./Alert";

import { InputSheetHandler  } from "./InputSheet";
import { ActionSheetHandler } from "./ActionSheet";
import { BottomActionBarHandler } from "./BottomActionBar";

import { MD3Theme, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RichTextEditorSheetHandler } from "./RichTextEditorSheet";
import { SpinnerOverlay, SpinnerOverlayHandler } from "./SpinnerOverlay";
import { ToastFeedbackHandler } from "./ToastFeedback";
import { SnackbarHandler } from "./Snackbar";
import { ToastNotification, ToastNotificationHandler } from "./ToastNotification";
import { isSharedValue, useAnimatedStyle, useDerivedValue, useSharedValue } from "react-native-reanimated";

export interface HandlersContextData {}

const HandlersContext = React.createContext<HandlersContextData>({} as HandlersContextData)

interface HandlersProviderProps { 
  children: React.ReactNode
}

const BOTTOM_ACTION_BAR_STATIC_HEIGHT = 56;

export const HandlersProvider: React.FC<HandlersProviderProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <HandlersContext.Provider value={{ }} >
      <AlertProvider>
        {children}
      </AlertProvider>

      <HandlersManager theme={theme} bottomInset={insets.bottom} />
    </HandlersContext.Provider>
  )
}

export default HandlersContext

interface HandlersManagerProps {
  bottomInset: number;
  theme: MD3Theme;
}

const HandlersManager = React.memo(({ bottomInset, theme }: HandlersManagerProps) => {

  // const [isBottomInsetVisible, setIsBottomInsetVisible] = React.useState(false);
  // const [isBottomInsetVisible2, setIsBottomInsetVisible2] = React.useState(false);
  // const [isBottomInsetVisible3, setIsBottomInsetVisible3] = React.useState(false);

  // Os handlers tem que ser tudo memo (os metódos terão que estar no component base).
  
  const BottomActionBarPosition = useSharedValue(0);
  const InputSheetPosition = useSharedValue(0);

  const snackBottomInset = useDerivedValue(() => {
    return BottomActionBarPosition.value + InputSheetPosition.value;
  });

  console.log("Render HandlersManager");
  

  return (
    <>

      <RichTextEditorSheetHandler theme={theme} 
        bottomInset={bottomInset + BottomActionBarPosition.value} 
        // onChange={(visible) => setIsBottomInsetVisible3(visible)}
      />
      
      <InputSheetHandler theme={theme} 
        bottomInset={bottomInset}
        bottomOffset={BottomActionBarPosition}
        // onChange={(visible) => setIsBottomInsetVisible2(visible)}
        onAimatedPosition={(animatedPositionValue) => {
          InputSheetPosition.value = animatedPositionValue;
        }}
      />

      <BottomActionBarHandler theme={theme} 
        bottomInset={bottomInset} 
        staticHeight={BOTTOM_ACTION_BAR_STATIC_HEIGHT}
        onAimatedPosition={(animatedPositionValue) => {
          BottomActionBarPosition.value = animatedPositionValue;
        }}
      />

      <ActionSheetHandler theme={theme} bottomInset={bottomInset} />
      <SpinnerOverlayHandler theme={theme} bottomInset={bottomInset} />

      <ToastFeedbackHandler  />

      <SnackbarHandler theme={theme} 
        bottomInset={bottomInset} 
        bottomOffset={snackBottomInset}
      />

      <ToastNotificationHandler />
    </>
  )
})