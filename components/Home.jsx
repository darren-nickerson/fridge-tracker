import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Next page button below</Text>
      <Button
        title="Look at your fridge"
        onPress={() => navigation.navigate('Fridge List')}
      />
      <Button
        title="Add item"
        onPress={() => navigation.navigate('Add Item')}
      />
      <Button title="Add item" onPress={() => navigation.navigate('AddItem')} />
      <Button
        title="Testing Camera"
        onPress={() => navigation.navigate('Camera')}
      />
    </View>
  );
};

export default Home;
