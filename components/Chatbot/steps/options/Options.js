import React from 'react';
import { View, Animated } from 'react-native';

const Options = (props) => {
  return (
    <View {...props} 
      style={[
        {
          // paddingRight: 4,
          // paddingLeft: 4,
          marginBottom: 12,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',

          padding: 16,
          backgroundColor: '#fafafa',
          borderRadius: 10,
          borderWidth: 1, borderColor: 'rgba(0,0,0,.1)',
        },
        props?.style,
      ]}
    />
  );
}

export default Options;


