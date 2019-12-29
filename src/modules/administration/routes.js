import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Admin UI components
import Home from 'Modules/administration/containers/Home/Loadable';
import AdminSignIn from 'Modules/administration/containers/Authentication/SignIn/Loadable';
import AdministrationForgotPassword from 'Modules/administration/containers/Authentication/ForgotPassword/Loadable';
import AdministrationResetPassword from 'Modules/administration/containers/Authentication/ResetPassword/Loadable';
import NotFoundPage from 'Modules/main/containers/NotFoundPage/Loadable';

// General utility components
import 'semantic-ui-css/semantic.css';
import ReactGA from 'react-ga';
import mixpanel from 'mixpanel-browser';
import 'Modules/main/containers/App/index.css';

// // import run and initialize amplitiude tracker
import amplitudeTracker from 'Utils/trackers/amplitude';

import MainLayout from 'Layouts/main';

amplitudeTracker();
window.amplitude.getInstance().init('[AMPLITUDE_KEY_GOES_HERE]');

ReactGA.initialize('[GOOGLE_ANALYTICS_KEY_GOES_HERE]');
mixpanel.init('[MIXPANEL_KEY_GOES_HERE]');

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
          <Route exact path="/" component={Home} />
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
          <Route path="" component={NotFoundPage} />
        </Switch>
      </MainLayout>
    );
  }
}

// cannot GET /URL => https://tylermcginnis.com/react-router-cannot-get-url-refresh/
