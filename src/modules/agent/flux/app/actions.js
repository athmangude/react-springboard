import * as AppActionTypes from './constants';

export function setBeforeInstallPromptFire(state) {
  return {
    type: AppActionTypes.SET_BEFORE_INSTALL_PROMPT_FIRE,
    payload: state,
  };
};

export function setRouteTitle(routeTitle) {
  return {
    type: AppActionTypes.SET_ROUTE_TITLE,
    payload: routeTitle,
  };
};
