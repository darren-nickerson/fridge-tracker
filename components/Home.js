/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Home = () => {
  return (
    <View style={styles.container}>
      <Text>Home page</Text>
    </View>
  );
};

export default Home;
