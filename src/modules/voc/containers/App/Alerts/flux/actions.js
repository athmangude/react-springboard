import uuid from 'uuid/v1';
import moment from 'moment';

import * as AlertActionTypes from './constants';

export function addAlert(message) {
  const { type } = message;
  const alertObject = {
    ...message,
    id: uuid,
    type: type || 'info',
    timestamp: moment().format('x'),
  };

  const messagePayload = {
    type: AlertActionTypes.ADD_ALERT,
    payload: alertObject,
  };

  return messagePayload;
}

export function removeAlert(id) {
  return {
    type: AlertActionTypes.REMOVE_ALERT,
    id,
  };
}
