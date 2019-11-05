import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../components/SettingsNavigationContainer';

@connect(() => ({}),
(dispatch) => ({
  dispatch,
}))
class AccountSettings extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
  }

  state = {
    isFetchingAudiences: false,
  }

  componentDidMount() {
    this.fetchAudiences();
  }

  render() {
    return (
      <SettingsNavigationContainer EventHandler={this.props.EventHandler} alertActions={this.props.alertActions}>
      </SettingsNavigationContainer>
    );
  }
}

export default withAuthentication(AccountSettings);
