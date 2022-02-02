import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import RecipeCard from './RecipeCard';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  const fridgeItems = ['apples', 'flour', 'sugar'];
  const fridgeStr = fridgeItems.join(',+');
  const apiKey = '3b4100511cda452e8720c2da844a1984';

  const getRecipesFromApi = () => {
    return fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${fridgeStr}&number=3&ranking=2`,
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
      for (let i = 0; i < result.length; i++) {
        getRecipeFromId(result[i].id).then((recipe) => {
          setRecipes((curr) => {
            const newArr = [...curr, recipe];
            return newArr;
          });
        });
      }
    });
  }, []);

  return (
    <View>
      <Text>RECIPES</Text>
      {recipes.map((item) => {
        return <RecipeCard key={item.id} item={item} />;
      })}
    </View>
  );
};

export default Recipes;
