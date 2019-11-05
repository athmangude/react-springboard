/* eslint-disable jsx-a11y/href-no-hash, radix, no-return-assign, no-nested-ternary, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TabMenu from '../TabMenu';
import SMS from '../../../Metrics/components/SMS';
import Events from '../../../Metrics/components/Events';
import Surveys from '../../../Metrics/components/Surveys';
import Participants from '../../../Metrics/components/Participants';

const tabs = [{ label: 'SMS' }, { label: 'Events' }, { label: 'Surveys' }, { label: 'Participants' }];

export default class Metrics extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    adminAuthentication: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onTabSelected = this.onTabSelected.bind(this);
  }

  state = {
    selectedTab: 'SMS',
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  render() {
    const { EventHandler, alertActions } = this.props;
    const { selectedTab } = this.state;
    const { router } = this.context;
    const { id } = router.route.match.params;

    return (
      <div style={{ width: '100%' }}>
        <TabMenu tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: 10, position: 'relative' }}>
          {
            selectedTab === 'SMS' ? (
              <SMS {...this.props} accountId={id} EventHandler={EventHandler} alertActions={alertActions} />
            ) : selectedTab === 'Events' ? (
              <Events {...this.props} accountId={id} EventHandler={EventHandler} alertActions={alertActions} />
            ) : selectedTab === 'Surveys' ? (
              <Surveys {...this.props} accountId={id} EventHandler={EventHandler} alertActions={alertActions} />
            ) : selectedTab === 'Participants' ? (
              <Participants {...this.props} accountId={id} EventHandler={EventHandler} alertActions={alertActions} />
            ) : null
          }
        </div>
      </div>
    );
  }
}
