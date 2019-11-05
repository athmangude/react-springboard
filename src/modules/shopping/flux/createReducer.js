import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { LOCATION_CHANGE } from 'react-router-redux';
import ReactGA from 'react-ga';

// import itemsReducer from 'Modules/shopping/flux/items/reducer';
// import appReducer from 'Modules/shopping/flux/app/reducer';

import globalReducer from 'Modules/shopping/containers/App/reducer';
import languageProviderReducer from 'Modules/shopping/containers/LanguageProvider/reducer';
import homeReducer from 'Modules/shopping/containers/Home/flux/reducer';
import authenticationReducer from 'Modules/shopping/containers/Authentication/flux/reducer';
import alertsReducer from 'Modules/shopping/containers/App/Alerts/flux/reducer';
import appReducer from 'Modules/shopping/containers/App/flux/reducer';

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
