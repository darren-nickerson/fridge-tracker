/* -------------------------------------------------------------------------- */
/*                                    Fridge List Branch                       */
/* -------------------------------------------------------------------------- */
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, SafeAreaView, TouchableOpacity, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const ItemCard = ({ item }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [expiryDate, setExpiryDate] = useState(item.expiry);
  const [quantity, setQuantity] = useState(item.quantity);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (newDate) => {
    setExpiryDate(newDate);
    hideDatePicker();
  };

  const handleQuantityPress = (num) => {
    setQuantity((curr) => (curr += num));
  };

  return (
    <SafeAreaView>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          alignSelf: 'center',
        }}
      >
        {item.name}
      </Text>
      <TouchableOpacity
        onPress={() => handleQuantityPress(1)}
        style={{ alignSelf: 'center' }}
      >
        <Text>Add</Text>
      </TouchableOpacity>
      <Text>{quantity}</Text>
      <TouchableOpacity
        onPress={() => handleQuantityPress(-1)}
        style={{ alignSelf: 'center' }}
      >
        <Text>Minus</Text>
      </TouchableOpacity>
      <Button
        title={moment(expiryDate).format('MMM Do YY')}
        onPress={showDatePicker}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <TouchableOpacity style={{ alignSelf: 'center' }}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ItemCard;
