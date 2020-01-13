import * as ItemActionTypes from './constants';

const initialState = {
  hasBeforeInstallPromptBeenFired: false,
  routeTitle: null,
};

const actionsMap = {
  [ItemActionTypes.SET_BEFORE_INSTALL_PROMPT_FIRE](state, { payload }) {
    return {
      ...state,
      hasBeforeInstallPromptBeenFired: payload,
    }
  },
  [ItemsActionTypes.SET_ROUTE_TITLE](state, { payload }) {
    return {
      ...state,
      routeTitle: payload,
    },
  },
}

export default function items(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}