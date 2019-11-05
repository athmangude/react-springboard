import axios from 'axios';

import config from 'Config';

export function fetchParticipantHistory(commId) {
  return (dispatch, getState) => {
    const { admin } = getState().adminAuthentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/participant/history/?commId=${commId}`,
      withCredentials: false,
      headers: {
        authorization: `Bearer ${admin.token}`,
      },
    });
  };
}
