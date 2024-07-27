import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import { BottomTabNavigator } from './BottomTabNavigator';
import AuthContext from '../contexts/auth';
import SignInScreen from '../screens/SignInScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SplashScreen from '../screens/SplashScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BlogPostScreen from '../screens/BlogPostScreen';

import ChatbotScreen from '../screens/QueroContratarScreen'
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
    <Stack.Navigator initialRouteName={signed ? "Root" : "Welcome"} >

        {signed ? <>
            <Stack.Screen name="Root" component={BottomTabNavigator} 
              options={{ headerShown: false, animation: 'fade'  }} 
            />
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
            <Stack.Group screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Modal" component={ModalScreen} />
            </Stack.Group>
            <Stack.Screen name="Settings" component={SettingsScreen} />

            <Stack.Screen name="Chatbot" component={ChatbotScreen} />

            <Stack.Screen name="BlogPost" component={BlogPostScreen} 
              options={{ 
                headerShown: false,
                presentation: "transparentModal",
                animation: 'fade',
                gestureDirection: 'vertical',
                customAnimationOnGesture: true,
                fullScreenGestureEnabled: true,
                gestureEnabled: true,
                contentStyle: { backgroundColor: 'rgba(0,0,0,.5)' },
              }}
            />
        </> : <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{
             headerShown: false,  animation: 'fade'
          }} />

          <Stack.Screen name="SignIn" component={SignInScreen} options={{
          }} />
        </>
      }

    </Stack.Navigator>
  );
}
