

import React from 'react';
import { View, StyleSheet, ImageSourcePropType } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';

export interface AwesomeCardCheckboxIconProps {
  size?: number;
  source?: ImageSourcePropType;
  checked?: boolean;
  checkIcon?: any;
  uncheckIcon?: any;
}

const AwesomeCardCheckboxIcon = ({
  size = 32,
  checked = false,
  checkIcon = "check-circle",
  uncheckIcon = "checkbox-blank-circle-outline",
}: AwesomeCardCheckboxIconProps, ref: React.ForwardedRef<View>) => {
  const theme = useTheme();
  
  return (
    <Icon 
      color={theme.colors.primary}
      source={checked ? checkIcon : uncheckIcon} 
      size={size} 
    />
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 100, 
    overflow: "hidden",
  },
  image: {
    borderRadius: 0,
  }
});

export default AwesomeCardCheckboxIcon;