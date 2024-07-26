import React from "react";
import { AlertProvider } from "./Alert";
import { BottomSheetInputProvider } from "./BoxInput";
import { ActionSheetHandler } from "./ActionSheet";

export interface HandlersContextData {}

const HandlersContext = React.createContext<HandlersContextData>({} as HandlersContextData)

interface HandlersProviderProps { 
  children: React.ReactNode
}

export const HandlersProvider: React.FC<HandlersProviderProps> = ({ children }) => {
  return (
    <HandlersContext.Provider value={{ }} >
        <BottomSheetInputProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </BottomSheetInputProvider>

      <ActionSheetHandler />
    </HandlersContext.Provider>
  )
}

export default HandlersContext