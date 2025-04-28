# THIS PROGRAM IS ONLY AVAILABLE FOR GROUP 55 MEMBERS!
# THIS PROGRAM ONLY WORKS FOR nhs.uk WEBSITES.
# THIS PROGRAM ONLY ADDS THE RECIPES TO recipeDataset.csv FILE.
import requests
from bs4 import BeautifulSoup
import csv
import os
import time
import sys

def add_to_csv(file_path, num_value, title_str, method_str, ingredients_str, calories_str, nutrition_str, serves_str):
    # Check if file exists
    file_exists = os.path.isfile(file_path)
    
    if file_exists:
        # Read existing data to preserve it
        rows = []
        try:
            with open(file_path, mode="r", encoding="utf-8", errors="replace") as csvfile:
                reader = csv.reader(csvfile)
                rows = list(reader)
        except Exception as e:
            print(f"Error reading file: {e}")
            return False
    
    # Open file for writing
    try:
        with open(file_path, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            
            # If file doesn't exist or was empty.
            if not file_exists or not rows:
                print("File does not exist!")
                
            # Write existing data back
            if file_exists and rows:
                writer.writerows(rows)
            
            # Add new row
            writer.writerow([num_value, title_str, ingredients_str, method_str, calories_str, nutrition_str, serves_str])
        
        print(f"Recipe added to {file_path} successfully!")
        return True
    except Exception as e:
        print(f"Error writing to file: {e}")
        return False


def scrape(url, column_num):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    ## Title
    title = soup.select_one('h1').text

    ## Method
    methodString = ""
    p_elements = soup.select('ol p')
    methodString = (methodString + ' ' + ' '.join(p.text for p in p_elements)).strip()

    ## Ingredients
    div_section = soup.select_one('div.bh-recipe-instructions')
    ingredientsString = ""
    if div_section:
        # Select all <li> elements inside the <ul> within the <div>
        li_elements = div_section.select('ul li')
        if li_elements:
            ingredientsString = (ingredientsString + ' ' + ' '.join(li.text for li in li_elements)).strip()
        else:
            print("No <li> elements found inside the div.")
    else:
        print("No matching div found.")

    ## kcal
    first_li = soup.select_one('.nhsuk-details__text ul li') # Finds the first li element

    if first_li:
        text = first_li.text

        # Check if "kcal" is in the text
        if "kcal" in text:
            parts = text.split('/')   # Split by "/" 
            for part in parts:        # Find the part containing "kcal"
                if "kcal" in part:
                    # Extract just the number
                    kcal_value = ''.join(filter(str.isdigit, part))
                    caloriesString = kcal_value + "kcal"
                    break
        else:
            print("kcal information not found")
    else:
        print("Nutritional information not found")


    ## Nutritional info
    nutriString = ""
    nutriInfo = soup.select('.nhsuk-details__text ul li')
    nutriString += ' ' + ' '.join(nu.text for nu in nutriInfo if "kcal" not in nu.text)
    nutriString = nutriString.strip()  # Remove any leading/trailing spaces

    ## Serving number
    description_p = soup.select('.bh-recipe__description p')
    for de in description_p:
        if "Serves" in de.text:
            parts = de.text.split(' ')
            for part in parts:
                servesNum = ''.join(filter(str.isdigit, part))

    add_to_csv('data/recipeDataset.csv', column_num, title, methodString, ingredientsString, caloriesString, nutriString, servesNum)


def main():
    print("\nRECIPE WEB SCRAPER\n")
    print("By Ryan Joy")
    print("March 2024\n")
    print("################### PLEASE NOTE ###################")
    print("THIS PROGRAM IS ONLY AVAILABLE FOR GROUP 55 MEMBERS!")
    print("THIS SOFTWARE: ONLY WORKS FOR nhs.uk WEBSITES.")
    print("               ADDS THE RECIPES TO recipeDataset.csv FILE.")
    print()
    print("MAKE SURE TO TYPE A ROW NUMBER GREATER THAN THE CURRENT NUMBER OF ROWS IN \nTHE FILE recipeDataset.csv. FAILURE TO DO SO COULD CORRUPT THE DATASET!!")
    print("\nStarting WebScraper")
    sys.stdout.write("-")
    time.sleep(1)
    sys.stdout.write("---------")
    sys.stdout.write("---------")
    time.sleep(0.5)
    print("\nWelcome!")
    print("\nTo stop the program, type \"stop\" in the url box.\n")
    while True:
        urlInput = input("Enter a URL: ")
        if(urlInput == 'stop' or urlInput == 'STOP' or urlInput == 'Stop'):
            sys.exit("\nExiting Program")
        recipeNum = input("Enter the row number: ")
        print()
        scrape(urlInput, recipeNum)

if __name__ == '__main__':
    main()