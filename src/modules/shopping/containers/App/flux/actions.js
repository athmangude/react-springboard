import * as HomeActions from 'Modules/shopping/containers/Home/flux/actions';
import * as AppActionTypes from './constants';

export function setRouteTitle(title) {
  return {
    type: AppActionTypes.SET_ROUTE_TITLE,
    title,
  };
}

export function unsetRouteTitle() {
  return {
    type: AppActionTypes.UNSET_ROUTE_TITLE,
  };
}

export function setAppName(appName) {
  return {
    type: AppActionTypes.SET_APP_NAME,
    appName,
  };
}

export function clearStores() {
  return (dispatch) => {
    dispatch(HomeActions.clearFeed());
  };
}

export function setBeforeInstallPromptFire(state) {
  return {
    type: AppActionTypes.SET_BEFORE_INSTALL_PROMPT_FIRE,
    payload: state,
  }
}
