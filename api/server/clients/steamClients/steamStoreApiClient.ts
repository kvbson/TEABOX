import { createApiClient } from '#server/clients/creator/createClient';

const steamStoreApi = createApiClient('https://store.steampowered.com/');

export default steamStoreApi;