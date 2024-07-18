import React from 'react';
import { Pressable } from 'react-native';
import Svg, { Path } from "react-native-svg"

const OptionClose = (props) => {
  return (
    <Pressable {...props} 
      style={({ pressed }) => [
        {
            padding: 4
        },
        props?.style,
        pressed && { backgroundColor: 'rgba(0,0,0,.1)'}
      ]}
    >
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            height={48}
            width={48}
            viewBox="0 -960 960 960"
            {...props}
        >
            <Path d="M330-288l150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42zM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140zm0-340z" />
        </Svg>
    </Pressable>
  );
}

export default OptionClose;


