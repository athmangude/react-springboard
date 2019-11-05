import * as AppActionTypes from './constants';

const initialState = {
  routeTitle: null,
  appName: '',
  hasBeforeInstallPromptBeenFired: false,
};

const actionsMap = {
  [AppActionTypes.SET_ROUTE_TITLE](state, action) {
    return {
      ...state, routeTitle: action.title,
    };
  },
  [AppActionTypes.UNSET_ROUTE_TITLE](state) {
    return {
      ...state, routeTitle: null,
    };
  },
  [AppActionTypes.SET_APP_NAME](state, action) {
    return {
      ...state, appName: action.appName,
    };
  },
  [AppActionTypes.SET_BEFORE_INSTALL_PROMPT_FIRE](state, { payload }) {
    return {
      ...state,
      hasBeforeInstallPromptBeenFired: payload,
    }
  }
};

export default function app(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) {
    return state;
  }
  return reduceFn(state, action);
}
