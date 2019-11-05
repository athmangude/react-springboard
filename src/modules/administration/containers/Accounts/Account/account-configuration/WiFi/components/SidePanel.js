import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as accountsActions from '../../../../flux/actions';
import SettingsForm from './WiFiSettings';

@connect((state) => ({
  adminAuthentication: state.adminAuthentication,
}), (dispatch) => ({
  accountsActions: bindActionCreators(accountsActions, dispatch),
  dispatch,
}))

export default class WiFiSidePanel extends Component {

  static propsTypes = {
    showSidePanel: PropTypes.bool,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    onCloseSidePanel: PropTypes.func.isRequired,
    accountDetails: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onUpdateDimensions = this.onUpdateDimensions.bind(this);
  }

  state = {
    windowWidth: window.innerWidth,
  }

  componentDidMount() {
    window.addEventListener('resize', this.onUpdateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onUpdateDimensions);
  }

  onUpdateDimensions() {
    this.setState({
      windowWidth: window.innerWidth,
    });
  }


  render() {
    const { showSidePanel, EventHandler, alertActions, onCloseSidePanel, accountDetails } = this.props;
    const { windowWidth } = this.state;
    return (
      <div style={{ height: '100vh', transition: 'width 0.1s', width: !showSidePanel ? 0 : windowWidth > 425 ? 425 : '100vw', overflowY: 'auto', position: 'fixed', right: 0, top: 60, backgroundColor: '#fff', boxShadow: '3px 0 10px rgba(0, 0, 0, 0.6)', zIndex: 1 }}>
        <SettingsForm EventHandler={EventHandler} alertActions={alertActions} onCloseSidePanel={onCloseSidePanel} accountDetails={accountDetails} />
      </div>
    );
  }
}
