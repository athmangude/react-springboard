import axios from 'axios';
import * as AccountsActionTypes from './constants';

import config from 'Config';

export function addAccounts(accounts) {
  return {
    type: AccountsActionTypes.ADD_ACCOUNTS,
    accounts,
  };
}

export function removeAccounts() {
  return {
    type: AccountsActionTypes.REMOVE_ACCOUNTS,
  };
}

export function setIndustries(industries) {
  return {
    type: AccountsActionTypes.SET_INDUSTRIES,
    industries,
  };
}

export function fetchAccounts(params = {}) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/administration/accounts?${Object.keys(params).map((key) => `${key}=${params[key]}`).join('&')}`,
      withCredentials: false,
      headers: {
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function fetchIndustries() {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/administration/industries`,
      withCredentials: false,
      headers: {
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function searchAccounts(searchTerm) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/administration/accounts/search/name?name=${searchTerm}`,
      withCredentials: false,
      headers: {
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function fetchAccount(accountId) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/administration/accounts/${accountId}`,
      withCredentials: false,
      headers: {
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function createAccount(data) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'POST',
      url: `${config.api.url}/administration/accounts`,
      withCredentials: false,
      data,
      headers: {
        authorization: `Bearer ${admin.token}`,
        'Content-Type': 'application/json',
      },
    });
  };
}

export function updateGeneralAccountDetails(accountId, details) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'PATCH',
      url: `${config.api.url}/administration/accounts/${accountId}`,
      data: details,
      headers: {
        authorization: `Bearer ${admin.token}`,
        'Content-Type': 'application/json',
      },
    });
  };
}

export function updateAccountFeatures(accountId, features) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'PATCH',
      url: `${config.api.url}/administration/accounts/${accountId}/features`,
      data: features,
      headers: {
        authorization: `Bearer ${admin.token}`,
        'Content-Type': 'application/json',
      },
    });
  };
}

export function createCollaborator(accountId, collaborator) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'POST',
      url: `${config.api.url}/accounts/${accountId}/users`,
      withCredentials: false,
      data: collaborator,
      headers: {
        'x-account-id': accountId,
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function fetchCollaborators(accountId) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/accounts/${accountId}/users`,
      withCredentials: false,
      headers: {
        'x-account-id': accountId,
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function fetchRoles(accountId) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/roles`,
      withCredentials: false,
      headers: {
        'x-account-id': accountId,
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function updateCollaborator(accountId, collaboratorId, roleId) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/accounts/${accountId}/users/${collaboratorId}`,
      withCredentials: false,
      data: {
        roleId,
      },
      headers: {
        'x-account-id': accountId,
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function toggleCollaborator(accountId, collaboratorId, roleId) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/accounts/${accountId}/users/${collaboratorId}/roles/${roleId}`,
      withCredentials: false,
      headers: {
        'x-account-id': accountId,
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function fetchUSSDSurveys(accountId, params) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    let paramFilters = '';

    Object.keys(params).forEach((key) => {
      paramFilters += key ? `${key}=${params[key]}&` : '';
    });

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      method: 'GET',
      url: `${config.api.url}/ussd?${paramFilters}`,
      withCredentials: false,
      headers: {
        'x-account-id': accountId,
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function createUSSD(accountId, surveyId, data) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'POST',
      url: `${config.api.url}/surveys/${surveyId}/metadata`,
      withCredentials: false,
      data,
      headers: {
        'x-account-id': accountId,
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function updateUSSD(accountId, surveyId, data) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/surveys/${surveyId}/metadata`,
      withCredentials: false,
      data,
      headers: {
        'x-account-id': accountId,
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function deleteUSSD(accountId, surveyId, metadataId) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'DELETE',
      url: `${config.api.url}/surveys/${surveyId}/metadata/${metadataId}`,
      withCredentials: false,
      headers: {
        'x-account-id': accountId,
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function addAccountChannel(accountId, channel) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'POST',
      url: `${config.api.url}/administration/accounts/${accountId}/channels`,
      withCredentials: false,
      data: channel,
      headers: {
        'x-account-id': accountId,
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function updateAccountChannel(accountId, channel) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'PATCH',
      url: `${config.api.url}/administration/accounts/${accountId}/channels`,
      withCredentials: false,
      data: channel,
      headers: {
        'x-account-id': accountId,
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function fetchSmsNumbers(accountId) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/administration/accounts/${accountId}/sms-numbers`,
      withCredentials: false,
      headers: {
        'x-account-id': accountId,
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function createWifiSettings(accountId, welcomeMsg, background = [], logo = []) {
  return async (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;

    const data = new FormData();
    if (welcomeMsg !== null) { data.append('wifiCustomText', welcomeMsg); }
    if (logo.length > 0) { data.append('accountLogo', logo[0]); }
    if (background.length > 0) { data.append('wifiBackgroundImage', background[0]); }
    return axios({
      method: 'POST',
      url: `${config.api.url}/administration/accounts/${accountId}/wifi/config`,
      withCredentials: false,
      data,
      headers: {
        'x-account-id': accountId,
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}

export function fetchWifiSettings(accountId) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;
    return axios({
      method: 'GET',
      url: `${config.api.url}/wifi/fetchCustomWifiSettings`,
      withCredentials: false,
      data: accountId,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
