import { createApiClient } from './creator/createClient';

const steamApi = createApiClient('https://api.steampowered.com/');

export default steamApi;
