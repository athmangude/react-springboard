import ReactGA from 'react-ga';
import axios from 'axios';
import mixpanel from 'mixpanel-browser';

import config from 'Config';
import * as EventHandler from 'Utils/EventHandler';

import * as SignInActionTypes from './constants';

export function signIn(userdata, token) {
  return async (dispatch) => {
    const aUser = { ...userdata, 'x-account-id': userdata.accounts[0].id, token };

    let { ...gaUser } = aUser.user;
    const matchedActiveAccount = aUser.accounts.find((account) => account.id === userdata.accounts[0].id);
    gaUser = { ...gaUser, accountId: aUser['x-account-id'], accountName: matchedActiveAccount.profilename };
    mixpanel.register(gaUser);
    mixpanel.people.set(gaUser);

    ReactGA.set({ id: gaUser.id });
    mixpanel.identify(gaUser.id.toString());

    // window.amplitude.getInstance().setUserId(gaUser.id.toString());
    // window.amplitude.getInstance().setUserProperties(gaUser);

    try {
      const stringifiedUserObject = JSON.stringify(aUser);
      localStorage.setItem('user', stringifiedUserObject);
    } catch (exception) {
      console.log(exception, JSON.stringify(exception, null, '\t')); // eslint-disable-line no-console
    } finally {
      setTimeout(() => {
        dispatch({ // eslint-disable-line no-unsafe-finally
          type: SignInActionTypes.SIGN_IN,
          user: aUser,
        });
      }, 1000);
    }
  };
}

export function switchAccount(user, accountId) {
  EventHandler.trackEvent({ category: 'Authentication', action: 'switch account' });
  return async (dispatch) => {
    const aUser = { ...user, 'x-account-id': accountId };

    let { ...gaUser } = aUser.user;
    const matchedActiveAccount = aUser.accounts.find((account) => account.id === accountId);
    gaUser = { ...gaUser, accountId: aUser['x-account-id'], accountName: matchedActiveAccount.profilename };
    mixpanel.register(gaUser);
    mixpanel.people.set(gaUser);

    ReactGA.set({ id: gaUser.id });
    mixpanel.identify(gaUser.id.toString());

    try {
      const stringifiedUserObject = JSON.stringify(aUser);
      localStorage.setItem('user', stringifiedUserObject);
    } catch (exception) {
      console.log(exception, JSON.stringify(exception, null, '\t')); // eslint-disable-line no-console
    } finally {
      setTimeout(() => {
        dispatch({
          type: SignInActionTypes.SIGN_IN,
          user: aUser,
        });
      }, 1000);
    }

    setTimeout(() => {
      window.location.replace('/');
    }, 1000);
  };
}

export function signOut() {
  EventHandler.trackEvent({ category: 'Authentication', action: 'sign out' });
  localStorage.setItem('user', null);
  return {
    type: SignInActionTypes.SIGN_OUT,
  };
}

export function register(details) {
  return async () => axios({
    method: 'POST',
    url: `${config.api.url}/users`,
    data: details,
    withCredentials: false,
    headers: {
      // 'x-account-id': 3,
      // authorization: `Bearer ${user.token}`,
    },
  });
}

export function createCollaborator(accountId, collaborator) {
  return () => axios({
    method: 'POST',
    url: `${config.api.url}/accounts/${accountId}/users/new`,
    withCredentials: false,
    data: collaborator,
    headers: {
      // 'x-account-id': user['x-account-id'],
      // authorization: `Bearer ${user.token}`,
    },
  });
}

export function updateUser(me) {
  return {
    type: SignInActionTypes.UPDATE_USER,
    user: me,
  };
}

export function updateSubscriptions(subscriptions) {
  return {
    type: SignInActionTypes.UPDATE_SUBSCRIPTIONS,
    subscriptions,
  };
}

export function updateUserDetails(me) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/users/${me.id}`,
      withCredentials: false,
      data: me,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function forgotPassword(data) {
  return () => axios({
    method: 'POST',
    url: `${config.api.url}/authentication/user/forgot-password`,
    withCredentials: false,
    data,
    headers: {
      // 'x-account-id': user['x-account-id'],
      // authorization: `Bearer ${user.token}`,
    },
  });
}

export function fetchTokenUser(token) {
  return () => axios({
    method: 'GET',
    url: `${config.api.url}/authentication/user/${token}`,
    withCredentials: false,
    headers: {
      // 'x-account-id': user['x-account-id'],
      // authorization: `Bearer ${user.token}`,
    },
  });
}

export function fetchNewTokenUser(token) {
  return () => axios({
    method: 'GET',
    url: `${config.api.url}/authentication/user/new/${token}`,
    withCredentials: false,
    headers: {
      // 'x-account-id': user['x-account-id'],
      // authorization: `Bearer ${user.token}`,
    },
  });
}

export function resetPassword(userId, data) {
  return () => axios({
    method: 'PUT',
    url: `${config.api.url}/authentication/user/${userId}/reset-password`,
    withCredentials: false,
    data,
    headers: {
      // 'x-account-id': user['x-account-id'],
      // authorization: `Bearer ${user.token}`,
    },
  });
}
