import axios from 'axios';

import * as PaymentTypeActionTypes from './constants';
import config from 'Config';

export function setPaymentTypes(paymentTypes) {
  return {
    type: PaymentTypeActionTypes.SET_PAYMENT_TYPES,
    paymentTypes,
  };
}

export function fetchPaymentTypes() {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/payment-types`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
