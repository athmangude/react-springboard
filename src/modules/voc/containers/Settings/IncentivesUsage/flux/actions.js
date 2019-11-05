import axios from 'axios';

import config from 'Config';

export function fetchIncentivesUsage(filters) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;

    let paramFilters = '';

    Object.keys(filters).forEach((key) => {
      paramFilters += filters[key] ? `${key}=${filters[key]}&` : '';
    });

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      method: 'GET',
      url: `${config.api.url}/accounts/${user['x-account-id']}/incentives-usage?${paramFilters}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function requestDownload(surveyId, date) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    const data = {
      startDate: date.startDate,
      endDate: date.endDate,
    };
    if (surveyId) {
      data.surveyId = surveyId;
    }

    return axios({
      method: 'POST',
      url: `${config.api.url}/accounts/${user['x-account-id']}/incentives-usage-download`,
      data,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function pollDownloadProgress(requestId) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    return axios({
      url: `${config.api.url}/accounts/${user['x-account-id']}/requests/${requestId}/incentives-usage-download`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
