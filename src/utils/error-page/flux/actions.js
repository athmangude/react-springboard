import axios from 'axios';
import config from 'Config';

export function error(payload) {
  return () => {
    return axios({
      method: 'POST',
      url: `${config.api.url}/error`,
      withCredentials: false,
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
      data: payload,
    });
  };
}

export function reportError(payload) {
  return () => {
    return axios({
      method: 'POST',
      url: `${config.api.url}/error/report`,
      withCredentials: false,
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
      data: payload,
    });
  };
}
