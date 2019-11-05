import axios from 'axios';
import config from 'Config';

export async function fetchHomeFeed(user) {
  return axios({
    url: `${config.api.url}/Home`,
    method: 'GET',
    withCredentials: false,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}
