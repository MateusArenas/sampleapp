import React from "react";
import { AlertProvider } from "./Alert";

import { InputSheetHandler  } from "./InputSheet";
import { ActionSheetHandler } from "./ActionSheet";
import { BottomActionBarHandler } from "./BottomActionBar";

import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RichTextEditorSheetHandler } from "./RichTextEditorSheet";
import { SpinnerOverlay, SpinnerOverlayHandler } from "./SpinnerOverlay";
import { ToastFeedbackHandler } from "./ToastFeedback";
import { SnackbarHandler } from "./Snackbar";
import { ToastNotification, ToastNotificationHandler } from "./ToastNotification";

export interface HandlersContextData {}

const HandlersContext = React.createContext<HandlersContextData>({} as HandlersContextData)

interface HandlersProviderProps { 
  children: React.ReactNode
}

const BOTTOM_ACTION_BAR_STATIC_HEIGHT = 56;

export const HandlersProvider: React.FC<HandlersProviderProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [isBottomInsetVisible, setIsBottomInsetVisible] = React.useState(false);

  return (
    <HandlersContext.Provider value={{ }} >
      <AlertProvider>
        {children}
      </AlertProvider>

      <BottomActionBarHandler theme={theme} 
        bottomInset={insets.bottom} 
        staticHeight={BOTTOM_ACTION_BAR_STATIC_HEIGHT}
        onOpen={() => setIsBottomInsetVisible(true)}
        onClose={() => setIsBottomInsetVisible(false)}
      />

      <RichTextEditorSheetHandler theme={theme} 
        bottomInset={insets.bottom + (isBottomInsetVisible ? BOTTOM_ACTION_BAR_STATIC_HEIGHT : 0)} 
      />
      <InputSheetHandler theme={theme} 
        bottomInset={insets.bottom + (isBottomInsetVisible ? BOTTOM_ACTION_BAR_STATIC_HEIGHT : 0)} 
      />

      <ActionSheetHandler theme={theme} bottomInset={insets.bottom} />
      <SpinnerOverlayHandler theme={theme} bottomInset={insets.bottom} />

      <ToastFeedbackHandler  />

      <SnackbarHandler theme={theme} 
        bottomInset={insets.bottom + (isBottomInsetVisible ? BOTTOM_ACTION_BAR_STATIC_HEIGHT : 0)} 
      />

      <ToastNotificationHandler />
    </HandlersContext.Provider>
  )
}

export default HandlersContext