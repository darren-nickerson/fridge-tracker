/* -------------------------------------------------------------------------- */
/*                                    Fridge List Branch                       */
/* -------------------------------------------------------------------------- */
import {
  getDocs,
  collection,
  // addDoc,
  // deleteDoc,
  // doc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ItemCard from './ItemCard';
import { db } from '../core/Config';

const FridgeList = () => {
  const [selectedValue, setSelectedValue] = useState('Any');
  const [itemArray, setItemArray] = useState([]);

  const getFoodItems = () => {
    const colRef = collection(db, 'FoodItems');
    return getDocs(colRef)
      .then((snapshot) => {
        const foodItems = [];
        snapshot.docs.forEach((doc) => {
          foodItems.push({ ...doc.data(), id: doc.id });
        });
        return foodItems;
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getFoodItems().then((result) =>
      setItemArray(result.filter((obj) => obj.diet === selectedValue)),
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
        <Picker.Item label="veg" value="veg" />
        <Picker.Item label="Veg" value="Veg" />
        <Picker.Item label="Any" value="Any" />
      </Picker>
      <ScrollView>
        {itemArray.map((item) => {
          return <ItemCard key={item.id} item={item} />;
        })}
      </ScrollView>
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
