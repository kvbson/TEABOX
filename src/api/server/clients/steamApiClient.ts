import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const steamApi = axios.create({
  baseURL: 'https://api.steampowered.com/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Teabox/0.0.0'
  },
  params: {
    key: process.env.VITE_STEAM_API_KEY
  }
});

steamApi.interceptors.request.use(config => {
  console.log(`Making request to ${config.url}`);
  return config;
});

steamApi.interceptors.response.use(
  response => {
    console.log(`[Success] ${response.status} ${response.config.url}`);
    return response;
  },
);

export default steamApi;