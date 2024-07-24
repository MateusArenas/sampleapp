import React from "react";
import { AlertProvider } from "./Alert";
import { BottomSheetInputProvider } from "./BoxInput";
import { ActionSheetProvider } from "./ActionSheet";

export interface HandlersContextData {}

const HandlersContext = React.createContext<HandlersContextData>({} as HandlersContextData)

interface HandlersProviderProps { 
  children: React.ReactNode
}

export const HandlersProvider: React.FC<HandlersProviderProps> = ({ children }) => {
  return (
    <HandlersContext.Provider value={{ }} >
      <ActionSheetProvider>
        <BottomSheetInputProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </BottomSheetInputProvider>
      </ActionSheetProvider>
    </HandlersContext.Provider>
  )
}

export default HandlersContext