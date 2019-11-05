/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';

import TabMenu from '../TabMenu';
import General from './General';
import Features from './Features';
import Survey from './Survey';
import Channels from './Channels';
import USSD from './USSD';
import Collaborators from './Collaborators';
import WiFi from './WiFi/index';
import Metrics from './Metrics';

let tabs = [{ label: 'General' }, { label: 'Features' }, { label: 'Survey' }, { label: 'Channels' }, { label: 'Collaborators' }, { label: 'Metrics' }];

export default class AccountConfiguration extends Component {
  static propTypes = {
    isFetchingAccountDetails: PropTypes.bool.isRequired,
    onfetchAccountDetails: PropTypes.func.isRequired,
    accountDetails: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onTabSelected = this.onTabSelected.bind(this);
  }

  state = {
    selectedTab: 'General',
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  render() {
    const { accountDetails, isFetchingAccountDetails, onfetchAccountDetails } = this.props;
    const { selectedTab, settings } = this.state;
    if (accountDetails && accountDetails.accountFeatures.ussd) {
      if (!tabs.find((tab) => tab.label === 'USSD')) {
        tabs.push({ label: 'USSD' });
      }
    } else {
      tabs = tabs.filter((tab) => tab.label !== 'USSD');
    }

    if (accountDetails && accountDetails.accountFeatures.wifi) {
      if (!tabs.find((tab) => tab.label === 'WiFi')) {
        tabs.push({ label: 'WiFi' });
      }
    } else {
      tabs = tabs.filter((tab) => tab.label !== 'WiFi');
    }


    return (
      <div style={{ width: '100%', position: 'sticky', top: 0 }}>
        <TabMenu tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: 10, position: 'relative' }}>
          {
            isFetchingAccountDetails && !accountDetails ? (
              <div style={{ height: 200, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Spinner spinnerColor="#002366" size={50} spinnerWidth={4} />
                <span style={{ }}>Fetching Settings</span>
              </div>
            ) : selectedTab === 'General' ? (
              <General {...this.props} settings={settings} isFetchingAccountDetails={isFetchingAccountDetails} accountDetails={accountDetails} onfetchAccountDetails={onfetchAccountDetails} />
            ) : selectedTab === 'Features' ? (
              <Features {...this.props} settings={settings} isFetchingAccountDetails={isFetchingAccountDetails} accountDetails={accountDetails} onfetchAccountDetails={onfetchAccountDetails} />
            ) : selectedTab === 'Survey' ? (
              <Survey {...this.props} settings={settings} isFetchingAccountDetails={isFetchingAccountDetails} accountDetails={accountDetails} onfetchAccountDetails={onfetchAccountDetails} />
            ) : selectedTab === 'Channels' ? (
              <Channels {...this.props} settings={settings} isFetchingAccountDetails={isFetchingAccountDetails} accountDetails={accountDetails} onfetchAccountDetails={onfetchAccountDetails} />
            ) : selectedTab === 'USSD' ? (
              <USSD {...this.props} settings={settings} isFetchingAccountDetails={isFetchingAccountDetails} accountDetails={accountDetails} onfetchAccountDetails={onfetchAccountDetails} />
            ) : selectedTab === 'WiFi' ? (
              <WiFi {...this.props} settings={settings} isFetchingAccountDetails={isFetchingAccountDetails} accountDetails={accountDetails} onfetchAccountDetails={onfetchAccountDetails} />
            ) : selectedTab === 'Collaborators' ? (
              <Collaborators {...this.props} settings={settings} isFetchingAccountDetails={isFetchingAccountDetails} accountDetails={accountDetails} onfetchAccountDetails={onfetchAccountDetails} />
            ) : selectedTab === 'Metrics' ? (
              <Metrics {...this.props} accountDetails={accountDetails} />
            ) : null
          }
        </div>
      </div>
    );
  }
}
