import * as ConfigurationActionTypes from './constants';

const initialState = {
  features: {
    lnm: false,
    aod: false,
    voc: false,
    optin: false,
    surveyIncentives: false,
    convo: false,
    consumerWallet: false,
    surveyReminder: false,
    surveyReinvite: false,
    msurveyEndMessage: false,
    createDate: null,
    lastUpdate: null,
    customEndMessage: null,
    customerAnalytics: null,
    socialMedia: null,
  },
  loading: false,
  fetchedConfigs: false,
  errorLoadingConfigs: false,
  demoMode: false,
  // convo: false,
  // AOD: true,
  // CS: true,
  // BASIC: true,
};

const actionsMap = {
  [ConfigurationActionTypes.SET_ACCOUNT_CONFIGURATIONS](state, action) {
    return {
      ...state, features: action.configurations, fetchedConfigs: true,
    };
  },
  [ConfigurationActionTypes.UPDATE_IS_FETCHING_CONFIGURATIONS_STATUS](state, action) {
    return {
      ...state, loading: action.status,
    };
  },
  [ConfigurationActionTypes.UPDATE_FETCH_CONFIGURATION_ERROR_STATUS](state, action) {
    return {
      ...state, errorLoadingConfigs: action.status, fetchedConfigs: true,
    };
  },
  [ConfigurationActionTypes.UPDATE_DEMO_MODE](state, action) {
    return {
      ...state, demoMode: action.demoMode,
    };
  },
};

export default function configurations(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
