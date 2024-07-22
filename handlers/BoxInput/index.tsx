import React from "react";

import * as Haptics from 'expo-haptics'
import { ColorSchemeName, Keyboard, View } from "react-native";
import { Portal } from "react-native-paper";
import sleep from "../utils/sleep";
import { BottomSheetInput } from "./components/BottomSheetInput";

export interface BottomSheetInputContextData {

}

const BottomSheetInputContext = React.createContext<BottomSheetInputContextData>({} as BottomSheetInputContextData)

interface BottomSheetInputProviderProps { 
  children: React.ReactNode
  colorScheme?: ColorSchemeName
}


export const BottomSheetInputProvider: React.FC<BottomSheetInputProviderProps> = ({ colorScheme, children }) => {
  const BottomSheetInputModalRef = React.useRef<string>(null);

  return (
    <BottomSheetInputContext.Provider value={{  }} >
      {children}
        
      <Portal>
        {/* <BottomSheetInputModal ref={BottomSheetInputModalRef} 
          style={{ minWidth: 260, maxWidth: 280, alignSelf: 'center' }}
          // onDismiss={handleAction}
          colorScheme={colorScheme}
          onDismiss={() => console.log('onDismiss')}
          dismissable={false}
        /> */}

        <BottomSheetInput 
        />


      </Portal>
    </BottomSheetInputContext.Provider>
  )
}

export default BottomSheetInputContext