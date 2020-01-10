/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline, no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../components/SettingsNavigationContainer';
import TabMenu from 'SharedComponents/tab';

const tabs = [{ label: 'Owned' }, { label: 'Shared' }, { label: 'Shared With You' }];

class Audiences extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loggedInUserRole: PropTypes.object,
    audiences: PropTypes.object.isRequired,
    audiencesActions: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
    account: PropTypes.object,
  }

  state = {
    isFetchingAudiences: false,
    selectedTab: 'Owned',
    sidePanel: null,
    showSidePanel: false,
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  render() {
    const { selectedTab, isFetchingAudiences, showSidePanel, sidePanel, EventHandler } = this.state;
    return (
      <SettingsNavigationContainer
        topRightComponent={(<TabMenu tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} style={{ backgroundColor: 'inherit', borderBottom: 'none' }} />)}
        sidePanel={showSidePanel ? sidePanel : null}
        EventHandler={EventHandler}
      >
      </SettingsNavigationContainer>
    );
  }
}

export default withAuthentication(Audiences);
