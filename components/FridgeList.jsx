/* -------------------------------------------------------------------------- */
/*                                    Fridge List Branch                       */
/* -------------------------------------------------------------------------- */
import { getDocs, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ItemCard from './ItemCard';
import { db } from '../core/Config';

const FridgeList = () => {
  const [selectedValue, setSelectedValue] = useState('all');
  const [itemArray, setItemArray] = useState([]);
  const foodGroups = [
    '🍎 fruit',
    '🥦 vegetables',
    '🥩 meat',
    '🧀 dairy',
    '🍞 grains',
    '🐟 fish',
  ];
  const [modalOpen, setModalOpen] = useState(true);

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
    getFoodItems().then((result) => {
      if (selectedValue === 'all') {
        setItemArray(result);
      } else {
        setItemArray(result.filter((obj) => obj.category === selectedValue));
      }
    });
  }, [selectedValue]);

  return (
    <ScrollView>
      <SafeAreaView>
        <Picker
          style={{ height: 50, width: 180, paddinghorizontal: 20 }}
          selectedValue={selectedValue}
          onValueChange={(foodValue) => setSelectedValue(foodValue)}
        >
          <Picker.Item label="All..." value="all" />
          {foodGroups.map((item) => {
            return <Picker.Item label={item} value={item} key={item} />;
          })}
        </Picker>

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
      </SafeAreaView>
    </ScrollView>
  );
};

export default FridgeList;
