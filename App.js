/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
// import { Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './components/Home';
import FridgeList from './components/FridgeList';
import AddItem from './components/AddItem';
import Item from './components/Item';
import TestComponent from './components/TestComponent';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="Item" component={Item} />
        <Stack.Screen
          name="FridgeList"
          component={FridgeList}
          options={{ title: 'Your fridge' }}
        />
        <Stack.Screen name="AddItem" component={AddItem} />
      </Stack.Navigator>
      <TestComponent />
    </NavigationContainer>
  );
}
