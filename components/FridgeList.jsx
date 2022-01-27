/* -------------------------------------------------------------------------- */
/*                                    Fridge List Branch                       */
/* -------------------------------------------------------------------------- */
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const FridgeList = ({ navigation }) => {
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
  const [itemArray, setItemArray] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(null);
  console.log(date);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (newDate) => {
    console.log('newDate: ', newDate);
    // console.warn('Date: ', date);
    setDate(newDate);
    hideDatePicker();
  };

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
      <FlatList
        style={styles.list}
        data={itemArray}
        renderItem={({ item }) => {
          return (
            <View style={styles.itemCard}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Item', { foodItem: item.name })
                }
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
              <Text>Quantity: {item.quantity}</Text>
              <Button title={item.expiry} onPress={showDatePicker} />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <TouchableOpacity style={{ alignSelf: 'center' }}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flexWrap: 'wrap',
    backgroundColor: 'grey',
    color: 'white',
    height: 300,
    width: '100%',
  },
  itemCard: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 5,
  },
});

export default FridgeList;
