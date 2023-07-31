import React from 'react';
import { LogBox, StyleSheet, View } from 'react-native';
import { ActionSheetCustom, ActionSheetCustomProps } from 'react-native-actionsheet';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

// import { Container } from './styles';

type ActionSheet = ActionSheetCustom;

LogBox.ignoreLogs(['Animated']);
LogBox.ignoreLogs(['componentWillReceiveProps']);

const ActionSheet = React.forwardRef<ActionSheetCustom, ActionSheetCustomProps>((props, ref) => {
  const colorScheme = useColorScheme();

  const styles: ActionSheetCustomProps['styles']  = React.useMemo(() => ({
    overlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0.4,
      backgroundColor: '#000'
    },
    wrapper: {
      flex: 1,
      flexDirection: 'row'
    },
    body: {
      flex: 1,
      alignSelf: 'flex-end',
      backgroundColor: Colors[colorScheme].borderColor
    },
    titleBox: {
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      color: Colors[colorScheme].text,
      backgroundColor: Colors[colorScheme].background,
    },
    titleText: {
      color: Colors[colorScheme].text,
      fontSize: 14
    },
    messageBox: {
      height: 30,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors[colorScheme].background
    },
    messageText: {
      color: Colors[colorScheme].text,
      opacity: .7,
      fontSize: 12
    },
    buttonBox: {
      height: 50,
      marginTop: StyleSheet.hairlineWidth,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors[colorScheme].background
    },
    buttonText: {
      fontSize: 18,
      color: Colors[colorScheme].text,
    },
    cancelButtonBox: {
      height: 50,
      marginTop: 6,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors[colorScheme].background
    }
  }), [colorScheme])

  return (
    <ActionSheetCustom 
      ref={ref}
      // destructiveButtonIndex={2}
      styles={styles}
      buttonUnderlayColor={Colors[colorScheme].borderColor}
      {...props}
    />
  )
})

export default ActionSheet;