/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';
import Camera from './components/Camera';
import AddItem from './components/AddItem';
import Home from './components/Home';
import FridgeNavigator from './navigation/FridgeNavigator';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Fridge List"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="Fridge"
        component={FridgeNavigator}
        options={{
          tabBarLabel: 'Your fridge',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="fridge" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Add Item"
        component={AddItem}
        options={{
          tabBarLabel: 'Add Item',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={Camera}
        options={{
          tabBarLabel: 'Camera',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Recipes"
        component={Home}
        options={{
          tabBarLabel: 'Recipes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="reader" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
