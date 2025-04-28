from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import re

app = Flask(__name__)
CORS(app)

#  Load dataset once at startup
file = "data/recipeDataset.csv"
df = pd.read_csv(file, encoding='ISO-8859-1')

#  Your existing logic, wrapped for use with the API
def suggest_recipes(df, available_ingredients):
    if df is None:
        return []

    available_ingredients = set(map(str.lower, available_ingredients))  # lower-case input

    def count_matches(ingredients):
        if pd.isna(ingredients):
            return 0
        ingredients_set = set(map(str.lower, re.findall(r"\b\w+\b", ingredients)))
        return len(ingredients_set.intersection(available_ingredients))
    
    df_copy = df.copy()
    df_copy["Matches"] = df_copy["Ingredients"].apply(count_matches)

    if available_ingredients:
        df_copy = df_copy[df_copy["Matches"] > 0]

    top_recipes = df_copy.sort_values(by="Matches", ascending=False).head(10)
    return top_recipes[["Name", "Ingredients", "Matches"]].to_dict(orient="records")

#  API endpoint
@app.route('/suggest-recipes', methods=['POST'])
def suggest_recipes_api():
    data = request.get_json()
    ingredients = data.get('ingredients', [])
    
    results = suggest_recipes(df, ingredients)
    return jsonify({"recipes": results})

if __name__ == '__main__':
    app.run(debug=True)
