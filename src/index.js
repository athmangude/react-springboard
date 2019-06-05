import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import App from './app';

import createBrowserHistory from 'history/createBrowserHistory';
import configureStore from './app/flux/configureStore';

const createdBrowserHistory = createBrowserHistory();

const initialState = {};
const store = configureStore(initialState, createdBrowserHistory);

import * as ServiceWorkersManager from './service-workers';

const mountPoint = document.getElementById("app");

ReactDOM.render(
  <App store={store} history={createdBrowserHistory} />,
  mountPoint
);

WebFont.load({
  google: {
    families: ['Lato'],
  }
});

ServiceWorkersManager.register();

// if (module.hot) {
//   module.hot.accept();
// }

// https://scotch.io/tutorials/how-to-make-your-existing-react-app-progressive-in-10-minutes
// https://survivejs.com/webpack/building/bundle-splitting/

// chrome://flags/#enable-desktop-pwas
// chrome://flags#enable-app-banners
