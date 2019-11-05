/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import withAdminAuthentication from 'Utils/withAdminAuthentication';
import SimpleLayout from 'Layouts/simple-layout';
import SearchBar from './components/SearchBar';

import * as EventHandler from 'Utils/EventHandler';
import * as alertActions from 'Modules/voc/containers/App/Alerts/flux/actions';
import * as participantActions from './flux/actions';

@connect((state) => ({
  adminAuthentication: state.adminAuthentication,
}), (dispatch) => ({
  participantActions: bindActionCreators(participantActions, dispatch),
  alertActions: bindActionCreators(alertActions, dispatch),
  dispatch,
}))
class ParticipantHistory extends Component {
  static propTypes = {
    participantActions: PropTypes.object,
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object,
  }

  render() {
    const { participantActions, alertActions, EventHandler } = this.props;
    return (
      <SimpleLayout>
        <div style={{ margin: ' 10px 10px' }}>
          <SearchBar placeholder="Enter Comm ID" participantActions={participantActions} alertActions={alertActions} EventHandler={EventHandler} />
        </div>
      </SimpleLayout>
    );
  }
}

export default withAdminAuthentication(ParticipantHistory);
