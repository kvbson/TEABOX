import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const steamAPIKey = process.env.VITE_STEAM_API_KEY;

export const fetchSteamData = async <T extends unknown>(endpoint: string, params: Record<string, string>): Promise<T> => {
    if (!steamAPIKey) {
      throw new Error('Steam API key not found in environment variables');
    }
    const url = new URL(`https://api.steampowered.com/${endpoint}`);

    url.searchParams.append('key', steamAPIKey);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Steam API Error: ${response.status}`);
      }
      return await response.json() as T;
    } catch (error) {
      throw error;
    }
  };