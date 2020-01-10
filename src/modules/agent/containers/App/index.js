/* eslint-disable jsx-a11y/href-no-hash */
/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import SignIn from 'containers/Authentication/SignIn/Loadable';
import Registration from 'containers/Authentication/Registration/Loadable';
import ForgotPassword from 'containers/Authentication/ForgotPassword/Loadable';
import ResetPassword from 'containers/Authentication/ResetPassword/Loadable';
import Feed from 'containers/Home/Loadable';
import Conversations from 'containers/Conversations/Loadable';
import NewSurvey from 'containers/Conversations/NewSurvey/Loadable';
import EditSurvey from 'containers/Conversations/EditSurvey/Loadable';
import AODReport from 'containers/Reports/AOD/Loadable';
import CSReport from 'containers/Reports/CS/Loadable';
// import Convo from 'containers/Convo/Loadable';
import CustomerAnalyticsLanding from 'containers/CustomerAnalytics/Loadable';
import Loyalty from 'containers/CustomerAnalytics/Loyalty';
import Spend from 'containers/CustomerAnalytics/Spend';
import Demographic from 'containers/CustomerAnalytics/Demographic';
import Behaviour from 'containers/CustomerAnalytics/Behaviour';
import Customers from 'containers/CustomerSegmentation/Customers';
import ViewCustomer from 'containers/CustomerSegmentation/Customers/ViewCustomerAlternate';
import CustomerSegments from 'containers/CustomerSegmentation/Segments';
import ViewSegment from 'containers/CustomerSegmentation/Segments/ViewSegment';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Audiences from 'containers/Settings/Audiences/Loadable';
import WebhookEvents from 'containers/Settings/WebhookEvents/Loadable';
import DNDLists from 'containers/Settings/DND/Loadable';
import BusinessNumbers from 'containers/Settings/BusinessNumbers/Loadable';
import TouchPoints from 'containers/Settings/TouchPoints/Loadable';
import Me from 'containers/Settings/Me/Loadable';
import Subscriptions from 'containers/Settings/Subscriptions/Loadable';
import Collaborators from 'containers/Settings/Collaborators/Loadable';
import NPSDimensions from 'containers/Settings/Account/NPSDimensions/Loadable';
import Payments from 'containers/Settings/Payments/Loadable';
import IncentivesUsage from 'containers/Settings/IncentivesUsage/Loadable';
import Delays from 'containers/Settings/Delays';
import ActivityLog from 'containers/ActivityLog';
import Reminders from 'containers/Settings/Reminders';
import Reinvites from 'containers/Settings/Reinvites';
import WifiAuthentication from 'containers/WifiAuthentication';

// Admin UI components
import Accounts from 'containers/Administration/Accounts/Loadable';
import Account from 'containers/Administration/Accounts/Account/Loadable';
import AdminSignIn from 'containers/Administration/Authentication/SignIn/Loadable';
import AdministrationForgotPassword from 'containers/Administration/Authentication/ForgotPassword/Loadable';
import AdministrationResetPassword from 'containers/Administration/Authentication/ResetPassword/Loadable';
import IndustryThemes from 'containers/Administration/IndustryThemes/Loadable';
import Metrics from 'containers/Administration/Metrics/Loadable';
import Telcos from 'containers/Administration/Telcos/Loadable';
import ParticipantHistory from 'containers/Administration/ParticipantHistory/Loadable';

// General utility components
import 'semantic-ui-css/semantic.css';
import ReactGA from 'react-ga';
import mixpanel from 'mixpanel-browser';
import './index.css';

// // import run and initialize amplitiude tracker
// import amplitudeTracker from 'Utils/trackers/amplitude';
// amplitudeTracker();
// window.amplitude.getInstance().init('35b2070f5fb36d5a0c1ddd94bcd55d9e');

ReactGA.initialize('UA-119798927-1');
mixpanel.init('63e080a7a844910225211ccc2964ee5f');

export default function App() {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 1920, backgroundColor: '#FFF',
      }}
    >
      <Helmet
        titleTemplate="%s - Spring Board"
        defaultTitle="Spring Board"
      >
        <meta name="description" content="Spring Board – Build something awesome" />
      </Helmet>
      <Switch>
        <Route exact path="/" component={Feed} />
        <Route exact path="/sign-in" component={SignIn} />
        <Route exact path="/complete-registration/:token" component={Registration} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/reset-password/:token" component={ResetPassword} />
        <Route exact path="/surveys" component={Conversations} />
        <Route exact path="/surveys/new" component={NewSurvey} />
        <Route exact path="/surveys/:id/edit" component={EditSurvey} />
        <Route exact path="/surveys/:type" component={Conversations} />
        <Route exact path="/surveys/:id/report/aod" component={AODReport} />
        <Route exact path="/surveys/:id/report/basic" component={AODReport} />
        <Route exact path="/surveys/:id/report/cs" component={CSReport} />
        <Route exact path="/surveys/shared-link/:id/report/cs" component={CSReport} />
        <Route exact path="/surveys/shared-link/:id/report/aod" component={AODReport} />
        <Route exact path="/surveys/shared-link/:id/report/basic" component={AODReport} />
        {/* <Route exact path="/live-chat/:activeParticipantConversationId?" component={Convo} /> */}
        <Route exact path="/analytics" component={CustomerAnalyticsLanding} />
        <Route exact path="/customers" component={Customers} />
        <Route exact path="/customers/list" component={Customers} />
        <Route exact path="/customers/segments" component={CustomerSegments} />
        <Route exact path="/customers/:id/view" component={ViewCustomer} />
        <Route exact path="/segment/:id" component={ViewSegment} />
        {/* <Route exact path="/analytics/customers/:id" component={CustomerAnalytics} /> */}
        <Route exact path="/analytics/spend" component={Spend} />
        <Route exact path="/analytics/demographic" component={Demographic} />
        <Route exact path="/analytics/behaviour" component={Behaviour} />
        <Route exact path="/analytics/loyalty-satisfaction" component={Loyalty} />
        <Route exact path="/settings" component={Audiences} />
        <Route exact path="/settings/me" component={Me} />
        <Route exact path="/settings/subscriptions" component={Subscriptions} />
        <Route exact path="/settings/audiences" component={Audiences} />
        <Route exact path="/settings/business-numbers" component={BusinessNumbers} />
        <Route exact path="/settings/touch-points" component={TouchPoints} />
        <Route exact path="/settings/dnd-lists" component={DNDLists} />
        <Route exact path="/settings/account" component={NPSDimensions} />
        <Route exact path="/settings/account/nps-dimensions" component={NPSDimensions} />
        <Route exact path="/settings/collaborators" component={Collaborators} />
        <Route exact path="/settings/reminders" component={Reminders} />
        <Route exact path="/settings/reinvites" component={Reinvites} />
        <Route exact path="/settings/delays" component={Delays} />
        <Route exact path="/settings/web-hook-events" component={WebhookEvents} />
        <Route exact path="/settings/payments" component={Payments} />
        <Route exact path="/settings/incentives-usage" component={IncentivesUsage} />
        <Route exact path="/activity-log" component={ActivityLog} />
        <Route exact path="/administration" component={Accounts} />
        <Route exact path="/administration/accounts" component={Accounts} />
        <Route exact path="/administration/accounts/:id" component={Account} />
        <Route exact path="/administration/metrics" component={Metrics} />
        <Route exact path="/administration/industry-themes" component={IndustryThemes} />
        <Route exact path="/administration/sign-in" component={AdminSignIn} />
        <Route exact path="/wifi/authentication" component={WifiAuthentication} />
        <Route exact path="/administration/forgot-password" component={AdministrationForgotPassword} />
        <Route exact path="/administration/reset-password/:token" component={AdministrationResetPassword} />
        <Route exact path="/administration/telcos" component={Telcos} />
        <Route exact path="/administration/participant-history" component={ParticipantHistory} />
        <Route path="" component={NotFoundPage} />
      </Switch>
    </div>
  );
}
