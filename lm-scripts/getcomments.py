import requests
import csv
import time
import json

# Configuration
STEAM_API_KEY = "68109B45F1554772878485899C23285C"
INPUT_CSV = "steam_games.csv"
REVIEWS_PER_GAME = 10

# Getting reviews for games using the steamworks API by their appid
def get_reviews_for_app(app_id, cursor="*"):
    url = f"https://store.steampowered.com/appreviews/{app_id}"
    params = {
        'json': '1',
        'filter': 'all',
        'language': 'english',
        'purchase_type': 'all',
        'num_per_page': REVIEWS_PER_GAME,
        'cursor': cursor
    }

    response_steam = requests.get(url, params=params)
    if response_steam.status_code == 200:
        return response_steam.json()
    return None

# Function for inquiring to local Mistral server
def query_mistral(message):
    url = "http://localhost:1234/v1/chat/completions"
    headers = {"Content-Type": "application/json"}

    pros_fields = ",\n    ".join([f'"pro{i}": ""' for i in range(1, 5)])
    cons_fields = ",\n    ".join([f'"con{i}": ""' for i in range(1, 5)])

    system_prompt = f"""You will be given a list of reviews for a game. Analyse them and give me a list of pros an cons based on the reviews. Respond in JSON format with this exact structure:
    {{
      "Pros": {{
        {pros_fields}
      }},
      "Cons": {{
        {cons_fields}
      }}
    }}

    Rules:
    1. Fill all fields if possible.
    2. Be concise.
    3. Use consistent formatting of pros and cons.
    4. Omit redundant pros and cons.
    5. Ignore reviews containing html tags."""

    data = {
        "model": "mistral-7b-instruct-v0.3",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Reviews: {message}"}
        ],
        "temperature": 0.2,
        "max_tokens": -1,
        "stream": False
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Query error: {str(e)}")
        return None



def process_games():
    object = {}
    #Opening a .csv file containing app id's for games
    with open(INPUT_CSV, mode='r', encoding='utf-8') as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            app_id = row[0]
            print(f"Getting reviews for the game with id of: {app_id}...")

            try:
                data = get_reviews_for_app(app_id) # getting reviews
                if data and 'reviews' in data:
                    reviews = """ """

                    for review in data['reviews']:
                        reviews += review.get('\n','review')


                    try:
                        output = query_mistral(reviews)['choices'][0]['message']['content'] # getting pros and cons analysis from mistral

                        parsed = json.loads(output)
                        if "Pros" not in parsed or "Cons" not in parsed: # checking response structure
                            raise ValueError("Invalid JSON structure")

                        parse_to_object = {
                            app_id : parsed
                        }

                        object.update(parse_to_object)

                        #Making the list into json file
                        with open("reviews/reviews.json", 'w') as f:
                            json.dump(object, f, indent=3)

                        print(f"Saved to reviews.json")


                    except Exception as e:
                        print(f"Error processing response: {str(e)}")
                        return {"Pros": {}, "Cons": {}}



                else:
                    print("No reviews or API error!")
                    with open("reviews/noreviews.txt", 'a') as a:
                        a.write(f"\n {app_id}")
                    continue
                time.sleep(1)  # Limiting API requests
            except Exception as e:
                print(f"Error for the game {app_id}: {str(e)}")


if __name__ == "__main__":
   process_games()
