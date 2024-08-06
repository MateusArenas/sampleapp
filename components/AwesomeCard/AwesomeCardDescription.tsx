

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle, Text as NativeText } from 'react-native';
import { Text, TextProps, useTheme } from "react-native-paper";

export interface AwesomeCardDescriptionProps extends TextProps<NativeText> {}

const AwesomeCardDescription = ({
  style,
  children,
  ...rest
}: AwesomeCardDescriptionProps, ref: React.ForwardedRef<View>) => {
  const theme = useTheme();

  return (
    <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }, style]}
      variant="bodyMedium" 
      numberOfLines={2}
      {...rest}
    >
      {children}
    </Text>
  )
}


const styles = StyleSheet.create({
  description: {
    flexShrink: 1,
  }
});

export default AwesomeCardDescription;