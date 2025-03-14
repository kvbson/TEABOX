import { createApiClient } from '../creator/createClient.js';

const steamStoreApi = createApiClient('https://store.steampowered.com/api/');

export default steamStoreApi;