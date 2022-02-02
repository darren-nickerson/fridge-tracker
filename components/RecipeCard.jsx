import React from 'react';
import { Linking, Text, View, Image } from 'react-native';

const RecipeCard = ({ item }) => {
  return (
    <View>
      <Text>{item.title}</Text>
      <Image
        style={{
          width: 50,
          height: 50,
        }}
        source={{
          uri: item.image,
        }}
        onPress={() => Linking.openURL(`${item.sourceUrl}`)}
      />
    </View>
  );
};

export default RecipeCard;
