import React from 'react';
import { Text, View } from 'react-native';

const Item = ({ route }) => {
  return (
    <View>
      <Text>Item Page for {route.params.foodItem}</Text>
    </View>
  );
};

export default Item;
