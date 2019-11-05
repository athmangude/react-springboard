import axios from 'axios';

import config from 'Config';

export function triggerSurveyReinvite(surveyId, options) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    return axios({
      method: 'POST',
      url: `${config.api.url}/surveys/reinvites`,
      withCredentials: false,
      data: options,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
