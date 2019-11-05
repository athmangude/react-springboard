import axios from 'axios';

import config from 'Config';
import * as BusinessNumberActionTypes from './constants';

export function setBusinessNumbers(businessNumbers, totalCount, currentPage) {
  return {
    type: BusinessNumberActionTypes.SET_BUSINESS_NUMBERS,
    businessNumbers,
    totalCount,
    currentPage,
  };
}

export function fetchBusinessNumbers(surveyId, limit = 20, offset = 0) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    return axios({
      method: 'GET',
      url: `${config.api.url}/accounts/${user['x-account-id']}/surveys/${surveyId}/business-numbers?limit=${limit}&offset=${offset}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function uploadBusinessNumber(details, file, headerMaps) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    const data = new FormData();
    data.append('headerMaps', JSON.stringify(headerMaps));
    data.append('file', file);
    return axios({
      method: 'POST',
      url: `${config.api.url}/accounts/${user['x-account-id']}/surveys/${details.surveyId}/business-numbers/file-upload`,
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function uploadRawBusinessNumber(details, data) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    return axios({
      method: 'POST',
      url: `${config.api.url}/accounts/${user['x-account-id']}/surveys/${details.surveyId}/business-numbers/raw-data-upload`,
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function updateBusinessNumber(data) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;
    
    return axios({
      method: 'PUT',
      url: `${config.api.url}/accounts/${user['x-account-id']}/surveys/${data.formData.surveyId}/business-numbers/update`,
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function toggleBusinessNumber(surveyId, id, status) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;
    
    return axios({
      method: 'DELETE',
      url: `${config.api.url}/accounts/${user['x-account-id']}/surveys/${surveyId}/business-numbers/toggle?id=${id}&status=${status}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
