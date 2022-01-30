/* -------------------------------------------------------------------------- */
/*                                    Fridge List Branch                       */
/* -------------------------------------------------------------------------- */
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../core/Config';

const ItemCard = ({ item, setItemArray }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [expiryDate, setExpiryDate] = useState(item.expiration_date);
  const [quantity, setQuantity] = useState(Number(item.quantity));

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (newDate) => {
    setExpiryDate(moment(newDate).format('MMM Do YY'));
    const docRef = doc(db, 'FoodItems', item.id);
    updateDoc(docRef, { expiration_date: moment(newDate).format('MMM Do YY') });
    hideDatePicker();
  };

  const handleDelete = () => {
    setItemArray((curr) => {
      return curr.filter((obj) => obj.id !== item.id);
    });
    const docRef = doc(db, 'FoodItems', item.id);

    deleteDoc(docRef);
  };
  const handleQuantityPress = (num) => {
    setQuantity((curr) => {
      return curr + num;
    });

    if (quantity < 1) {
      handleDelete();
    }

    const docRef = doc(db, 'FoodItems', item.id);
    updateDoc(docRef, { quantity: quantity + num });
  };

  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <TouchableOpacity onPress={() => handleQuantityPress(1)}>
          <Text style={styles.quantity}>
            <AntDesign name="caretup" size={24} color="grey" />
          </Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity onPress={() => handleQuantityPress(-1)}>
          <Text style={styles.quantity}>
            <AntDesign name="caretdown" size={24} color="grey" />
          </Text>
        </TouchableOpacity>
      </View>
      <Text>{item.food_item}</Text>
      <Text style={styles.date} onPress={showDatePicker}>
        {expiryDate}
      </Text>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <TouchableOpacity onPress={() => handleDelete()}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#D3D3D3',
    padding: 7,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  quantity: {
    textAlign: 'center',
  },
  counter: {
    width: 50,
  },
  date: {
    backgroundColor: 'green',
    padding: 6,
    borderWidth: 1,
    color: 'white',
    borderRadius: 5,
    borderColor: 'grey',
    fontSize: 12,
  },
});

export default ItemCard;
