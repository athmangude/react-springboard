/* eslint-disable jsx-a11y/href-no-hash */
import axios from 'axios';

import config from 'Config';
import * as DNDListActionTypes from './constants';

export function setDNDLists(dndlists, totalCount, currentPage) {
  return {
    type: DNDListActionTypes.SET_DND_LISTS,
    dndlists,
    totalCount,
    currentPage,
  };
}

export function fetchDNDLists(status) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/dnds?status=${status}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function uploadDNDList(dnd, file, headerMaps) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let paramFilters = '';

    Object.keys(dnd).forEach((key) => {
      paramFilters += dnd[key] ? `${key}=${dnd[key]}&` : '';
    });

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    const data = new FormData();
    data.append('headerMaps', JSON.stringify(headerMaps));
    data.append('file', file);
    return axios({
      method: 'POST',
      url: `${config.api.url}/dnds/file-upload?${paramFilters}`,
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function uploadRawDND(details, data) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let paramFilters = '';

    Object.keys(details).forEach((key) => {
      paramFilters += details[key] ? `${key}=${details[key]}&` : '';
    });

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      method: 'POST',
      url: `${config.api.url}/dnds/raw-data-upload?${paramFilters}`,
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function editDNDList(data) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/dnds/edit`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
      data,
    });
  };
}

export function deleteDNDList(data) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'DELETE',
      url: `${config.api.url}/dnds/delete?commId=${data}&status=false`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

