import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecipeSuggestions from './RecipeSuggestions';
import RecipeDetail from './RecipeDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RecipeSuggestions">
        <Stack.Screen 
          name="RecipeSuggestions" 
          component={RecipeSuggestions} 
          options={{ title: 'Find Recipes' }}
        />
        <Stack.Screen 
          name="RecipeDetail" 
          component={RecipeDetail} 
          options={({ route }) => ({ title: route.params.recipe.Name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}