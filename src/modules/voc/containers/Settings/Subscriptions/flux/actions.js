import axios from 'axios';

import config from 'Config';

export function updateSubscriptions(subscriptions) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    console.log(subscriptions);
    return axios({
      method: 'POST',
      url: `${config.api.url}/accounts/${user['x-account-id']}/users/${user.user.id}/subscriptions`,
      withCredentials: false,
      data: {
        roles: subscriptions,
      },
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
