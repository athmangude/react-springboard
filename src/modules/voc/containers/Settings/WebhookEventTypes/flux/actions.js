import axios from 'axios';

import * as WebhookEventTypeActionTypes from './constants';
import config from 'Config';

export function setWebhookEventTypes(webhookEventTypes) {
  return {
    type: WebhookEventTypeActionTypes.SET_WEB_HOOK_EVENT_TYPES,
    webhookEventTypes,
  };
}

export function fetchWebhookEventTypes() {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/web-hook-event-types`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
