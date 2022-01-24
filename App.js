/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './components/Home';
import FridgeList from './components/FridgeList';
import AddItem from './components/AddItem';
import Item from './components/Item';

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
        <Stack.Screen name='Item' component={Item} />
        <Stack.Screen
          name='FridgeList'
          component={FridgeList}
          options={{ title: 'Your fridge' }}
        />
        <Stack.Screen name='AddItem' component={AddItem} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
