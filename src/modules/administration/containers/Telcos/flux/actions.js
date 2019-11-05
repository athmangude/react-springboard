import axios from 'axios';

import config from 'Config';

export function fetchSupportedCountries() {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/telcos/countries`,
      withCredentials: false,
      headers: {
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function fetchCommDomains() {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/telcos/commDomains`,
      withCredentials: false,
      headers: {
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function fetchNetworkIDs(countryId, isActive) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/telcos/networkIds?countryId=${countryId}&active=${isActive}`,
      withCredentials: false,
      headers: {
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function createNetworkIDs(payload) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'POST',
      url: `${config.api.url}/telcos/national-destination-codes`,
      withCredentials: false,
      data: payload,
      headers: {
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function updateNetworkID(payload) {
  console.log('[updateNetworkIDs]', payload);
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/telcos/national-destination-codes/?id=${payload.id}`,
      withCredentials: false,
      data: payload,
      headers: {
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}
