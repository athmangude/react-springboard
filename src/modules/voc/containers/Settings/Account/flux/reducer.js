/* eslint-disable jsx-a11y/href-no-hash */
import * as ActionTypes from './constants';

const initialState = {};

const actionsMap = {
  [ActionTypes.SET_ACCOUNT_DETAILS](state, action) {
    return action.account;
  },
};

export default function account(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
