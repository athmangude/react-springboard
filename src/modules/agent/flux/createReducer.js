import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { LOCATION_CHANGE } from 'react-router-redux';
import ReactGA from 'react-ga';

// import itemsReducer from 'Modules/main/flux/items/reducer';
// import appReducer from 'Modules/main/flux/app/reducer';

import globalReducer from 'Modules/main/containers/App/reducer';
import languageProviderReducer from 'Modules/main/containers/LanguageProvider/reducer';
import homeReducer from 'Modules/main/containers/Home/flux/reducer';
import authenticationReducer from 'Modules/main/containers/Authentication/flux/reducer';
import alertsReducer from 'Modules/main/containers/App/Alerts/flux/reducer';
import appReducer from 'Modules/main/containers/App/flux/reducer';

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
    // app: appReducer,
    // items: itemsReducer,

    route: routeReducer,
    global: globalReducer,
    language: languageProviderReducer,
    app: appReducer,
    home: homeReducer,
    authentication: authenticationReducer,
    alerts: alertsReducer,
  });
}
