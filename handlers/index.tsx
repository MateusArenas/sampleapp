import React from "react";
import { AlertProvider } from "./Alert";
import { BottomSheetInputProvider } from "./BoxInput";
import { ActionSheetHandler } from "./ActionSheet";
import { useTheme } from "react-native-paper";

export interface HandlersContextData {}

const HandlersContext = React.createContext<HandlersContextData>({} as HandlersContextData)

interface HandlersProviderProps { 
  children: React.ReactNode
}

export const HandlersProvider: React.FC<HandlersProviderProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <HandlersContext.Provider value={{ }} >
        <BottomSheetInputProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </BottomSheetInputProvider>

      <ActionSheetHandler theme={theme} />
    </HandlersContext.Provider>
  )
}

export default HandlersContext