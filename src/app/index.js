import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import configureStore from './flux/configureStore';
import Routes from './routes';


const createdBrowserHistory = createBrowserHistory();

const initialState = {};
const store = configureStore(initialState, createdBrowserHistory);

const mountPoint = document.getElementById("app");


const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={createdBrowserHistory}>
      <Routes />
    </ConnectedRouter>
  </Provider>
);

export default hot(App);


// https://scotch.io/tutorials/how-to-make-your-existing-react-app-progressive-in-10-minutes
// https://survivejs.com/webpack/building/bundle-splitting/

// chrome://flags/#enable-desktop-pwas
// chrome://flags#enable-app-banners
