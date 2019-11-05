import axios from 'axios';

import config from 'Config';
import * as WifiActionTypes from './constants';

export function setBusinessWifiDetails(businessWifiDetails) {
  return {
    type: WifiActionTypes.SET_BUSINESS_WIFI_DETAILS,
    businessWifiDetails,
  };
}


export function fetchBusinessWifiDetails(payload) {
  return () => {
    return axios({
      method: 'GET',
      url: `${config.api.url}/wifi/meraki/fetch/${payload}`,
      withCredentials: false,
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
    });
  };
}

export function createWifiUser(payload) {
  return () => {
    return axios({
      method: 'POST',
      url: `${config.api.url}/wifi/meraki`,
      withCredentials: false,
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
      data: payload,
    });
  };
}

export function authenticateWifiUser(payload) {
  return () => {
    return axios({
      method: 'POST',
      url: `${config.api.url}/wifi/meraki/auth`,
      withCredentials: false,
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
      data: payload,
    });
  };
}
