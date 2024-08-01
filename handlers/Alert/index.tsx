import React from "react";
import AlertModal, { AlertModalConfig, AlertModalMethods } from "./components/AlertModal";

import * as Haptics from 'expo-haptics'
import { ColorSchemeName, Keyboard, View } from "react-native";
import { Portal } from "react-native-paper";
import sleep from "../utils/sleep";

export interface AlertContextData {
  confirm: (config: AlertConfirmConfig) => Promise<boolean>;
  simple: (config: AlertConfirmConfig) => Promise<boolean>;
  custom: (config: AlertConfirmConfig) => Promise<boolean>;
  loading: (config?: Partial<AlertLoadingConfig>) => AlertLoadingConfig;
}

const AlertContext = React.createContext<AlertContextData>({} as AlertContextData)

interface AlertProviderProps { 
  children: React.ReactNode
  colorScheme?: ColorSchemeName
}

interface AlertLoadingConfig {
  type?: "info" | "question" | "success" | "warning" | "danger";
  title: string
  subtitle: string
  cancelable: boolean;
  cancelMessage: string
  cancel: () => void | Promise<void>;
  accept: () => void | Promise<void>;
  hide: () => void | Promise<void>;
  progress?: number | null;
  setProgress: (progress: number | null) => void;
}

interface AlertConfirmConfig {
  type?: "info" | "question" | "success" | "warning" | "danger";
  title?: string
  subtitle?: string
  cancelMessage?: string
  cancel?: () => any
  text?: string
  accept?: () => any
  confirmMessage?: string
}

interface AlertSimpleConfig {
  type?: "info" | "question" | "success" | "warning" | "danger";
  title?: string
  subtitle?: string
  text?: string
  accept?: () => any
}

interface AlertCustomConfig {
  type?: "info" | "question" | "success" | "warning" | "danger";
  title?: string
  subtitle?: string
  text1?: string
  text2?: string
  callback1?: () => any
  callback2?: () => any
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ colorScheme, children }) => {
  const AlertModalRef = React.useRef<AlertModalMethods>(null);

  const handleAction = async (callback?: () => any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    AlertModalRef.current?.hidden();
    await sleep(250);
    callback?.();
  }

  const showModal = (config: AlertModalConfig) => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    AlertModalRef.current?.show(config);
  }

  const setProgress = (progress: number | null) => {
    AlertModalRef.current?.setProgress(progress);
  }

  const loading = (config?: Partial<AlertLoadingConfig>): AlertLoadingConfig => {
    const cancel = () => handleAction(config?.cancel);
    const accept = () => handleAction(config?.accept);
    const hide = () => handleAction(config?.hide);

    showModal({
      title: config?.title || '',
      subtitle: config?.subtitle || '',
      loading: true,
      progress: config?.progress,
      buttons: !(config?.cancelable) ? [] : [
        {
          text: config.cancelMessage || "Cancelar",
          onPress: cancel,
          style: "cancel",
        },
      ]
    });

    return { ...config, cancel, accept, hide, setProgress } as AlertLoadingConfig;
  };

  const confirm = async (config: AlertConfirmConfig): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      showModal({
        type: config.type || "question",
        title: config.title || 'Atenção',
        subtitle: config.subtitle || '',
        buttons: [
          {
            text: config.cancelMessage || "Não",
            onPress: async () => {
              await handleAction(config.cancel);
              resolve(false);
            },
            style: "cancel"
          },
          {
            text: config.confirmMessage || "Sim",
            onPress: async () => {
              await handleAction(config.accept);
              resolve(true);
            }
          }
        ]
      });
    });
  };

  const simple = async (config: AlertSimpleConfig): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      showModal({
        type: config.type || "info",
        title: config.title || 'Atenção',
        subtitle: config.subtitle || '',
        buttons: [
          {
            text: config.text || "OK",
            onPress: async () => {
              await handleAction(config.accept);
              resolve(true);
            }
          }
        ]
      });
    });
  };

  const custom = async (config: AlertCustomConfig): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      showModal({
        type: config.type,
        title: config.title || 'Atenção',
        subtitle: config.subtitle || '',
        buttons: [
          {
            text: config.text1 || '',
            onPress: async () => {
              await handleAction(config.callback1);
              resolve(true);
            }
          },
          {
            text: config.text2 || '',
            onPress: async () => {
              await handleAction(config.callback2);
              resolve(true);
            }
          }
        ]
      });
    });
  };



  return (
    <AlertContext.Provider value={{ confirm, custom, simple, loading }} >
      {children}
        
      <Portal>
        <AlertModal ref={AlertModalRef} 
          style={{ minWidth: 260, maxWidth: 280, alignSelf: 'center' }}
          // onDismiss={handleAction}
          colorScheme={colorScheme}
          onDismiss={() => console.log('onDismiss')}
          dismissable={false}
        />
      </Portal>
    </AlertContext.Provider>
  )
}

export default AlertContext