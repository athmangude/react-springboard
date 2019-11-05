import axios from 'axios';

import * as PaymentActionTypes from './constants';
import config from 'Config';

export function setPayments(payments) {
  return {
    type: PaymentActionTypes.SET_PAYMENTS,
    payments,
  };
}

export function createPayment(payment) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'POST',
      url: `${config.api.url}/accounts/${user['x-account-id']}/payments`,
      withCredentials: false,
      data: payment,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchPayments() {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/accounts/${user['x-account-id']}/payments`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchPaymentSubscriptions() {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/accounts/${user['x-account-id']}/payments/subscriptions`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
