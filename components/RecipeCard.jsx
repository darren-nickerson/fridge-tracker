import React from 'react';
import {
  Linking,
  Text,
  View,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';

const RecipeCard = ({ item }) => {
  return (
    <View style={styles.image}>
      <Text numberOfLines={1} style={styles.item}>
        {item.title}
      </Text>
      <Pressable onPress={() => Linking.openURL(`${item.sourceUrl}`)}>
        <Image
          style={{
            height: 140,
            width: 140,
            borderRadius: 25,
          }}
          source={{
            uri: item.image,
          }}
        />
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  item: {
    flex: 1,
    width: 140,
    fontSize: 15,
    marginTop: 10,
  },
  image: {
    paddingTop: 20,
    margin: 15,
    justifyContent: 'center',
  },
});
export default RecipeCard;
