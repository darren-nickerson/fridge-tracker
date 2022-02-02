import React from 'react';
import { Linking, Text, View, Image } from 'react-native';

const RecipeCard = ({ item }) => {
  return (
    <View>
      <Text>{item.title}</Text>
      <Text onPress={() => Linking.openURL(`${item.sourceUrl}`)}>
        {item.sourceUrl}
      </Text>
      <Image
        style={{
          width: 50,
          height: 50,
        }}
        source={{
          uri: item.image,
        }}
      />
    </View>
  );
};

export default RecipeCard;
