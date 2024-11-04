import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from '../../lib/utilities/rootNavigationRef';
import Home from '../screens/Home';
import Others from '../screens/Others';

export const HOME_NAV = 'Home';

export type RootStackParamList = {
  Home: undefined;
  Others: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => (
  <NavigationContainer ref={navigationRef}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Others"
        component={Others}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
export default RootNavigator;
