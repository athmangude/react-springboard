import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styled from "styled-components";

// import 'sanitize.css/sanitize.css';
import "normalize.css/normalize.css";

import * as AppActions from "Modules/main/flux/app/actions";

import "./main.css";
import styles from "./index.css";

const MainLayoutWrapper = styled.main`
  ${styles}
`;

window.deferredInstallPrompt;

@connect(
  state => ({
    ...state
  }),
  dispatch => ({
    AppActions: bindActionCreators(AppActions, dispatch)
  })
)
export default class MainLayout extends Component {
  componentDidMount() {
    const { AppActions } = this.props;
    window.addEventListener("beforeinstallprompt", event => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      event.preventDefault;

      // Stash the event so it can be triggered later.
      window.deferredInstallPrompt = event;

      AppActions.setBeforeInstallPromptFire(true);
    });

    window.addEventListener("appinstalled", event => {
      console.log("[Application was installed successfully]");
    });
  }

  onInstallButtonClicked = () => {
    window.deferredInstallPrompt.prompt();

    window.deferredInstallPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      window.deferredInstallPrompt = null;
      AppActions.setBeforeInstallPromptFire(false);
    });
  };

  render() {
    return (
      <MainLayoutWrapper style={{ width: "100%" }}>
        <section className="main">{this.props.children}</section>
      </MainLayoutWrapper>
    );
  }
}

// https://developers.google.com/web/fundamentals/app-install-banners/
