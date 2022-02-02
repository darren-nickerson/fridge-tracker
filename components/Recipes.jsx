import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  const fridgeItems = ['apples', 'flour', 'sugar'];
  const fridgeStr = fridgeItems.join(',+');
  const apiKey = '3b4100511cda452e8720c2da844a1984';
  // const id = '640352';

  const getRecipesFromApi = () => {
    return fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${fridgeStr}&number=10`,
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));
  };

  const getRecipeFromId = (id) => {
    return fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`,
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getRecipesFromApi().then((result) => {
      setRecipes(
        result.map((obj) => {
          return getRecipeFromId(obj.id).then((recipe) => recipe);
        }),
      );
    });
  }, []);
  console.log(recipes);

  return (
    <View>
      <Text>RECIPES</Text>
      {/* {Recipes.map((item) => {
        return (
          <ItemCard
            key={item.id}
            item={item}
            setItemArray={setItemArray}
            itemArray={itemArray}
          />
        );
      })} */}
    </View>
  );
};

export default Recipes;
