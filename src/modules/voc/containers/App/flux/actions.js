import * as AppActionTypes from './constants';
import * as HomeActions from 'Modules/voc/containers/Home/flux/actions';
import * as LiveChartActions from '../../Convo/flux/actions';
import * as CSReportActions from '../../Reports/CS/flux/actions';
import * as AODReportActions from '../../Reports/AOD/flux/actions';

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
    dispatch(LiveChartActions.unMount());
    dispatch(CSReportActions.clearCSReports());
    dispatch(AODReportActions.clearAODReports());
  };
}

export function setBeforeInstallPromptFire(state) {
  return {
    type: AppActionTypes.SET_BEFORE_INSTALL_PROMPT_FIRE,
    payload: state,
  }
}
