/* eslint-disable react/forbid-prop-types */
import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import ThemeProvider from 'Utils/StyledMaterialUIThemeProvider';
import PropTypes from 'prop-types';

import themeGenerator from './theme';

import Routes from './routes';

const theme = themeGenerator();

const App = ({ store, history }) => (
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>
);

App.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default hot(App);

// https://scotch.io/tutorials/how-to-make-your-existing-react-app-progressive-in-10-minutes
// https://survivejs.com/webpack/building/bundle-splitting/

// chrome://flags/#enable-desktop-pwas
// chrome://flags#enable-app-banners
