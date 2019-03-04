import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import configureStore from './app/flux/configureStore';

const createdBrowserHistory = createBrowserHistory();

import Routes from './app/routes';

const initialState = {};
const store = configureStore(initialState, createdBrowserHistory);

const mountPoint = document.getElementById("app");

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={createdBrowserHistory}>
      <Routes />
    </ConnectedRouter>
  </Provider>,
  mountPoint
);

if (module.hot) {
  module.hot.accept();
}
