

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle, Text as NativeText } from 'react-native';
import { Text, TextProps } from "react-native-paper";

export interface AwesomeCardTitleProps extends TextProps<NativeText> {}

const AwesomeCardTitle = ({
  style,
  children,
  ...rest
}: AwesomeCardTitleProps, ref: React.ForwardedRef<View>) => {
  
  return (
    <Text style={[styles.title, style]}
      variant="titleMedium" 
      numberOfLines={2}
      {...rest}
    >
      {children}
    </Text>
  )
}


const styles = StyleSheet.create({
  title: {
    flexShrink: 1, 
  }
});

export default AwesomeCardTitle;