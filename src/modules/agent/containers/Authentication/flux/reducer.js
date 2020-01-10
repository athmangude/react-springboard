import * as SignInActionTypes from './constants';

function getLoggedInUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  } catch (exception) {
    return null;
  }
}

const initialState = {
  user: getLoggedInUser(),
};

const actionsMap = {
  [SignInActionTypes.SIGN_IN](state, action) {
    return {
      ...state, user: action.user,
    };
  },
  [SignInActionTypes.SIGN_OUT](state) {
    return { ...state, user: null };
  },
  [SignInActionTypes.UPDATE_USER](state, action) {
    const camelCasedUser = {};
    Object.keys(action.user).forEach((key) => {
      const camelCasedKey = key.replace(/(_\w)/g, (m) => m[1].toUpperCase());
      camelCasedUser[camelCasedKey] = action.user[key];
    });

    const user = JSON.parse(localStorage.getItem('user'));
    user.user = camelCasedUser;
    localStorage.setItem('user', JSON.stringify(user));

    return { ...state, user: { ...state.user, user: camelCasedUser }};;
  },
  [SignInActionTypes.UPDATE_SUBSCRIPTIONS](state, action) {
    const user = JSON.parse(localStorage.getItem('user'));
    const userWithUpdatedSubscriptions = { ...user, user: { ...user.user, subscriptions: action.subscriptions }};
    localStorage.setItem('user', JSON.stringify(userWithUpdatedSubscriptions));
    return { ...state, user: { ...state.user, user: { ...state.user.user, subscriptions: action.subscriptions} }};
  },
};

export default function authentication(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
