import axios from 'axios';
import * as EventHandler from 'Utils/EventHandler';

import config from 'Config';
import * as AdminAuthenticationActionTypes from './constants';

export function signOut() {
  localStorage.setItem('admin', null);
  return {
    type: AdminAuthenticationActionTypes.ADMIN_SIGN_OUT,
  };
}

export function authenticate(credentials) {
  return async () => axios({
      method: 'POST',
      url: `${config.api.url}/authentication/authenticate`,
      data: credentials,
      withCredentials: false,
    });
}

export function signIn(aUser) {
  return (dispatch) => {
    try {
      const stringifiedUserObject = JSON.stringify(aUser);
      localStorage.setItem('admin', stringifiedUserObject);
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      setTimeout(() => {
        dispatch({
          type: AdminAuthenticationActionTypes.ADMIN_SIGN_IN,
          aUser,
        });
      }, 1000);
    }
  };
}

export function forgotPassword(data) {
  return () => axios({
      method: 'POST',
      url: `${config.api.url}/authentication/user/forgot-password`,
      withCredentials: false,
      data,
      headers: {},
    });
}

export function fetchTokenUser(token) {
  return () => axios({
      method: 'GET',
      url: `${config.api.url}/authentication/user/${token}`,
      withCredentials: false,
      headers: {},
    });
}

export function resetPassword(userId, data) {
  return () => axios({
      method: 'PUT',
      url: `${config.api.url}/authentication/user/${userId}/reset-password`,
      withCredentials: false,
      data,
      headers: {},
    });
}
