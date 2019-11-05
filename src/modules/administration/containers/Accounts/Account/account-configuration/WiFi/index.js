/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-spinner-material';

import CircularButton from 'SharedComponents/circular-button';
import ActionButton from 'SharedComponents/action-button';

import WiFiSidePanel from './components/SidePanel';

import * as accountsActions from '../../../flux/actions';

@connect(() => ({}),
  (dispatch) => ({
    accountsActions: bindActionCreators(accountsActions, dispatch),
  }))

export default class WiFi extends Component {
  static propTypes = {
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object,
    accountDetails: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.fetchWifiSettings = this.fetchWifiSettings.bind(this);
    this.onOpenSidePanel = this.onOpenSidePanel.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
  }

  state = {
    isFetching: false,
    showSidePanel: false,  
    isWiFiConfigured: false,
  }

  componentDidMount() {
    this.fetchWifiSettings();
  }

  onOpenSidePanel() {
    this.setState({ showSidePanel: true });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false });
  }

  fetchWifiSettings() {
    const { accountDetails } = this.props;

    if (accountDetails.accountFeatures.wifi) {
      this.setState({ isWiFiConfigured: true });
    }
  }

  render() {
    const { isFetching, showSidePanel, isWiFiConfigured } = this.state;
    const { EventHandler, alertActions, accountDetails } = this.props;

    return (
      <div style={{ width: '100%' }}>
        <CircularButton className="primary cta" style={{ position: 'fixed', top: 83, right: 20, zIndex: 1 }} icon="add" color="#002366" onClick={this.onOpenSidePanel} />
        {
          isFetching ? (
            <div style={{ width: '100%', position: 'relative' }}>
              <div style={{ height: 200, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Spinner spinnerColor="#002366" size={50} spinnerWidth={4} />
                <span style={{ margin: 20 }}>Fetching Wifi Settings ...</span>
              </div>
              <WiFiSidePanel accountDetails={accountDetails} showSidePanel={showSidePanel} onCloseSidePanel={this.onCloseSidePanel} EventHandler={EventHandler} alertActions={alertActions} />
            </div>
          ) : !isFetching && !isWiFiConfigured  ? (
            <div style={{ width: '100%', position: 'relative' }}>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
                <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>You do not have any Wifi Settings</h2>
                <ActionButton className="primary" large icon="add" text="Add WiFi Settings" onClick={this.onOpenSidePanel} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
              </div>
              <WiFiSidePanel accountDetails={accountDetails} showSidePanel={showSidePanel} onCloseSidePanel={this.onCloseSidePanel} EventHandler={EventHandler} alertActions={alertActions} />
            </div>
          ) : !isFetching && isWiFiConfigured ? (
            <div style={{ width: '100%', position: 'relative' }}>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
                <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>Configure available Wifi Settings</h2>
                <ActionButton className="primary" large icon="add" text="Edit WiFi Settings" onClick={this.onOpenSidePanel} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />                
              </div>
              <WiFiSidePanel accountDetails={accountDetails} showSidePanel={showSidePanel} onCloseSidePanel={this.onCloseSidePanel} EventHandler={EventHandler} alertActions={alertActions} />
            </div>
          ) : null
        }
      </div>
    );
  }
}
