import { getDocs, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { SPOONACULAR_API_KEY } from 'react-native-dotenv';
import RecipeCard from './RecipeCard';

//console.log('SPOONACULAR_API_KEY: ', SPOONACULAR_API_KEY);

import { db } from '../core/Config';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  const getRecipesFromApi = (fridgeString) => {
    return fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${fridgeString}&number=3&ranking=2`,
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));
  };

  const getRecipeFromId = (id) => {
    return fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`,
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));
  };
  const getFoodItems = () => {
    const colRef = collection(db, 'FoodItems');
    return getDocs(colRef)
      .then((snapshot) => {
        const foodItems = [];
        snapshot.docs.forEach((doc) => {
          foodItems.push({ ...doc.data(), id: doc.id });
        });
        return foodItems;
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    setRecipes([]);
    getFoodItems().then((result) => {
      const fridgeString = result.map((item) => item.food_item).join(',+');
      getRecipesFromApi(fridgeString).then((r) => {
        for (let i = 0; i < r.length; i++) {
          getRecipeFromId(r[i].id).then((recipe) => {
            setRecipes((curr) => {
              const newArr = [...curr, recipe];
              return newArr;
            });
          });
        }
      });
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
