/* -------------------------------------------------------------------------- */
/*                                    Fridge List Branch                       */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ItemCard from './ItemCard';

const FridgeList = () => {
  const fridgeItems = [
    {
      id: '134',
      category: 'Vegetable',
      name: 'Tomato',
      diet: 'Vegetarian',
      quantity: 4,
      expiry: '01/01/2022',
    },
    {
      id: '130',
      category: 'Meat',
      name: 'Steak',
      diet: 'Non-Veg',
      quantity: 1,
      expiry: '02/01/2022',
    },
    {
      id: '154',
      category: 'Dairy',
      name: 'Chocolate',
      diet: 'Vegetarian',
      quantity: 2,
      expiry: '03/01/2022',
    },
    {
      id: '133',
      category: 'Dairy',
      name: 'something',
      diet: 'Vegan',
      quantity: 10,
      expiry: '04/01/2022',
    },
  ];
  const [selectedValue, setSelectedValue] = useState('Non-Veg');
  const [itemArray, setItemArray] = useState(fridgeItems);
  useEffect(() => {
    setItemArray(
      fridgeItems.filter((eachFood) => eachFood.diet === selectedValue),
    );
  }, [selectedValue]);
  return (
    <SafeAreaView style={styles.container}>
      <Text>Here is your fridge!</Text>
      <Picker
        style={{ height: 200, width: 300 }}
        selectedValue={selectedValue}
        onValueChange={(foodValue) => setSelectedValue(foodValue)}
      >
        <Picker.Item label="Non-Veg" value="Non-Veg" />
        <Picker.Item label="Vegetarian" value="Vegetarian" />
        <Picker.Item label="Vegan" value="Vegan" />
      </Picker>
      {itemArray.map((item) => {
        return <ItemCard key={item.id} item={item} />;
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FridgeList;
