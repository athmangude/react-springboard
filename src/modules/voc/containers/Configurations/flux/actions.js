/* eslint-disable jsx-a11y/href-no-hash */
import axios from 'axios';

import config from 'Config';
import * as ConfigurationActionTypes from './constants';

export function setAccountConfigurations(configurations) {
  return {
    type: ConfigurationActionTypes.SET_ACCOUNT_CONFIGURATIONS,
    configurations,
  };
}

export function updateIsFetchingAccountConfigurationStatus(status) {
  return {
    type: ConfigurationActionTypes.UPDATE_IS_FETCHING_CONFIGURATIONS_STATUS,
    status,
  };
}

export function updateFetchConfigurationErrorStatus(status) {
  return {
    type: ConfigurationActionTypes.UPDATE_FETCH_CONFIGURATION_ERROR_STATUS,
    status,
  };
}

export function updateDemoMode(demoMode) {
  return {
    type: ConfigurationActionTypes.UPDATE_DEMO_MODE,
    demoMode,
  };
}

export function fetchAccountConfigurations() {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      url: `${config.api.url}/accounts/${user['x-account-id']}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
