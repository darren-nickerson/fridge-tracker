import React, { useContext, useState } from 'react';
import * as yup from 'yup';
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

import { barcodeContext, itemContext } from '../context';

export default function AddItemFormik() {
  const { barcodeData, setBarcodeData } = useContext(barcodeContext);
  const { setItemAdded } = useContext(itemContext);
  const [handleItemAdded, setHandleItemAdded] = useState('');

  const foodSchema = yup.object({
    food_item: yup.string().required('please enter valid food item').max(50),
    quantity: yup.string().required('please enter number between 1-99').max(2),
  });
  return (
    <Formik
      initialValues={{
        category: '🍎 fruit',
        expiration_date: new Date().toISOString(),
        food_item: barcodeData,
        quantity: '1',
        user_id: '1',
      }}
      validationSchema={foodSchema}
      enableReinitialize
      onSubmit={(values, { resetForm }) => {
        const colRef = collection(db, 'FoodItems');
        setItemAdded((currentItem) => {
          return !currentItem;
        });
        addDoc(colRef, values);
        setHandleItemAdded('Item added');
        resetForm({ values: '' });
        setBarcodeData('');
        setTimeout(() => {
          setHandleItemAdded('');
        }, 2000);
      }}
    >
      {({
        handleSubmit,
        setFieldValue,
        handleChange,
        values,
        errors,
        touched,
        handleBlur,
      }) => (
        <AddItem
          setFieldValue={setFieldValue}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          values={values}
          handleItemAdded={handleItemAdded}
          errors={errors}
          touched={touched}
          handleBlur={handleBlur}
        />
      )}
    </Formik>
  );
}

const AddItem = (props) => {
  const {
    setFieldValue,
    handleSubmit,
    handleChange,
    values,
    handleItemAdded,
    errors,
    touched,
    handleBlur,
  } = props;
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
    setFieldValue('expiration_date', newDate.toISOString());
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
                onBlur={handleBlur('food_item')}
              />

              <Text style={styles.errorText}>
                {touched.food_item && errors.food_item}{' '}
              </Text>

              <Text style={styles.input} onPress={showDatePicker}>
                {moment(expiryDate).format('MMM Do YY')}
              </Text>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <Text style={styles.errorText}>
                {touched.date && errors.quantity}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Add quantity"
                onChangeText={handleChange('quantity')}
                value={values.quantity}
                keyboardType="numeric"
                onBlur={handleBlur('quantity')}
              />
              <Text style={styles.errorText}>
                {touched.food_item && errors.quantity}{' '}
              </Text>

              <View style={styles.btnBorder}>
                <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
                  <Text style={styles.btntext}>Add to Fridge</Text>
                </TouchableOpacity>
                <View style={styles.addItem}>
                  <Text style={styles.addItemText}>{handleItemAdded} </Text>
                </View>
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
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: '#009900',
    borderRadius: 7,
  },
  btnBorder: {
    height: 40,
    marginHorizontal: 10,
    backgroundColor: '#009900',
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
  addItemText: { textAlign: 'center', marginTop: 25, color: '#009900' },
  errorText: { color: '#d92626', fontSize: 12, textAlign: 'center' },
});

// #85b4e0
