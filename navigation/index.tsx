/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import * as React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ColorSchemeName, StyleSheet, View } from 'react-native';

import LinkingConfiguration from './LinkingConfiguration';
import { RootNavigator } from './AppNavigator';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const [isReady, setIsReady] = React.useState(false);
  
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer 
        linking={LinkingConfiguration}
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        onReady={() => setIsReady(true)}
      >
        <RootNavigator />
      </NavigationContainer>

      {!isReady && <View style={[StyleSheet.absoluteFill, { backgroundColor: '#2f95dc' }]} />}
    </View>
  );
}
