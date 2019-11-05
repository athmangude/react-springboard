/* eslint-disable jsx-a11y/href-no-hash */
import axios from 'axios';

import config from 'Config';
import * as AudienceActionTypes from './constants';

export function addAudience(audience) {
  return {
    type: AudienceActionTypes.ADD_AUDIENCE,
    audience,
  };
}

export function addAudiences(audiences) {
  return {
    type: AudienceActionTypes.ADD_AUDIENCES,
    audiences,
  };
}

export function updateAudience(audience) {
  return {
    type: AudienceActionTypes.UPDATE_AUDIENCE,
    audience,
  };
}

export function removeAudience(audience) {
  return {
    type: AudienceActionTypes.REMOVE_AUDIENCE,
    audience,
  };
}

export function removeAudiences() {
  return {
    type: AudienceActionTypes.REMOVE_AUDIENCES,
  };
}

export function setAudiences(audiences, totalCount, currentPage) {
  return {
    type: AudienceActionTypes.SET_AUDIENCES,
    audiences,
    totalCount,
    currentPage,
  };
}

export function fetchSelectableAudiences() {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/audiences/selectable`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchAudience(audienceId) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/audiences/selectable/${audienceId}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function getAudienceMetadata(panelId) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    return axios({
      method: 'GET',
      url: `${config.api.url}/audiences/${panelId}/metadata`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}


export function createAudience(audience) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'POST',
      url: `${config.api.url}/audiences`,
      withCredentials: false,
      data: audience,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function uploadAudience(audience, file, headerMaps, panel) {
  return async (dispatch, getState) => {
    const method = panel ? 'PUT' : 'POST';
    const url = panel ? `${config.api.url}/audiences/${panel.panelId}/file-upload` : `${config.api.url}/audiences/file-upload`;
    const { user } = getState().authentication;
    const data = new FormData();
    Object.keys(audience).forEach((key) => {
      data.append(key, audience[key]);
    });
    data.append('headerMaps', JSON.stringify(headerMaps));
    data.append('file', file);
    return axios({
      method,
      url,
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function uploadRawAudience(details, data, panel) {
  return async (dispatch, getState) => {
    let paramFilters = '';

    Object.keys(details).forEach((key) => {
      paramFilters += key ? `${key}=${details[key]}&` : '';
    });

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);
    const method = panel ? 'PUT' : 'POST';
    const url = panel ? `${config.api.url}/audiences/${panel.panelId}/raw-data-upload?${paramFilters}` : `${config.api.url}/audiences/raw-data-upload?${paramFilters}`;
    const { user } = getState().authentication;

    return axios({
      method,
      url,
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function editAudience(id, audience) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/audiences/selectable/${id}`,
      withCredentials: false,
      data: audience,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function deleteAudience(audienceId) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'DELETE',
      url: `${config.api.url}/audiences/${audienceId}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function toggleShare(panelId, shareWithAccountId, share) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/audiences/selectable/${user['x-account-id']}/panels/${panelId}/share?sharedWithAccountId=${shareWithAccountId}&status=${share}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function requestDownload(audienceId) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      method: 'POST',
      url: `${config.api.url}/audiences/${audienceId}/data-download`,
      data: {},
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function pollDownloadProgress(audienceId, requestId) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      url: `${config.api.url}/audiences/${audienceId}/requests/${requestId}/data-download`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
