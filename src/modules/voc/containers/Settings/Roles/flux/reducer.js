import * as RoleActionTypes from './constants';

const initialState = {
  items: [],
  loggedInUserRole: null,
};

const actionsMap = {
  [RoleActionTypes.ADD_ROLES](state, action) {
    return { ...state, items: action.roles };
  },
  [RoleActionTypes.SET_LOGGED_IN_USER_ROLE](state, action) {
    return { ...state, loggedInUserRole: action.loggedInUserRole };
  },
};

export default function roles(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
