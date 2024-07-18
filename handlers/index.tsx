import React from "react";
import { AlertProvider } from "./Alert";

export interface HandlersContextData {}

const HandlersContext = React.createContext<HandlersContextData>({} as HandlersContextData)

interface HandlersProviderProps { 
  children: React.ReactNode
}

export const HandlersProvider: React.FC<HandlersProviderProps> = ({ children }) => {
  return (
    <HandlersContext.Provider value={{ }} >
      <AlertProvider>
        {children}
      </AlertProvider>
    </HandlersContext.Provider>
  )
}

export default HandlersContext