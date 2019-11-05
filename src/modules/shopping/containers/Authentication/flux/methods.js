/* eslint-disable jsx-a11y/href-no-hash */
import axios from 'axios';
import config from 'Config';

axios.defaults.withCredentials = true;

export async function authenticate(credentials) { // eslint-disable-line no-unused-vars
  // make network request to authenticate
  return axios({
    method: 'POST',
    url: `${config.api.url}/authentication/authenticate`,
    data: credentials,
    withCredentials: false,
  });
}
