import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const steamStoreApi = axios.create({
  baseURL: 'https://store.steampowered.com/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Teabox/0.0.0'
  },
  params: {
    key: process.env.VITE_STEAM_API_KEY
  }
});

steamStoreApi.interceptors.request.use(config => {
  console.log(`Making request to ${config.url}`);
  return config;
});

steamStoreApi.interceptors.response.use(response => {
  console.log(`Received response with status ${response.status}`);
  return response;
});

export default steamStoreApi;