import * as WifiActionTypes from './constants';

const initialState = {
  welcomeMsg: null,
  logo: null,
  backgroundImg: null,

};

const actionsMap = {
  [WifiActionTypes.SET_BUSINESS_WIFI_DETAILS](state, action) {
    return {
      ...state,
      welcomeMsg: action.businessWifiDetails.accountFeatures.wifiCustomText,
      logo: action.businessWifiDetails.logo,
      backgroundImg: action.businessWifiDetails.accountFeatures.wifiBackroundImageUrl,
    };
  },
};

export default function wifi(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
