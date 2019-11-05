import axios from 'axios';

import config from 'Config';

export function addSurveyMetadata(surveyId, metadata) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    return axios({
      method: 'POST',
      url: `${config.api.url}/surveys/${surveyId}/metadata`,
      withCredentials: false,
      data: metadata,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function updateSurveyMetadata(surveyId, metadata) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/surveys/${surveyId}/metadata`,
      withCredentials: false,
      data: metadata,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
