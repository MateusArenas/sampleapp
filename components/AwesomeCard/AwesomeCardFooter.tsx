

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

export interface AwesomeCardFooterProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AwesomeCardFooter = ({
  style,
  children,
  ...rest
}: AwesomeCardFooterProps, ref: React.ForwardedRef<View>) => {
  
  return (
    <View 
      style={[
        styles.footer, 
        style
      ]}
      {...rest}
    >
      {children}
    </View>
  )
}


const styles = StyleSheet.create({
  footer: {
    flexDirection: "column",
    flexShrink: 1, 
  }
});

export default AwesomeCardFooter;