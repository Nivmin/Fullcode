#!/usr/bin/env python
# coding: utf-8

import pandas as pd
import numpy as np
import re

file = "data/recipeDataset.csv"
df = pd.read_csv(file, encoding='ISO-8859-1')

df.head() # This outputs the Recipe Dataset Table.
ingredientsArray = []

# Method to store the inputed ingredients into an array.
def inputIngredients():
    print("Enter the ingredients:")

    # Allows the user to input ingredients until they press enter without typing anything.
    while True:
        ingredient = input("")

        # Check if the input is blank. If yes, exit the loop.
        if ingredient == "":
            break
        # Otherwise add the inputed ingredient into the array.
        ingredientsArray.append(ingredient)
    
    # print("ingredients: ", ingredientsArray) # Just for testing.


def suggest_recipes(df, available_ingredients):
    if df is None:
        print("Error: DataFrame is not loaded.")
        return None
    
    available_ingredients = set(map(str.lower, available_ingredients))  # Convert to lowercase for case-insensitive matching
    
    def count_matches(ingredients):
        if pd.isna(ingredients):
            return 0
        ingredients_set = set(map(str.lower, re.findall(r"\b\w+\b", ingredients)))  # Extract words as ingredients
        return len(ingredients_set.intersection(available_ingredients))
    
    df = df.copy()  # Avoid SettingWithCopyWarning
    df["Matches"] = df["Ingredients"].apply(count_matches)

    # Exclude recipes with zero matches unless available_ingredients is empty.
    if available_ingredients:
        df = df[df["Matches"] > 0] # Exclude recipes with zero matches.
    top_recipes = df.sort_values(by="Matches", ascending=False).head(10)
    return top_recipes[["Name", "Ingredients", "Matches"]]

# Example usage
#ingredientsArray = ['baking', 'potatoes', 'pepper', 'coriander', 'salt', 'onion', 'garlic', 'tomato', 'chicken', 'oil', 'water']
inputIngredients() # Calls the method which allows the user to input the ingredients.
top = suggest_recipes(df, available_ingredients=ingredientsArray)

if top is not None:
    print(top)
