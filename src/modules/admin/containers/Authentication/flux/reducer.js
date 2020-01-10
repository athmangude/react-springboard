import * as AdminAuthenticationActionTypes from './constants';

function getLoggedInAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem('admin'));
    return user;
  } catch (exception) {
    return null;
  }
}

const initialState = {
  admin: getLoggedInAdmin(),
};

const actionsMap = {
  [AdminAuthenticationActionTypes.ADMIN_SIGN_IN](state, action) {
    return {
      ...state, admin: action.admin,
    };
  },
  [AdminAuthenticationActionTypes.ADMIN_SIGN_OUT](state) {
    return { ...state, admin: null };
  },
};

export default function adminAuthentication(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
