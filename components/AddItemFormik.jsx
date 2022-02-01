import React, { useContext, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { collection, addDoc } from 'firebase/firestore';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';

import { db } from '../core/Config';
import { barcodeContext, cameraContext, itemContext } from '../context';

export default function AddItemFormik() {
  const { barcodeData } = useContext(barcodeContext);
  const { setItemAdded } = useContext(itemContext);
  setItemAdded(false);
  return (
    <Formik
      initialValues={{
        category: '',
        expiration_date: moment().format('MMM Do YY'),
        food_item: barcodeData,
        quantity: '1',
        user_id: '1',
      }}
      onSubmit={(values, { resetForm }) => {
        const colRef = collection(db, 'FoodItems');
        setItemAdded(true);
        addDoc(colRef, values);
        resetForm({ values: '' });
      }}
    >
      {({ handleSubmit, setFieldValue, handleChange, values }) => (
        <AddItem
          setFieldValue={setFieldValue}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          values={values}
        />
      )}
    </Formik>
  );
}

const AddItem = (props) => {
  const { cameraData } = useContext(cameraContext);
  const { setFieldValue, handleSubmit, handleChange, values } = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [selectedValue, setSelectedValue] = useState('all');
  const foodGroups = [
    '🍎 fruit',
    '🥦 vegetables',
    '🥩 meat',
    '🧀 dairy',
    '🍞 grains',
    '🐟 fish',
  ];

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleFoodGroupPress = (foodGroupsName) => {
    setFieldValue('category', foodGroupsName);
    setSelectedValue(foodGroupsName);
  };

  const handleConfirm = (newDate) => {
    setFieldValue('expiration_date', moment(newDate).format('MMM Do YY'));
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
            <>
              <Picker
                selectedValue={selectedValue}
                onValueChange={handleFoodGroupPress}
              >
                {foodGroups.map((item) => {
                  return <Picker.Item key={item} label={item} value={item} />;
                })}
              </Picker>

              <TextInput
                style={styles.input}
                placeholder="Add Food Item"
                onChangeText={handleChange('food_item')}
                value={values.food_item}
              />

              <Text style={styles.input} onPress={showDatePicker}>
                {moment(expiryDate).format('MMM Do YY')}
              </Text>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />

              <TextInput
                style={styles.input}
                placeholder="Add quantity"
                onChangeText={handleChange('quantity')}
                value={values.quantity}
                keyboardType="numeric"
              />
              <View style={styles.btnBorder}>
                <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
                  <Text style={styles.btntext}>Add to Fridge</Text>
                </TouchableOpacity>
              </View>
            </>
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
    borderColor: 'green',
    borderRadius: 7,
  },
  btnBorder: {
    height: 40,
    marginHorizontal: 10,
    backgroundColor: 'green',
    borderRadius: 7,
    marginTop: 10,
  },
  btn: {
    marginTop: 7,
  },
  btntext: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});
