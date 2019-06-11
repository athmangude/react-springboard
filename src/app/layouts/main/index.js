import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled, { ThemeProvider } from 'styled-components';
import { Helmet } from "react-helmet";

import * as AppActions from 'Flux/app/actions';

import themes from '../../themes';

import './main.css';
import styles from './index.styles';

const MainLayoutWrapper = styled.main`${styles}`;

window.deferredInstallPrompt;

@connect((state) => ({
  ...state
}), (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
}))
export default class MainLayout extends Component {

  componentDidMount() {
    const { AppActions } = this.props;
    window.addEventListener('beforeinstallprompt', (event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      event.preventDefault;

      // Stash the event so it can be triggered later.
      window.deferredInstallPrompt = event;

      AppActions.setBeforeInstallPromptFire(true);
    });

    window.addEventListener('appinstalled', (event) => {
      console.log('[Application was installed successfully]');
    });
  }

  onInstallButtonClicked = () => {
    window.deferredInstallPrompt.prompt();

    window.deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      window.deferredInstallPrompt = null;
      AppActions.setBeforeInstallPromptFire(false);
    });
  }

  render() {
    const { app } = this.props;
    const theme = themes.dark;
    return (
      <ThemeProvider theme={theme}>
        <MainLayoutWrapper style={{ width: '100%' }}>
          <Helmet>
            <meta name="theme-color" content={theme.secondaryColor} />
            <meta name="background-color" content={theme.darkPrimaryColor} />
          </Helmet>
          <aside className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" style={{ color: '#fff', fontSize: 25, textDecoration: 'none', textTransform: 'uppercase', fontWeight: 'bold', marginLeft: 10 }}>Spring Board</Link>
            {
              app.hasBeforeInstallPromptBeenFired ? (
                <button
                  style={{ margin: '0 10px', padding: 10, borderRadius: 18, outline: 'none', fontWeight: 'bold' }}
                  onClick={this.onInstallButtonClicked}
                >
                  Install App
                </button>
              ) : null
            }
          </aside>
          <section className="main">
            {this.props.children}
          </section>
        </MainLayoutWrapper>
      </ThemeProvider>
    )
  }
}
