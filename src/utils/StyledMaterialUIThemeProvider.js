/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const MyThemeProvider = ({ theme, children }) => {
  return (
    <StylesProvider injectFirst>
      <CssBaseline />
      <StyledThemeProvider theme={theme}>
        <MuiThemeProvider theme={theme}>
          {children}
        </MuiThemeProvider>
      </StyledThemeProvider>
    </StylesProvider>
  );
}

MyThemeProvider.propTypes = {
  theme: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
}

export default MyThemeProvider;
