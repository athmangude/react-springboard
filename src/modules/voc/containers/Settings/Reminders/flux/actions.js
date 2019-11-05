import axios from 'axios';

import config from 'Config';

export function addSurveyReminder(surveyId, options) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    return axios({
      method: 'POST',
      url: `${config.api.url}/surveys/${surveyId}/reminders`,
      withCredentials: false,
      data: options,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function updateSurveyReminder(surveyId, options) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/surveys/${surveyId}/reminders`,
      withCredentials: false,
      data: options,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function deleteSurveyReminder(surveyId) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    return axios({
      method: 'DELETE',
      url: `${config.api.url}/surveys/${surveyId}/reminders`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
