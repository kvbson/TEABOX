import { createApiClient } from '../creator/createClient.js';

const steamApi = createApiClient('https://api.steampowered.com/');

export default steamApi;
