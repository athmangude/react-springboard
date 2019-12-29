/* eslint-disable jsx-a11y/href-no-hash, no-console */
import { IntercomAPI } from 'react-intercom';
import ReactGA from 'react-ga';

import * as authenticationActions from 'Modules/main/containers/Authentication/flux/actions';
import * as adminAuthenticationActions from 'Modules/administration/containers/Authentication/flux/actions';

class ActivityHandler {
  handleException(dispatch, exception) {
    this.logExceptionToGoogleAnalytics(exception);
    if (!exception.response) {
      return;
    }

    if (exception.response && exception.response.status === 401) {
      if (window.location.pathname.split('/').includes('administration')) {
        dispatch(adminAuthenticationActions.signOut());
        window.location.href = `${window.location.origin}/sign-in`;
      } else {
        dispatch(authenticationActions.signOut());
        window.location.href = `${window.location.origin}/sign-in`;
      }
    }
  }

  logExceptionToGoogleAnalytics(exception) {
    ReactGA.exception({ ...exception, description: exception.message });
  }

  trackEvent(event) {
    // { category, action, label, value }
    this.trackToIntercom(event);
    this.trackToGoogleAnalytics(event);
  }

  trackToIntercom(event) {
    IntercomAPI('trackEvent', event.action);
  }

  trackToGoogleAnalytics(event) {
    ReactGA.event(event);
  }
}

export default new ActivityHandler();
