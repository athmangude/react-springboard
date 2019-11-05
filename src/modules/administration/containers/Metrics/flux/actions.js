/* eslint-disable jsx-a11y/href-no-hash */
import axios from 'axios';

import config from 'Config';

export function fetchMetrics(params = {}, endpoint) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.metrics.url}/v1/metrics${endpoint}timeSeries?${Object.keys(params).filter((key) => params[key]).map((key) => `${key}=${params[key]}`).join('&')}`,
      withCredentials: false,
      headers: {
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function fetchMetric(params = {}, endpoint) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.metrics.url}/v1/metrics${endpoint}summary?${Object.keys(params).filter((key) => params[key]).map((key) => `${key}=${params[key]}`).join('&')}`,
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
      url: `${config.metrics.url}/v1/metrics/messages/commDomains`,
      withCredentials: false,
      headers: {
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function fetchMpesaStatTypes() {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.metrics.url}/v1/metrics/mpesa/statTypes`,
      withCredentials: false,
      headers: {
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}
