import * as AppActionTypes from './constants';

export function setBeforeInstallPromptFire(state) {
  return {
    type: AppActionTypes.SET_BEFORE_INSTALL_PROMPT_FIRE,
    payload: state,
  }
}
