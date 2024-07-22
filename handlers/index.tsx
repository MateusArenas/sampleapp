import React from "react";
import { AlertProvider } from "./Alert";
import { BottomSheetInputProvider } from "./BoxInput";

export interface HandlersContextData {}

const HandlersContext = React.createContext<HandlersContextData>({} as HandlersContextData)

interface HandlersProviderProps { 
  children: React.ReactNode
}

export const HandlersProvider: React.FC<HandlersProviderProps> = ({ children }) => {
  return (
    <HandlersContext.Provider value={{ }} >
      <AlertProvider>
        <BottomSheetInputProvider>
          {children}
        </BottomSheetInputProvider>
      </AlertProvider>
    </HandlersContext.Provider>
  )
}

export default HandlersContext