/* eslint-disable jsx-a11y/href-no-hash */
import axios from 'axios';

import config from 'Config';
import * as ActionTypes from './constants';

export function setAccountDetails(account) {
  return {
    type: ActionTypes.SET_ACCOUNT_DETAILS,
    account,
  };
}

export function fetchAppliedNPSFilters(surveyId) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    const url = surveyId ? `${config.api.url}/surveys/${surveyId}/applied-metadata?name=nps_filters` : `${config.api.url}/accounts/${user['x-account-id']}/applied-metadata?name=nps_filters`;
    return axios({
      method: 'GET',
      url,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchAvailableNPSFIlters(surveyId) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    const url = surveyId ? `${config.api.url}/surveys/${surveyId}/metadata` : `${config.api.url}/accounts/${user['x-account-id']}/metadata`;
    return axios({
      method: 'GET',
      url,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function addNPSFilter(surveyId, data) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    const url = surveyId ? `${config.api.url}/surveys/${surveyId}/metadata` : `${config.api.url}/accounts/${user['x-account-id']}/metadata`;
    return axios({
      method: 'POST',
      url,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
      data,
    });
  };
}

export function removeNPSFilter(surveyId, metadataId) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    const url = surveyId ? `${config.api.url}/surveys/${surveyId}/metadata/${metadataId}` : `${config.api.url}/accounts/${user['x-account-id']}/metadata/${metadataId}`;

    return axios({
      method: 'DELETE',
      url,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
