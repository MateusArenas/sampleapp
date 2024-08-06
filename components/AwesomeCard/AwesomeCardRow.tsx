

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

export interface AwesomeCardRowProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AwesomeCardRow = ({
  style,
  children,
}: AwesomeCardRowProps, ref: React.ForwardedRef<View>) => {
  
  return (
    <View
      style={[
        styles.row, 
        style
      ]}
    >
      {children}
    </View>
  )
}


const styles = StyleSheet.create({
  row: {
    flexDirection: "row", 
    flexShrink: 1, 
    gap: 16,
  }
});

export default AwesomeCardRow;