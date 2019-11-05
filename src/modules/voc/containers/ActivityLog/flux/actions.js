import axios from 'axios';

import config from 'Config';
import * as ActivityLogsActionTypes from './constants';

export function addActivityLogs(items) {
  return {
    type: ActivityLogsActionTypes.ADD_ACTIVITY_LOGS,
    items,
  };
}

export function removeActivityLogs() {
  return {
    type: ActivityLogsActionTypes.REMOVE_ACTIVITY_LOGS,
  };
}

export function fetchActivityLogs(limit = 10, offset = 0, types = []) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    const eventTypesUrl = types.map((type) => `type=${type}`).join('&'); // eslint-disable-line no-unused-vars
    return axios({
      method: 'GET',
      // url: `${config.api.url}/activity-logs?limit=${limit}&offset=${offset}&${eventTypesUrl}`,
      url: `${config.api.url}/activity-logs?limit=${limit}&offset=${offset}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
