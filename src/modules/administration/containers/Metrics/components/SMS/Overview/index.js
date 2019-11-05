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
import CommDomains from '../../CommDomains';

export default class Overview extends Component {
  static propTypes = {
    accountId: PropTypes.number,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    endpoint: PropTypes.string,
    statType: PropTypes.string,
    metricsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    isLoadingCommDomains: PropTypes.bool,
    commDomains: PropTypes.array,
  };

  constructor(props) {
    super(props);

    const { startDate, endDate } = props;

    this.state = {
      isLoadingMetrics: false,
      chartType: 'bar',
      interval: 'monthly',
      commDomain: null,
      startDate,
      endDate,
      data: {},
    };

    this.onChartTypeChange = this.onChartTypeChange.bind(this);
    this.onIntervalChange = this.onIntervalChange.bind(this);
    this.onCommDomainChange = this.onCommDomainChange.bind(this);
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

  onCommDomainChange(commDomain) {
    this.setState({ commDomain }, () => this.fetchMetrics());
  }

  async fetchMetrics() {
    const { metricsActions, accountId, EventHandler, endpoint, statType } = this.props;
    const { interval, commDomain } = this.state;
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
    const { isLoadingCommDomains, commDomains } = this.props;
    const { data, interval, chartType, isLoadingMetrics } = this.state;

    const outgoing = Object.values(data).reduce((accumulator, currentValue) => accumulator + currentValue.outgoing, 0);
    const incoming = Object.values(data).reduce((accumulator, currentValue) => accumulator + currentValue.incoming, 0);

    const dataSchema = Object.keys(data).sort().map((key) => {
      let period = '';
      if (interval === 'daily' || interval === 'weekly') {
        period = moment(key).format('D MMM');
      } else if (interval === 'monthly') {
        period = moment(key).format('MMM YYYY');
      } else {
        period = moment(key).format('YYYY');
      }
      return { period, outgoing: data[key].outgoing, incoming: data[key].incoming, reminders: data[key].reminders };
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
                      Outgoing
                      &nbsp;
                      <span style={{ fontSize: 20 }}>
                        {numeral(outgoing).format('0,0')}
                      </span>
                    </div>
                    <div>
                      Incoming
                      &nbsp;
                      <span style={{ fontSize: 20 }}>
                        {numeral(incoming).format('0,0')}
                      </span>
                    </div>
                  </div>
                )
              }
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                <CommDomains isLoading={isLoadingCommDomains} commDomains={commDomains} onChange={this.onCommDomainChange} />
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
