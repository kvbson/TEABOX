import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const createApiClient = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Teabox/0.0.0',
    },
    params: {
      key: process.env.STEAM_API_KEY,
    },
  });

  api.interceptors.request.use(config => {
    console.log(`Making request to ${config.url}`);
    return config;
  });

  api.interceptors.response.use(response => {
    console.log(`[Success] ${response.status} ${response.config.url}`);
    return response;
  });

  return api;
};