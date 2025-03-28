import { createApiClient } from '#server/clients/creator/createClient';

const steamApi = createApiClient('https://api.steampowered.com/');

export default steamApi;
