

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Image, ImageSourcePropType } from 'react-native';
import { Avatar } from 'react-native-paper';

export interface AwesomeCardAvatarProps {
  style?: StyleProp<ViewStyle>;
  size?: number;
  source?: ImageSourcePropType;
}

const AwesomeCardAvatar = ({
  size = 40,
  source,
  style,
}: AwesomeCardAvatarProps, ref: React.ForwardedRef<View>) => {
  
  return (
    <Avatar.Image style={[styles.avatar, style]}
      size={size}
      source={({ size }) => (
        <Image style={[styles.image]}
          width={size} 
          height={size}
          source={source}
        />
      )}
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

export default AwesomeCardAvatar;