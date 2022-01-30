import React, { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { collection, addDoc } from 'firebase/firestore';
import {
  Button,
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  SafeAreaView,
  Text,
} from 'react-native';
import { Formik } from 'formik';

import { db } from '../core/Config';

const AddItem = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [expiryDate, setExpiryDate] = useState(new Date());

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

  return (
    <ScrollView>
      <SafeAreaView>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.container}>
            <Formik
              initialValues={{
                category: 'dairy',
                expiration_date: 'this has not worked',
                food_item: 'chicken',
                quantity: '10',
                user_id: '1',
              }}
              onSubmit={(values) => {
                const colRef = collection(db, 'FoodItems');

                addDoc(colRef, values);
              }}
            >
              {(props) => (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Add Food Item"
                    onChangeText={props.handleChange('food_item')}
                    value={props.values.food_item}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Add Category"
                    onChangeText={props.handleChange('category')}
                    value={props.values.category}
                  />

                  {/* <TextInput
                    style={styles.input}
                    placeholder="Add expiration date"
                    onChangeText={props.handleChange('expiration_date')}
                    value={props.values.expiration_date}
                  /> */}

                  <Text style={styles.input} onPress={showDatePicker}>
                    {moment(expiryDate).format('MMM Do YY')}
                  </Text>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onChangeText={props.handleChange('expiration_date')}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Add quantity"
                    onChangeText={props.handleChange('quantity')}
                    value={props.values.quantity}
                  />
                  <Button
                    title="Add Item"
                    color="maroon"
                    onPress={props.handleSubmit}
                  />
                </>
              )}
            </Formik>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default AddItem;
