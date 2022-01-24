/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-filename-extension */
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
        title='Next page'
        onPress={() =>
          navigation.navigate('FridgeList', {
            test: 'Info with a space',
          })
        }
      />
    </View>
  );
};

export default Home;
