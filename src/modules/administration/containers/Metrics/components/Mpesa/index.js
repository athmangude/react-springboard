/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline */
import React, { Component } from 'react';
import { Row } from 'react-grid-system';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import PropTypes from 'prop-types';

import Overview from './Overview';
import Summary from './Summary';
import Filters from '../Filters';
import * as metricsActions from '../../flux/actions';

@connect(() => ({}),
  (dispatch) => ({
    metricsActions: bindActionCreators(metricsActions, dispatch),
    dispatch,
  }))

export default class Mpesa extends Component {
  static propTypes = {
    metricsActions: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    accountId: PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.state = {
      label: 'MPESA',
      endpoint: '/mpesa/',
      startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      mpesaStatTypes: [],
      isLoadingMpesaStatTypes: false,
    };

    this.onDateRangeChange = this.onDateRangeChange.bind(this);
  }

  componentDidMount() {
    this.fetchMpesaStatTypes();
  }


  onDateRangeChange({ from, to }) {
    this.setState({ startDate: from, endDate: to });
  }

  async fetchMpesaStatTypes() {
    this.setState({ isLoadingMpesaStatTypes: true });
    const { metricsActions, EventHandler } = this.props;

    try {
      const fetchMpesaStatTypesResult = await metricsActions.fetchMpesaStatTypes();
      const mpesaStatTypes = [{ key: null, value: null, text: (<span>Stat&nbsp;Types</span>) }];
      Object.values(fetchMpesaStatTypesResult.data.Data).forEach((domain) => mpesaStatTypes.push({ key: domain, value: domain, text: domain }));
      this.setState({ mpesaStatTypes });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingMpesaStatTypes: false });
    }
  }

  render() {
    const { metricsActions, EventHandler, alertActions, accountId } = this.props;
    const { label, startDate, endDate, endpoint, isLoadingMpesaStatTypes, mpesaStatTypes } = this.state;
    return (
      <div style={{ width: '100%' }}>
        <Filters handleDateRangeChanged={this.onDateRangeChange} startDate={startDate} endDate={endDate} padding={0} margin={0} EventHandler={EventHandler} alertActions={alertActions} />
        <Row style={{ width: '100%', margin: 0, padding: 0 }}>
          <Overview isLoadingMpesaStatTypes={isLoadingMpesaStatTypes} mpesaStatTypes={mpesaStatTypes} accountId={accountId} endpoint={endpoint} startDate={startDate} endDate={endDate} EventHandler={EventHandler} alertActions={alertActions} metricsActions={metricsActions} />
        </Row>
        <Summary isLoadingMpesaStatTypes={isLoadingMpesaStatTypes} mpesaStatTypes={mpesaStatTypes} accountId={accountId} label={label} endpoint={endpoint} EventHandler={EventHandler} alertActions={alertActions} metricsActions={metricsActions} />
      </div>
    );
  }
}
