import React from 'react';
import { Text, View, Button } from 'react-native';

const AddItem = ({ navigation }) => {
  return (
    <View>
      <Text>AddItem</Text>
      <Button
        title='Return home'
        onPress={() => {
          navigation.navigate('Home');
        }}
      />
      <Button
        title='Your fridge'
        onPress={() => {
          navigation.navigate('FridgeList');
        }}
      />
    </View>
  );
};

export default AddItem;
