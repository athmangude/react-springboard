import React, { Component } from 'react';

import { Router, Route, Switch } from 'react-router-dom';

import MainLayout from './layouts/main';
import Landing from './containers/Landing';
import Settings from './containers/Settings';
import NotFound from './containers/NotFound';


export default class AppRoutes extends Component {
  render() {
    return (
        <MainLayout>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </MainLayout>
    );
  }
}

// cannot GET /URL => https://tylermcginnis.com/react-router-cannot-get-url-refresh/
