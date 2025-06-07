import requests
import csv


def get_steam_user_games(steam_id, api_key):
    url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/"
    params = {
        'key': api_key,
        'steamid': steam_id,
        'include_appinfo': 0,
        'include_played_free_games': 1
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        return data.get('response', {}).get('games', [])
    else:
        print("Error:", response.status_code)
        return []


def save_to_csv(game_ids, filename='steam_games.csv'):
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['appid'])

        for game in game_ids:
            writer.writerow([game['appid']])

    print(f"Saved {len(game_ids)} games into file {filename}")



steam_id = "76561198199623266"
api_key = "68109B45F1554772878485899C23285C"

games = get_steam_user_games(steam_id, api_key)
if games:
    save_to_csv(games)
else:
    print("Cannot get the list of games!")