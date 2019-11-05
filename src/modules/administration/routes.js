import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Admin UI components
import Accounts from 'Modules/administration/containers/Accounts/Loadable';
import Account from 'Modules/administration/containers/Accounts/Account/Loadable';
import AdminSignIn from 'Modules/administration/containers/Authentication/SignIn/Loadable';
import AdministrationForgotPassword from 'Modules/administration/containers/Authentication/ForgotPassword/Loadable';
import AdministrationResetPassword from 'Modules/administration/containers/Authentication/ResetPassword/Loadable';
import IndustryThemes from 'Modules/administration/containers/IndustryThemes/Loadable';
import Metrics from 'Modules/administration/containers/Metrics/Loadable';
import Telcos from 'Modules/administration/containers/Telcos/Loadable';
import ParticipantHistory from 'Modules/administration/containers/ParticipantHistory/Loadable';
import NotFoundPage from 'Modules/voc/containers/NotFoundPage/Loadable';

// General utility components
import 'semantic-ui-css/semantic.css';
import ReactGA from 'react-ga';
import mixpanel from 'mixpanel-browser';
import 'Modules/voc/containers/App/index.css';

// // import run and initialize amplitiude tracker
import amplitudeTracker from 'Utils/trackers/amplitude';

import MainLayout from 'Layouts/main';

amplitudeTracker();
window.amplitude.getInstance().init('35b2070f5fb36d5a0c1ddd94bcd55d9e');

ReactGA.initialize('UA-119798927-1');
mixpanel.init('63e080a7a844910225211ccc2964ee5f');

export default class AppRoutes extends Component {
  render() {
    return (
      <MainLayout>
        <Helmet
          titleTemplate="%s - Spring Board"
          defaultTitle="Spring Board – Build something awesome"
        >
          <meta
            name="description"
            content="Spring Board – Build something awesome"
          />
        </Helmet>
        <Switch>
          <Route exact path="/" component={Accounts} />
          <Route exact path="/accounts" component={Accounts} />
          <Route exact path="/accounts/:id" component={Account} />
          <Route exact path="/metrics" component={Metrics} />
          <Route exact path="/industry-themes" component={IndustryThemes} />
          <Route exact path="/sign-in" component={AdminSignIn} />
          <Route
            exact
            path="/forgot-password"
            component={AdministrationForgotPassword}
          />
          <Route
            exact
            path="/reset-password/:token"
            component={AdministrationResetPassword}
          />
          <Route exact path="/telcos" component={Telcos} />
          <Route
            exact
            path="/participant-history"
            component={ParticipantHistory}
          />
          <Route path="" component={NotFoundPage} />
        </Switch>
      </MainLayout>
    );
  }
}

// cannot GET /URL => https://tylermcginnis.com/react-router-cannot-get-url-refresh/
