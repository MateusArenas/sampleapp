

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle, Text as NativeText } from 'react-native';
import { Text, TextProps, useTheme } from "react-native-paper";

export interface AwesomeCardLinkProps extends TextProps<NativeText> {}

const AwesomeCardLink = ({
  style,
  children,
  ...rest
}: AwesomeCardLinkProps, ref: React.ForwardedRef<View>) => {
  const theme = useTheme();

  return (
    <Text style={[styles.link, { color: theme.colors.primary }, style]}
      variant="labelLarge" 
      numberOfLines={2}
      {...rest}
    >
      {children}
    </Text>
  )
}


const styles = StyleSheet.create({
  link: {
  }
});

export default AwesomeCardLink;