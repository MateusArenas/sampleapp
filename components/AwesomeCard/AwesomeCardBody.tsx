

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

export interface AwesomeCardBodyProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AwesomeCardBody = ({
  style,
  children,
}: AwesomeCardBodyProps, ref: React.ForwardedRef<View>) => {
  
  return (
    <View
      style={[
        styles.body, 
        style
      ]}
    >
      {children}
    </View>
  )
}


const styles = StyleSheet.create({
  body: {
    flexDirection: "column",
    flexShrink: 1, 
    gap: 4,
    marginBottom: 8,
  }
});

export default AwesomeCardBody;