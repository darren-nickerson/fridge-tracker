import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FridgeList from '../components/FridgeList';
import Item from '../components/Item';

const Stack = createNativeStackNavigator();
const FridgeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Fridge List" component={FridgeList} />
      <Stack.Screen name="Item" component={Item} />
    </Stack.Navigator>
  );
};
export default FridgeNavigator;
