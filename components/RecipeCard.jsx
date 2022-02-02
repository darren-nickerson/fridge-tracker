import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const RecipeCard = ({ item }) => {
  return (
    <View>
      <Text>{item.title}</Text>
      <Text>{item.sourceUrl}</Text>
    </View>
  );
};

export default RecipeCard;
