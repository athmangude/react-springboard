import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { LOCATION_CHANGE } from "react-router-redux";
import ReactGA from "react-ga";

// import itemsReducer from 'Modules/voc/flux/items/reducer';
// import appReducer from 'Modules/voc/flux/app/reducer';

import globalReducer from "Modules/voc/containers/App/reducer";
import languageProviderReducer from "Modules/voc/containers/LanguageProvider/reducer";
import homeReducer from "Modules/voc/containers/Home/flux/reducer";
import authenticationReducer from "Modules/voc/containers/Authentication/flux/reducer";
import conversationsReducer from "Modules/voc/containers/Conversations/flux/reducer";
// import audiencesReducer from 'Modules/voc/containers/Audiences/flux/reducer';
import audiencesReducer from "Modules/voc/containers/Settings/Audiences/flux/reducer";
import aodReducer from "Modules/voc/containers/Reports/AOD/flux/reducer";
import convoReducer from "Modules/voc/containers/Convo/flux/reducer";
import collaboratorsReducer from "Modules/voc/containers/Settings/Collaborators/flux/reducer";
import rolesReducer from "Modules/voc/containers/Settings/Roles/flux/reducer";
import webhookEventTypesReducer from "Modules/voc/containers/Settings/WebhookEventTypes/flux/reducer";
import webhookEventsReducer from "Modules/voc/containers/Settings/WebhookEvents/flux/reducer";
import businessNumberReducer from "Modules/voc/containers/Settings/BusinessNumbers/flux/reducer";
import touchPointReducer from "Modules/voc/containers/Settings/TouchPoints/flux/reducer";
import dndReducer from "Modules/voc/containers/Settings/DND/flux/reducer";
import paymentReducer from "Modules/voc/containers/Settings/Payments/flux/reducer";
import paymentTypeReducer from "Modules/voc/containers/Settings/PaymentTypes/flux/reducer";
import wifiReducer from "Modules/voc/containers/WifiAuthentication/flux/reducer";
import alertsReducer from "Modules/voc/containers/App/Alerts/flux/reducer";
import activityLogsReducer from "Modules/voc/containers/ActivityLog/flux/reducer";
import configurationsReducer from "Modules/voc/containers/Configurations/flux/reducer";
import customerAnalyticssReducer from "Modules/analytics/containers/flux/reducer";
import accountReducer from "Modules/voc/containers/Settings/Account/flux/reducer";
import appReducer from "Modules/voc/containers/App/flux/reducer";

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
    audiences: audiencesReducer,
    conversations: conversationsReducer,
    aodReport: aodReducer,
    collaborators: collaboratorsReducer,
    roles: rolesReducer,
    webhookEventTypes: webhookEventTypesReducer,
    webhookEvents: webhookEventsReducer,
    businessNumbers: businessNumberReducer,
    touchpoints: touchPointReducer,
    dndlists: dndReducer,
    convo: convoReducer,
    alerts: alertsReducer,
    activityLogs: activityLogsReducer,
    configurations: configurationsReducer,
    account: accountReducer,
    paymentTypes: paymentTypeReducer,
    payments: paymentReducer,
    customerAnalytics: customerAnalyticssReducer,
    wifi: wifiReducer
  });
}
