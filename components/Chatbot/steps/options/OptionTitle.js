import React from 'react';
import { Text } from 'react-native';

const OptionTitle = (props) => {
  return (
    <Text {...props} 
      style={[
        {
            fontSize: 16, 
            fontWeight: '500'
        },
        props?.style,
      ]}
    />
  );
}

export default OptionTitle;


