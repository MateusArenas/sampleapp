

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle, Text as NativeText } from 'react-native';
import { Icon, IconButton, IconButtonProps, Text, TextProps, useTheme } from "react-native-paper";

export interface AwesomeCardActionIconButtonProps extends IconButtonProps {
  iconSize?: number;
  label?: string;
}

const AwesomeCardActionIconButton = ({
  size=32,
  iconSize=24,
  label,
  icon,
  disabled,
  style,
  ...rest
}: AwesomeCardActionIconButtonProps, ref: React.ForwardedRef<View>) => {
  const theme = useTheme();

  return (
    <IconButton style={[styles.iconButton, style]}
      size={size}
      {...rest}
      disabled={disabled}
      icon={props => (
        <View style={[styles.buttonContent]}>
          <Icon {...props}
            size={iconSize}
            source={icon}
          />
          <Text style={[
            { color: theme.colors.onSurface },
            disabled && { color: theme.colors.onSurfaceDisabled }
          ]}
            variant="labelMedium"
          >
            {label}
          </Text>
        </View>
      )}
    />
  )
}


const styles = StyleSheet.create({
  iconButton: {
    margin: 0,
  },
  buttonContent: {
    flex: 1,
    padding: 8, 
  },
});

export default AwesomeCardActionIconButton;