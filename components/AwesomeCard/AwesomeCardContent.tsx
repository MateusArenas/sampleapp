

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

export interface AwesomeCardContentProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AwesomeCardContent = ({
  style,
  children,
}: AwesomeCardContentProps, ref: React.ForwardedRef<View>) => {
  
  return (
    <View
      style={[
        styles.content, 
        style
      ]}
    >
      {children}
    </View>
  )
}


const styles = StyleSheet.create({
  content: {
    flexDirection: "column", 
    flexShrink: 1, 
    // gap: 8,
  }
});

export default AwesomeCardContent;