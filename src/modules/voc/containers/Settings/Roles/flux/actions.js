import axios from 'axios';

import * as RoleActionTypes from './constants';
import config from 'Config';

export function addRoles(roles) {
  return {
    type: RoleActionTypes.ADD_ROLES,
    roles,
  };
}

export function setLoggedInUserRole(loggedInUserRole) {
  return {
    type: RoleActionTypes.SET_LOGGED_IN_USER_ROLE,
    loggedInUserRole,
  };
}

export function fetchRoles() {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/roles`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchAdminRoles(accountId) {
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
