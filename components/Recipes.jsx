import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SPOONACULAR_API_KEY } from 'react-native-dotenv';
import RecipeCard from './RecipeCard';

//console.log('SPOONACULAR_API_KEY: ', SPOONACULAR_API_KEY);

const Recipes = () => {
  // const [recipes, setRecipes] = useState([])
  const [recipes, setRecipes] = useState([
    {
      title: 'test1',
      image: 'https://spoonacular.com/recipeImages/716429-312x231.jpg',
      sourceUrl:
        'http://fullbellysisters.blogspot.com/2012/06/pasta-with-garlic-scallions-cauliflower.html',
      id: 1,
    },
    {
      title: 'test2',
      image: 'https://spoonacular.com/recipeImages/716429-312x231.jpg',
      sourceUrl:
        'http://fullbellysisters.blogspot.com/2012/06/pasta-with-garlic-scallions-cauliflower.html',
      id: 2,
    },
    {
      title:
        'test3hjgdhjsgfhjgdsjhfgjshdgfjhgsdjhfgjhsdgfjhgsdjhfgjhsdgfjhgdshjfgsdjhg',
      image: 'https://spoonacular.com/recipeImages/716429-312x231.jpg',
      sourceUrl:
        'http://fullbellysisters.blogspot.com/2012/06/pasta-with-garlic-scallions-cauliflower.html',
      id: 3,
    },
    {
      title: 'test4',
      image: 'https://spoonacular.com/recipeImages/716429-312x231.jpg',
      sourceUrl:
        'http://fullbellysisters.blogspot.com/2012/06/pasta-with-garlic-scallions-cauliflower.html',
      id: 4,
    },
    {
      title: 'test5',
      image: 'https://spoonacular.com/recipeImages/716429-312x231.jpg',
      sourceUrl:
        'http://fullbellysisters.blogspot.com/2012/06/pasta-with-garlic-scallions-cauliflower.html',
      id: 5,
    },
    {
      title: 'test6',
      image: 'https://spoonacular.com/recipeImages/716429-312x231.jpg',
      sourceUrl:
        'http://fullbellysisters.blogspot.com/2012/06/pasta-with-garlic-scallions-cauliflower.html',
      id: 6,
    },
    {
      title: 'test7',
      image: 'https://spoonacular.com/recipeImages/716429-312x231.jpg',
      sourceUrl:
        'http://fullbellysisters.blogspot.com/2012/06/pasta-with-garlic-scallions-cauliflower.html',
      id: 7,
    },
    {
      title: 'test8',
      image: 'https://spoonacular.com/recipeImages/716429-312x231.jpg',
      sourceUrl:
        'http://fullbellysisters.blogspot.com/2012/06/pasta-with-garlic-scallions-cauliflower.html',
      id: 8,
    },
    {
      title: 'test9',
      image: 'https://spoonacular.com/recipeImages/716429-312x231.jpg',
      sourceUrl:
        'http://fullbellysisters.blogspot.com/2012/06/pasta-with-garlic-scallions-cauliflower.html',
      id: 9,
    },
    {
      title: 'test10',
      image: 'https://spoonacular.com/recipeImages/716429-312x231.jpg',
      sourceUrl:
        'http://fullbellysisters.blogspot.com/2012/06/pasta-with-garlic-scallions-cauliflower.html',
      id: 10,
    },
  ]);

  // const { itemAdded } = useContext(itemContext);

  // const getRecipesFromApi = (fridgeString) => {
  //   return fetch(
  //     `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${fridgeString}&number=10&ranking=2`,
  //   )
  //     .then((response) => {
  //       // console.log(response);
  //       return response.json();
  //     })
  //     .catch((error) => console.error(error));
  // };

  // const getRecipeFromId = (id) => {
  //   return fetch(
  //     `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`,
  //   )
  //     .then((response) => response.json())
  //     .catch((error) => console.error(error));
  // };
  // const getFoodItems = () => {
  //   const colRef = collection(db, 'FoodItems');
  //   return getDocs(colRef)
  //     .then((snapshot) => {
  //       const foodItems = [];
  //       snapshot.docs.forEach((doc) => {
  //         foodItems.push({ ...doc.data(), id: doc.id });
  //       });
  //       return foodItems;
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // };

  // useEffect(() => {
  //   setRecipes([]);
  //   getFoodItems().then((result) => {
  //     // console.log(result);
  //     const fridgeString = result.map((item) => item.food_item).join(',+');
  //     // console.log(fridgeString);
  //     getRecipesFromApi(fridgeString).then((r) => {
  //       console.log(r);
  //       for (let i = 0; i < r.length; i++) {
  //         getRecipeFromId(r[i].id).then((recipe) => {
  //           setRecipes((curr) => {
  //             const newArr = [...curr, recipe];
  //             return newArr;
  //           });
  //         });
  //       }
  //     });
  //   });
  // }, [itemAdded]);

  return (
    <View style={styles.container}>
      {/* {recipes.map((item) => {
        return <RecipeCard key={item.id} item={item} />;
      })} */}
      <FlatList
        numColumns={2}
        data={recipes}
        renderItem={RecipeCard}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
});

export default Recipes;
