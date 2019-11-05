/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';
import numeral from 'numeral';
import Spinner from 'react-spinner-material';
import moment from 'moment';

import Graph from './Graph';
import ChartTypes from '../../ChartTypes';
import Intervals from '../../Intervals';
import MpesaStatTypes from '../../MpesaStatTypes';

export default class Overview extends Component {
  static propTypes = {
    accountId: PropTypes.number,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    endpoint: PropTypes.string,
    metricsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    isLoadingMpesaStatTypes: PropTypes.bool,
    mpesaStatTypes: PropTypes.array,
  };

  constructor(props) {
    super(props);

    const { startDate, endDate } = props;

    this.state = {
      isLoadingMetrics: false,
      statType: 'PAYBILL',
      chartType: 'bar',
      interval: 'monthly',
      startDate,
      endDate,
      data: {},
    };

    this.onChartTypeChange = this.onChartTypeChange.bind(this);
    this.onIntervalChange = this.onIntervalChange.bind(this);
    this.onStatTypeChange = this.onStatTypeChange.bind(this);
  }

  componentDidMount() {
    this.fetchMetrics();
  }

  componentWillReceiveProps(newProps) {
    const { startDate, endDate } = this.state;
    if (startDate !== newProps.startDate || endDate !== newProps.endDate) {
      this.setState({ startDate: newProps.startDate, endDate: newProps.endDate }, () => this.fetchMetrics());
    }
  }

  onChartTypeChange(chartType) {
    this.setState({ chartType });
  }

  onIntervalChange(interval) {
    this.setState({ interval }, () => this.fetchMetrics());
  }

  onStatTypeChange(statType) {
    this.setState({ statType }, () => this.fetchMetrics());
  }

  async fetchMetrics() {
    const { metricsActions, accountId, EventHandler, endpoint } = this.props;
    const { interval, commDomain, statType } = this.state;
    let { startDate, endDate } = this.state;
    this.setState({ isLoadingMetrics: true });

    startDate = moment(startDate).format('YYYY-MM-DD');
    endDate = moment(endDate).format('YYYY-MM-DD');

    try {
      const fetchMetricsResult = await metricsActions.fetchMetrics({ startDate, endDate, interval, accountId, statType, commDomain }, endpoint);
      this.setState({ data: fetchMetricsResult.data.Data });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingMetrics: false });
    }
  }

  render() {
    const { isLoadingMpesaStatTypes, mpesaStatTypes } = this.props;
    const { data, interval, chartType, isLoadingMetrics, statType } = this.state;

    const transactions = Object.values(data).reduce((accumulator, currentValue) => accumulator + currentValue.noOfTransaction, 0);
    const amount = Object.values(data).reduce((accumulator, currentValue) => accumulator + currentValue.totalAmount, 0);

    const dataSchema = Object.keys(data).sort().map((key) => {
      let period = '';
      if (interval === 'daily' || interval === 'weekly') {
        period = moment(key).format('D MMM');
      } else if (interval === 'monthly') {
        period = moment(key).format('MMM YYYY');
      } else {
        period = moment(key).format('YYYY');
      }
      return { period, noOfTransaction: data[key].noOfTransaction, totalAmount: data[key].totalAmount, amountProcessed: data[key].amountProcessed, amountNotEligible: data[key].amountNotEligible, amountReceived: data[key].amountReceived };
    });

    return (
      <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#6d6e71', width: '100%', padding: '10px 0 20px 0' }}>Overview</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', fontSize: 12, color: '#6d6e71', minWidth: 150 }}>
              {
                isLoadingMetrics ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Spinner spinnerColor="#002366" size={20} spinnerWidth={3} />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <div>
                      Transactions
                      &nbsp;
                      <span style={{ fontSize: 20 }}>
                        {numeral(transactions).format('0,0')}
                      </span>
                    </div>
                    <div>
                      Total Amount
                      &nbsp;
                      <span style={{ fontSize: 20 }}>
                        {numeral(amount).format('0,0')}
                      </span>
                    </div>
                  </div>
                )
              }
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                <MpesaStatTypes isLoading={isLoadingMpesaStatTypes} mpesaStatTypes={mpesaStatTypes} defaultStatType={statType} onChange={this.onStatTypeChange} />
                <ChartTypes onChange={this.onChartTypeChange} chartOptions={['line', 'bar']} defaultChartType="line" />
                <Intervals onIntervalChange={this.onIntervalChange} />
              </div>
            </div>
          </div>
          {
            isLoadingMetrics ? (
              <div style={{ width: '100%', height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              </div>
            ) : !Object.keys(data).length ? (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 }}>No data to display</div>
            ) : (
              <Graph data={dataSchema} chartType={chartType} />
            )
          }
        </div>
      </Col>
    );
  }
}
