from fastapi import FastAPI, Request
from litellm import completion
import os
import json
import requests

app = FastAPI()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
REVIEWS_PER_GAME = 10


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


@app.post("/generate")
async def generate(request: Request):
    try:
        # Get raw JSON body
        body = await request.json()
        AppID = body.get("AppID")

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
        5. Ignore reviews containing html tags.
        6. Give only JSON file as a response."""

        data = get_reviews_for_app(AppID)
        if data and 'reviews' in data:
            reviews = """ """

            for review in data['reviews']:
                reviews += f"\n {review['review']}"

            # Call Groq API
            response = completion(
                model="groq/llama3-70b-8192",
                messages=[{
                    "role": "system",
                    "content": system_prompt
                },
                    {
                        "role": "user",
                        "content": f"Reviews: {reviews}"
                    }],
                api_key=GROQ_API_KEY
            )
            return {"response": response.choices[0].message.content}
        else:
            return {"error": "No reviews for this game"}
    except Exception as e:
        return {"error": str(e)}