import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";

import Home from "Modules/main/containers/Home/Loadable";
import Audiences from "Modules/main/containers/Settings/Audiences/Loadable";
import NotFoundPage from "Modules/main/containers/NotFoundPage/Loadable";
import SignIn from 'Modules/main/containers/Authentication/SignIn';
import NewQuestionnaire from 'Modules/main/containers/Questionnaires/NewQuestionnaire';
import ProtectedRoute from 'Utils/ProtectedRoute';
import DisprotectedRoute from 'Utils/DisprotectedRoute';

// General utility components
import "semantic-ui-css/semantic.css";
import ReactGA from "react-ga";
import mixpanel from "mixpanel-browser";
import "Modules/main/containers/App/index.css";

// // import run and initialize amplitiude tracker
// import amplitudeTracker from "Utils/trackers/amplitude";
// amplitudeTracker();
// window.amplitude.getInstance().init("35b2070f5fb36d5a0c1ddd94bcd55d9e");

import MainLayout from "Layouts/main";


ReactGA.initialize("UA-119798927-1");
mixpanel.init("63e080a7a844910225211ccc2964ee5f");

export default class AppRoutes extends Component {
  render() {
    return (
      <MainLayout>
        <Helmet
          titleTemplate="%s - SpringBoard"
          defaultTitle="SpringBoard – Build something awesome"
        >
          <meta
            name="description"
            content="SpringBoard – Build something awesome"
          />
        </Helmet>
        <Switch>
          <ProtectedRoute exact path="/" component={Home} />
          <Route exact path="/questionnaires/new" component={NewQuestionnaire} />
          <DisprotectedRoute exact path="/sign-in" component={SignIn} />
          <Route path="" component={NotFoundPage} />
        </Switch>
      </MainLayout>
    );
  }
}

// cannot GET /URL => https://tylermcginnis.com/react-router-cannot-get-url-refresh/
