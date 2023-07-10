import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import { BottomTabNavigator } from './BottomTabNavigator';
import AuthContext from '../contexts/auth';
import SignInScreen from '../screens/SignInScreen';
import SplashScreen from '../screens/SplashScreen';
import SettingsScreen from '../screens/SettingsScreen';

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {

  const { signed, initialLoading } = React.useContext(AuthContext);

  if (initialLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator>

        {signed ? <>
            <Stack.Screen name="Root" component={BottomTabNavigator} 
              options={{ headerShown: false, animation: 'fade'  }} 
            />
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
            <Stack.Screen name="Modal" component={ModalScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
        </> : <>
          <Stack.Screen name="SignIn" component={SignInScreen} options={{
             headerShown: false,  animation: 'fade'
          }} />
        </>
      }

    </Stack.Navigator>
  );
}
