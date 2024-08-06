

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

export interface AwesomeCardHeaderProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AwesomeCardHeader = ({
  style,
  children,
}: AwesomeCardHeaderProps, ref: React.ForwardedRef<View>) => {
  
  return (
    <View
      style={[
        styles.header, 
        style
      ]}
    >
      {children}
    </View>
  )
}


const styles = StyleSheet.create({
  header: {
   flexShrink: 1, 
   flexDirection: "row", 
   gap: 12, 
   alignItems: "center", 
   justifyContent: "space-between",
   marginBottom: 4,
  }
});

export default AwesomeCardHeader;