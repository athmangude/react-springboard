/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary, no-shadow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import TabMenu from '../Accounts/Account/TabMenu';
import SMS from './components/SMS';
import Events from './components/Events';
import Surveys from './components/Surveys';
import Mpesa from './components/Mpesa';
import Participants from './components/Participants';
import withAdminAuthentication from 'Utils/withAdminAuthentication';
import SimpleLayout from 'Layouts/simple-layout';
import * as appActions from 'Modules/voc/containers/App/flux/actions';

const tabs = [{ label: 'SMS' }, { label: 'M-Pesa' }, { label: 'Events' }, { label: 'Surveys' }, { label: 'Participants' }];

@connect(() => ({}),
  (dispatch) => ({
    appActions: bindActionCreators(appActions, dispatch),
  }))

class Metrics extends Component {
  static propTypes = {
    appActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      accountId: null,
      selectedTab: 'SMS',
    };

    this.onTabSelected = this.onTabSelected.bind(this);
  }

  componentDidMount() {
    const { appActions } = this.props;
    appActions.setRouteTitle('Metrics');
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  render() {
    const { EventHandler, alertActions } = this.props;
    const { accountId, selectedTab } = this.state;
    return (
      <SimpleLayout className="account">
        <div style={{ position: 'relative', display: 'flex', width: '100%', flexDirection: 'column' }}>
          <div style={{ width: '100%', position: 'sticky', top: 0 }}>
            <TabMenu tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} />
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: 10, position: 'relative' }}>
              {
                selectedTab === 'SMS' ? (
                  <SMS {...this.props} accountId={accountId} EventHandler={EventHandler} alertActions={alertActions} />
                ) : selectedTab === 'M-Pesa' ? (
                  <Mpesa {...this.props} accountId={accountId} EventHandler={EventHandler} alertActions={alertActions} />
                ) : selectedTab === 'Events' ? (
                  <Events {...this.props} accountId={accountId} EventHandler={EventHandler} alertActions={alertActions} />
                ) : selectedTab === 'Surveys' ? (
                  <Surveys {...this.props} accountId={accountId} EventHandler={EventHandler} alertActions={alertActions} />
                ) : selectedTab === 'Participants' ? (
                  <Participants {...this.props} accountId={accountId} EventHandler={EventHandler} alertActions={alertActions} />
                ) : null
              }
            </div>
          </div>
        </div>
      </SimpleLayout>
    );
  }
}

export default withAdminAuthentication(Metrics);
