import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { LOCATION_CHANGE } from "react-router-redux";
import ReactGA from "react-ga";

// import itemsReducer from 'Modules/shopping/flux/items/reducer';
// import appReducer from 'Modules/shopping/flux/app/reducer';

import globalReducer from "Modules/shopping/containers/App/reducer";
import languageProviderReducer from "Modules/shopping/containers/LanguageProvider/reducer";
import appReducer from "Modules/shopping/containers/App/flux/reducer";
import alertsReducer from "Modules/shopping/containers/App/Alerts/flux/reducer";

/**
 * Admin Reducers will come here
 */
import adminAuthenticationReducer from "Modules/administration/containers/Authentication/flux/reducer";
import accountsReducer from "Modules/administration/containers/Accounts/flux/reducer";

// Initial routing state
const routeInitialState = {
  location: null
};

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      ReactGA.pageview(`${action.payload.pathname}${action.payload.search}`);
      return { ...state, location: action.payload };
    default:
      return state;
  }
}

export default function createReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    route: routeReducer,
    global: globalReducer,
    language: languageProviderReducer,
    accounts: accountsReducer,
    alerts: alertsReducer,
    app: appReducer,
    adminAuthentication: adminAuthenticationReducer
  });
}
