/* -------------------------------------------------------------------------- */
/*                                    Fridge List Branch                       */
/* -------------------------------------------------------------------------- */
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../core/Config';

const ItemCard = ({ item, setItemArray }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [expiryDate, setExpiryDate] = useState(item.expiration_date);
  const [quantity, setQuantity] = useState(Number(item.quantity));
  const [modalOpen, setModalOpen] = useState(false);

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
            <AntDesign name="caretup" size={16} color="#85b4e0" />
          </Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity onPress={() => handleQuantityPress(-1)}>
          <Text style={styles.quantity}>
            <AntDesign name="caretdown" size={16} color="#85b4e0" />
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
      <Text onPress={() => setModalOpen(true)}>
        <MaterialIcons name="delete" size={22} color="#d92626" />
      </Text>

      <Modal
        visible={modalOpen}
        animationType="slide"
        style={styles.modalContent}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalInnerContainer}>
            <Text style={styles.modalDelete} onPress={() => handleDelete()}>
              Delete
            </Text>

            <Text
              style={styles.modalCancel}
              onPress={() => setModalOpen(false)}
            >
              Cancel
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 1,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  quantity: {
    textAlign: 'center',
    fontSize: 14,
  },
  counter: {
    padding: 3,
    width: 30,
  },
  date: {
    padding: 3,
    paddingHorizontal: 10,
    color: 'white',
    borderRadius: 5,
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#009900',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInnerContainer: {
    width: 200,
    height: 200,
  },
  modalDelete: {
    backgroundColor: '#d92626',
    padding: 10,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
    borderRadius: 5,
  },
  modalCancel: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#aecdea',
    padding: 10,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
});

export default ItemCard;
