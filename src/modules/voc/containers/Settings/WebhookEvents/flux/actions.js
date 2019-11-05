import axios from 'axios';

import * as WebhookEventActionTypes from './constants';
import config from 'Config';

export function setWebhookEvents(webhookEvents) {
  return {
    type: WebhookEventActionTypes.SET_WEB_HOOK_EVENTS,
    webhookEvents,
  };
}

export function saveWebhookEvents(body, surveyId = null) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    const url = surveyId === null ? `${config.api.url}/web-hook-events/accounts/${user['x-account-id']}` : `${config.api.url}/web-hook-events/surveys/${surveyId}`;
    return axios({
      method: 'POST',
      url,
      withCredentials: false,
      data: body,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function updateWebhook(body, surveyId = null) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    const url = surveyId === null ? `${config.api.url}/web-hook-events/accounts/${user['x-account-id']}/hooks/${body.accountHookId}` : `${config.api.url}/web-hook-events/surveys/${surveyId}/hooks/${body.surveyHookId}`;
    return axios({
      method: 'PUT',
      url,
      withCredentials: false,
      data: body,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function deleteWebhook(body, surveyId = null) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    const url = surveyId === null ? `${config.api.url}/web-hook-events/accounts/${user['x-account-id']}/hooks/${body.accountHookId}` : `${config.api.url}/web-hook-events/surveys/${surveyId}/hooks/${body.surveyHookId}`;
    return axios({
      method: 'DELETE',
      url,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}


export function fetchWebhookEvents() {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/web-hook-events`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
