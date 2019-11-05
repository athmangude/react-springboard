import axios from 'axios';

import config from 'Config';
import * as TouchPointActionTypes from './constants';

export function setTouchPoints(touchpoints, totalCount, currentPage) {
  return {
    type: TouchPointActionTypes.SET_TOUCH_POINTS,
    touchpoints,
    totalCount,
    currentPage,
  };
}

export function fetchTouchPoints(surveyId, limit = 20, offset = 0, status = 'ACTIVE') {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/accounts/${user['x-account-id']}/surveys/${surveyId}/touch-points?limit=${limit}&offset=${offset}&status=${status}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function uploadTouchPoints(details, file, headerMaps) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    const data = new FormData();
    data.append('headerMaps', JSON.stringify(headerMaps));
    data.append('file', file);
    return axios({
      method: 'POST',
      url: `${config.api.url}/accounts/${user['x-account-id']}/surveys/${details.surveyId}/touch-points/file-upload`,
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function uploadRawTouchpoint(details, data) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      method: 'POST',
      url: `${config.api.url}/accounts/${user['x-account-id']}/surveys/${details.surveyId}/touch-points/raw-data-upload`,
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function editTouchPoints(details) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      method: 'PUT',
      url: `${config.api.url}/accounts/${user['x-account-id']}/surveys/${details.surveyId}/touch-points/${details.touchpointId}`,
      withCredentials: false,
      data: details,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function deleteTouchPoint(details) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      method: 'DELETE',
      url: `${config.api.url}/accounts/${user['x-account-id']}/surveys/${details.surveyId}/touch-points/${details.touchpointId}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}