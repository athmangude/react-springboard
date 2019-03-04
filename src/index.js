import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createBrowserHistory from 'history/createBrowserHistory';

import configureStore from './app/flux/configureStore';

const createdBrowserHistory = createBrowserHistory();

import Routes from './app/routes';

class App extends Component {
  render() {
    return (
      <Routes />
    );
  }
}

const initialState = {};
const store = configureStore(initialState, createdBrowserHistory);

const mountPoint = document.getElementById("app");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  mountPoint
);

if (module.hot) {
  module.hot.accept();
}
