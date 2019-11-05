/* eslint-disable jsx-a11y/href-no-hash, no-console */
import { IntercomAPI } from "react-intercom";
import ReactGA from "react-ga";
import mixpanel from "mixpanel-browser";

import config from 'Config';
import configureStore from "Modules/shopping/flux/configureStore";
import * as authenticationActions from "Modules/shopping/containers/Authentication/flux/actions";
import * as adminAuthenticationActions from "Modules/administration/containers/Authentication/flux/actions";

export function handleException(exception) {
  logExceptionToGoogleAnalytics(exception);
  if (exception.response && exception.response.status === 401) {
    if (window.location.pathname.split("/").includes("administration")) {
      configureStore().dispatch(adminAuthenticationActions.signOut());
      window.location.href = `${window.location.origin}/administration/sign-in`;
    } else {
      configureStore().dispatch(authenticationActions.signOut());
      window.location.href = `${window.location.origin}/sign-in`;
    }
  }
}

function logExceptionToGoogleAnalytics(exception) {
  ReactGA.exception({ ...exception, description: exception.message });
}

export function trackEvent(event) {
  // { category, action, label, value }
  if (
    window.location.origin.indexOf("localhost") > 0 ||
    window.location.origin.indexOf("qa-ui") > -1 ||
    config.onPremise
  ) {
    // don't log in localhost and QA
    return;
  }

  if (window.localStorage.getItem("user")) {
    const user = JSON.parse(window.localStorage.getItem("user"));

    // TODO: don't collect data from mSurvey users
    if (user && user.user.username === "bitnami") {
      // don't log bitnami
      return;
    }
  }

  trackToMixpanel(event);
  trackToIntercom(event);
  trackToGoogleAnalytics(event);
  trackToAmplitude(event);
}

function trackToIntercom(event) {
  IntercomAPI("trackEvent", event.action);
}

function trackToGoogleAnalytics(event) {
  ReactGA.event(event);
}

function trackToMixpanel(event) {
  mixpanel.track(`${event.category}:${event.action}`, event);
}

function trackToAmplitude(event) {
  window.amplitude.getInstance().logEvent(event.action);
}
