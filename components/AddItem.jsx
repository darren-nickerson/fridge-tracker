import React from 'react';
import { Text, View, Button } from 'react-native';

const AddItem = ({ navigation }) => {
  return (
    <View>
      <Text>AddItem</Text>
      <Button
        title="Your fridge"
        onPress={() => {
          navigation.navigate('Fridge List');
        }}
      />
    </View>
  );
};

export default AddItem;
