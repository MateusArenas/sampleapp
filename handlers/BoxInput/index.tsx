import React from "react";

import * as Haptics from 'expo-haptics'
import { ColorSchemeName, Keyboard, View } from "react-native";
import { Portal } from "react-native-paper";
import sleep from "../utils/sleep";
import { BottomSheetInput, BottomSheetInputMethods, BottomSheetInputOptions } from "./components/BottomSheetInput";

export interface BottomSheetInputContextData {
  close(): void;
  open(options: BottomSheetInputOptions): (() => void);
}

const BottomSheetInputContext = React.createContext<BottomSheetInputContextData>({} as BottomSheetInputContextData)

interface BottomSheetInputProviderProps { 
  children: React.ReactNode;
  colorScheme?: ColorSchemeName;
}

export const BottomSheetInputProvider: React.FC<BottomSheetInputProviderProps> = ({ colorScheme, children }) => {
  const BottomSheetInputRef = React.useRef<BottomSheetInputMethods>(null);

  function open (options: BottomSheetInputOptions) {
    const sub = BottomSheetInputRef.current?.open(options);
    return typeof sub === "function" ? sub : close;
  }

  function close () {
    BottomSheetInputRef.current?.close();
  }

  return (
    <BottomSheetInputContext.Provider value={{ open, close }} >
      {children}
        
      <Portal>

        <BottomSheetInput ref={BottomSheetInputRef}

        />


      </Portal>
    </BottomSheetInputContext.Provider>
  )
}

export default BottomSheetInputContext