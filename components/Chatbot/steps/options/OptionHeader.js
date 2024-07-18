import React from 'react';
import { View } from 'react-native';

const OptionHeader = (props) => {
  return (
    <View {...props} 
      style={[
        {
            width: '100%', 
            marginBottom: 12
        },
        props?.style,
      ]}
    />
  );
}

export default OptionHeader;


