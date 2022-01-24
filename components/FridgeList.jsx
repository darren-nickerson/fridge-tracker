/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import { StyleSheet, Text, Button, SafeAreaView, FlatList } from 'react-native';

import { Picker } from '@react-native-picker/picker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    backgroundColor: 'red',
    color: 'white',
    height: 300,
  },
});

const FridgeList = ({ navigation }) => {
  const [selectedValue, setSelectedValue] = React.useState('Non-Veg');

  const itemList = [
    { name: 'Tomato', type: 'Vegetarian', id: '134' },
    { name: 'Steak', type: 'Non-Veg', id: '130' },
    { name: 'Chocolate', type: 'Vegetarian', id: '154' },
    { name: 'Biscuits', type: 'Vegan', id: '133' },
  ];
  const [itemArray, setItemArray] = React.useState(itemList);

  useEffect(() => {
    setItemArray(
      itemList.filter((eachFood) => eachFood.type === selectedValue)
    );
  }, [selectedValue]);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Here is your fridge!</Text>
      <Picker
        style={{ height: 100, width: 300 }}
        selectedValue={selectedValue}
        onValueChange={(foodValue) => setSelectedValue(foodValue)}
      >
        <Picker.Item label='Non-Veg' value='Non-Veg' />
        <Picker.Item label='Vegetarian' value='Vegetarian' />
        <Picker.Item label='Vegan' value='Vegan' />
      </Picker>
      <FlatList
        style={styles.list}
        data={itemArray}
        renderItem={({ item }) => {
          return <Text>{item.name}</Text>;
        }}
        keyExtractor={(item) => item.id}
      />
      <Button
        title='Return home'
        onPress={() => {
          navigation.navigate('Home');
        }}
      />
    </SafeAreaView>
  );
};

export default FridgeList;
