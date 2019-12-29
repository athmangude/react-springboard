/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Alert from './Alert';
import { removeAlert } from './flux/actions';


const Alerts = ({ alertActions, alerts, location }) => {
  let rightPosition = 0;
  if (location.pathname === '/') {
    if (window.innerWidth > 1920) {
      rightPosition = ((window.innerWidth - 1920) / 2) + 300;
    } else {
      rightPosition = 300;
    }
  }

  return (
    <div
      style={{
        position: 'fixed', zIndex: 9999999, top: 0, right: rightPosition,
      }}
    >
      {
        alerts.map((alert) => (
          <Alert {...alert} removeAlert={alertActions.removeAlert} key={alert.id} />
        ))
      }
    </div>
  );
};

Alerts.propTypes = {
  alertActions: PropTypes.object.isRequired,
  alerts: PropTypes.array.isRequired,
  route: PropTypes.object.isRequired,
};

export default connect((state) => ({
  alerts: state.alerts,
  route: state.route,
}), (dispatch) => ({
  alertActions: bindActionCreators({ removeAlert }, dispatch),
}))(withRouter(Alerts));
