import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Admin UI components
import Home from 'Modules/agent/containers/Home/Loadable';
import NotFoundPage from 'Modules/main/containers/NotFoundPage/Loadable';

// General utility components
import 'semantic-ui-css/semantic.css';
import ReactGA from 'react-ga';
import mixpanel from 'mixpanel-browser';

// // import run and initialize amplitiude tracker
// import amplitudeTracker from 'Utils/trackers/amplitude';
// amplitudeTracker();
// window.amplitude.getInstance().init('[AMPLITUDE_KEY_GOES_HERE]');

import MainLayout from 'Layouts/main';


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
          <Route path="" component={NotFoundPage} />
        </Switch>
      </MainLayout>
    );
  }
}

// cannot GET /URL => https://tylermcginnis.com/react-router-cannot-get-url-refresh/
