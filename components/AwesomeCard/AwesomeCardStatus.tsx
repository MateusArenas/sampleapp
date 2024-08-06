

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle, Text as NativeText } from 'react-native';
import { Text, TextProps, useTheme } from "react-native-paper";

export interface AwesomeCardStatusProps extends TextProps<NativeText> {}

const AwesomeCardStatus = ({
  style,
  children,
  ...rest
}: AwesomeCardStatusProps, ref: React.ForwardedRef<View>) => {
  const theme = useTheme();

  return (
    <Text style={[
        styles.status, 
        { color: theme.colors.onSurfaceDisabled }, 
        style
      ]}
      variant="labelSmall" 
      numberOfLines={1}
      {...rest}
    >
      {children}
    </Text>
  )
}


const styles = StyleSheet.create({
  status: {
  }
});

export default AwesomeCardStatus;