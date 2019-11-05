/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, no-shadow, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-grid-system';

import Item from './Item';
import MpesaStatTypes from '../../MpesaStatTypes';

const items = ['day', 'week', 'month'];

export default class Summary extends Component {
  static propTypes = {
    accountId: PropTypes.number,
    isLoadingMpesaStatTypes: PropTypes.bool,
    mpesaStatTypes: PropTypes.array,
    label: PropTypes.string,
    endpoint: PropTypes.string,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
    metricsActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onStatTypeChange = this.onStatTypeChange.bind(this);
  }

  state = {
    statType: 'PAYBILL',
  }

  onStatTypeChange(statType) {
    this.setState({ statType });
  }

  render() {
    const { accountId, isLoadingMpesaStatTypes, mpesaStatTypes, label, endpoint, EventHandler, alertActions, metricsActions } = this.props;
    const { statType } = this.state;
    return (
      <Row style={{ width: '100%', margin: 0, padding: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
          <MpesaStatTypes isLoading={isLoadingMpesaStatTypes} mpesaStatTypes={mpesaStatTypes} defaultStatType={statType} onChange={this.onStatTypeChange} />
        </div>
        {
          items.map((item) => (
            <Item key={item} identifier={item} isLoadingMpesaStatTypes={isLoadingMpesaStatTypes} mpesaStatTypes={mpesaStatTypes} statType={statType} accountId={accountId} label={label} endpoint={endpoint} EventHandler={EventHandler} alertActions={alertActions} metricsActions={metricsActions} />
          ))
        }
      </Row>
    );
  }
}
