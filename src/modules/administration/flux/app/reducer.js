import * as ItemActionTypes from './constants';

const initialState = {
  hasBeforeInstallPromptBeenFired: false,
};

const actionsMap = {
  [ItemActionTypes.SET_BEFORE_INSTALL_PROMPT_FIRE](state, { payload }) {
    return {
      ...state,
      hasBeforeInstallPromptBeenFired: payload,
    }
  }
}

export default function items(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
