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
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ItemCard from './ItemCard';
import { db } from '../core/Config';

const FridgeList = () => {
  const [selectedValue, setSelectedValue] = useState('meat');
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
    <View style={styles.container}>
      <View style={styles.card}>
        <Picker
          style={{ height: 60, width: '100%' }}
          itemStyle={{
            backgroundColor: 'grey',
            fontSize: 17,
          }}
          onValueChange={(foodValue) => setSelectedValue(foodValue)}
        >
          <Picker.Item label="vegan" value="vegan" />
          <Picker.Item label="meat" value="meat" />
          <Picker.Item label="vegetarian" value="vegetarian" />
        </Picker>
      </View>
      <View style={styles.content}>
        <View style={styles.list}>
          {itemArray.map((item) => {
            return (
              <ItemCard
                key={item.id}
                item={item}
                setItemArray={setItemArray}
                itemArray={itemArray}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 20,
    borderWidth: 1,
    width: '100%',
    borderColor: 'rgba(155,155,155,1)',
    backgroundColor: 'rgba(214,210,210,1)',
  },
});

export default FridgeList;
