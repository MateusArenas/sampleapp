import React from "react";
import { AlertProvider } from "./Alert";

import { InputSheetHandler  } from "./InputSheet";
import { ActionSheetHandler } from "./ActionSheet";
import { BottomActionBarHandler } from "./BottomActionBar";

import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface HandlersContextData {}

const HandlersContext = React.createContext<HandlersContextData>({} as HandlersContextData)

interface HandlersProviderProps { 
  children: React.ReactNode
}

export const HandlersProvider: React.FC<HandlersProviderProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <HandlersContext.Provider value={{ }} >
        <AlertProvider>
          {children}
        </AlertProvider>

      <BottomActionBarHandler theme={theme} bottomInset={insets.bottom} />
      <InputSheetHandler theme={theme} bottomInset={insets.bottom} />
      <ActionSheetHandler theme={theme} bottomInset={insets.bottom} />
    </HandlersContext.Provider>
  )
}

export default HandlersContext