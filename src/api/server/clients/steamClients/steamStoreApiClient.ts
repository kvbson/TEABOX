import { createApiClient } from '../creator/createClient';

const steamStoreApi = createApiClient('https://store.steampowered.com/api/');

export default steamStoreApi;