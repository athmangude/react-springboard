import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";

import SignIn from "Modules/voc/containers/Authentication/SignIn/Loadable";
import Registration from "Modules/voc/containers/Authentication/Registration/Loadable";
import ForgotPassword from "Modules/voc/containers/Authentication/ForgotPassword/Loadable";
import ResetPassword from "Modules/voc/containers/Authentication/ResetPassword/Loadable";
import Feed from "Modules/voc/containers/Home/Loadable";
import Conversations from "Modules/voc/containers/Conversations/Loadable";
import NewSurvey from "Modules/voc/containers/Conversations/NewSurvey/Loadable";
import EditSurvey from "Modules/voc/containers/Conversations/EditSurvey/Loadable";
import AODReport from "Modules/voc/containers/Reports/AOD/Loadable";
import CSReport from "Modules/voc/containers/Reports/CS/Loadable";
// import Convo from 'Modules/voc/containers/Convo/Loadable';
import CustomerAnalyticsLanding from "Modules/analytics/containers/Loadable";
import Loyalty from "Modules/analytics/containers/Loyalty";
import Spend from "Modules/analytics/containers/Spend";
import Demographic from "Modules/analytics/containers/Demographic";
import Behaviour from "Modules/analytics/containers/Behaviour";
import Customers from "Modules/customers/containers/Customers";
import ViewCustomer from "Modules/customers/containers/Customers/ViewCustomerAlternate";
import CustomerSegments from "Modules/customers/containers/Segments";
import ViewSegment from "Modules/customers/containers/Segments/ViewSegment";
import Audiences from "Modules/voc/containers/Settings/Audiences/Loadable";
import WebhookEvents from "Modules/voc/containers/Settings/WebhookEvents/Loadable";
import DNDLists from "Modules/voc/containers/Settings/DND/Loadable";
import BusinessNumbers from "Modules/voc/containers/Settings/BusinessNumbers/Loadable";
import TouchPoints from "Modules/voc/containers/Settings/TouchPoints/Loadable";
import Me from "Modules/voc/containers/Settings/Me/Loadable";
import Subscriptions from "Modules/voc/containers/Settings/Subscriptions/Loadable";
import Collaborators from "Modules/voc/containers/Settings/Collaborators/Loadable";
import NPSDimensions from "Modules/voc/containers/Settings/Account/NPSDimensions/Loadable";
import Payments from "Modules/voc/containers/Settings/Payments/Loadable";
import IncentivesUsage from "Modules/voc/containers/Settings/IncentivesUsage/Loadable";
import Delays from "Modules/voc/containers/Settings/Delays";
import ActivityLog from "Modules/voc/containers/ActivityLog";
import Reminders from "Modules/voc/containers/Settings/Reminders";
import Reinvites from "Modules/voc/containers/Settings/Reinvites";
import WifiAuthentication from "Modules/voc/containers/WifiAuthentication";

// Admin UI components
import Accounts from 'Modules/administration/containers/Accounts/Loadable";
import Account from 'Modules/administration/containers/Accounts/Account/Loadable";
import AdminSignIn from 'Modules/administration/containers/Authentication/SignIn/Loadable";
import AdministrationForgotPassword from 'Modules/administration/containers/Authentication/ForgotPassword/Loadable";
import AdministrationResetPassword from 'Modules/administration/containers/Authentication/ResetPassword/Loadable";
import IndustryThemes from 'Modules/administration/containers/IndustryThemes/Loadable";
import Metrics from 'Modules/administration/containers/Metrics/Loadable";
import Telcos from 'Modules/administration/containers/Telcos/Loadable";
import ParticipantHistory from 'Modules/administration/containers/ParticipantHistory/Loadable";
import NotFoundPage from "Modules/voc/containers/NotFoundPage/Loadable";

// General utility components
import "semantic-ui-css/semantic.css";
import ReactGA from "react-ga";
import mixpanel from "mixpanel-browser";
import "Modules/voc/containers/App/index.css";

// // import run and initialize amplitiude tracker
import amplitudeTracker from "Utils/trackers/amplitude";
amplitudeTracker();
window.amplitude.getInstance().init("35b2070f5fb36d5a0c1ddd94bcd55d9e");

ReactGA.initialize("UA-119798927-1");
mixpanel.init("63e080a7a844910225211ccc2964ee5f");

import MainLayout from "Layouts/main";

export default class AppRoutes extends Component {
  render() {
    return (
      <MainLayout>
        <Helmet
          titleTemplate="%s - Spring Board"
          defaultTitle="Spring Board – The Integrated Customer Experience Platform"
        >
          <meta
            name="description"
            content="Spring Board – The Integrated Customer Experience Platform"
          />
        </Helmet>
        <Switch>
          <Route exact path="/" component={Feed} />
          <Route exact path="/sign-in" component={SignIn} />
          <Route
            exact
            path="/complete-registration/:token"
            component={Registration}
          />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route
            exact
            path="/reset-password/:token"
            component={ResetPassword}
          />
          <Route exact path="/surveys" component={Conversations} />
          <Route exact path="/surveys/new" component={NewSurvey} />
          <Route exact path="/surveys/:id/edit" component={EditSurvey} />
          <Route exact path="/surveys/:type" component={Conversations} />
          <Route exact path="/surveys/:id/report/aod" component={AODReport} />
          <Route exact path="/surveys/:id/report/basic" component={AODReport} />
          <Route exact path="/surveys/:id/report/cs" component={CSReport} />
          <Route
            exact
            path="/surveys/shared-link/:id/report/cs"
            component={CSReport}
          />
          <Route
            exact
            path="/surveys/shared-link/:id/report/aod"
            component={AODReport}
          />
          <Route
            exact
            path="/surveys/shared-link/:id/report/basic"
            component={AODReport}
          />
          <Route exact path="/analytics" component={CustomerAnalyticsLanding} />
          <Route exact path="/customers" component={Customers} />
          <Route exact path="/customers/list" component={Customers} />
          <Route
            exact
            path="/customers/segments"
            component={CustomerSegments}
          />
          <Route exact path="/customers/:id/view" component={ViewCustomer} />
          <Route exact path="/segment/:id" component={ViewSegment} />

          <Route exact path="/analytics/spend" component={Spend} />
          <Route exact path="/analytics/demographic" component={Demographic} />
          <Route exact path="/analytics/behaviour" component={Behaviour} />
          <Route
            exact
            path="/analytics/loyalty-satisfaction"
            component={Loyalty}
          />
          <Route exact path="/settings" component={Audiences} />
          <Route exact path="/settings/me" component={Me} />
          <Route
            exact
            path="/settings/subscriptions"
            component={Subscriptions}
          />
          <Route exact path="/settings/audiences" component={Audiences} />
          <Route
            exact
            path="/settings/business-numbers"
            component={BusinessNumbers}
          />
          <Route exact path="/settings/touch-points" component={TouchPoints} />
          <Route exact path="/settings/dnd-lists" component={DNDLists} />
          <Route exact path="/settings/account" component={NPSDimensions} />
          <Route
            exact
            path="/settings/account/nps-dimensions"
            component={NPSDimensions}
          />
          <Route
            exact
            path="/settings/collaborators"
            component={Collaborators}
          />
          <Route exact path="/settings/reminders" component={Reminders} />
          <Route exact path="/settings/reinvites" component={Reinvites} />
          <Route exact path="/settings/delays" component={Delays} />
          <Route
            exact
            path="/settings/web-hook-events"
            component={WebhookEvents}
          />
          <Route exact path="/settings/payments" component={Payments} />
          <Route
            exact
            path="/settings/incentives-usage"
            component={IncentivesUsage}
          />
          <Route exact path="/activity-log" component={ActivityLog} />
          <Route exact path="/administration" component={Accounts} />
          <Route exact path="/administration/accounts" component={Accounts} />
          <Route
            exact
            path="/administration/accounts/:id"
            component={Account}
          />
          <Route exact path="/administration/metrics" component={Metrics} />
          <Route
            exact
            path="/administration/industry-themes"
            component={IndustryThemes}
          />
          <Route exact path="/administration/sign-in" component={AdminSignIn} />
          <Route
            exact
            path="/wifi/authentication"
            component={WifiAuthentication}
          />
          <Route
            exact
            path="/administration/forgot-password"
            component={AdministrationForgotPassword}
          />
          <Route
            exact
            path="/administration/reset-password/:token"
            component={AdministrationResetPassword}
          />
          <Route exact path="/administration/telcos" component={Telcos} />
          <Route
            exact
            path="/administration/participant-history"
            component={ParticipantHistory}
          />
          {/* <Route exact path="/live-chat/:activeParticipantConversationId?" component={Convo} /> */}
          {/* <Route exact path="/analytics/customers/:id" component={CustomerAnalytics} /> */}
          <Route path="" component={NotFoundPage} />
        </Switch>
      </MainLayout>
    );
  }
}

// cannot GET /URL => https://tylermcginnis.com/react-router-cannot-get-url-refresh/
