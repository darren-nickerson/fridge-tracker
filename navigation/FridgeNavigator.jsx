import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FridgeList from '../components/FridgeList';
import AddItemFormik from '../components/AddItemFormik';

const Stack = createNativeStackNavigator();
const FridgeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Fridge List" component={FridgeList} />
      <Stack.Screen name="AddItemFormik" component={AddItemFormik} />
    </Stack.Navigator>
  );
};
export default FridgeNavigator;
