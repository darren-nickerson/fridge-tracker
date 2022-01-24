/* eslint-disable jsx-quotes */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './components/Home';
import FridgeList from './components/FridgeList';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={Home}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen
          name='FridgeList'
          component={FridgeList}
          options={{ title: 'helloooooooo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
