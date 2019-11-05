/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';
import numeral from 'numeral';
import Spinner from 'react-spinner-material';

import SpendGraph from '../Graph';
import ChartTypes from '../../components/ChartTypes';
import Intervals from '../../components/Intervals';

const months = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default class Overview extends Component {
  static propTypes = {
    payments: PropTypes.number,
    currency: PropTypes.string,
    customerAnalyticsActions: PropTypes.object,
    activeSegment: PropTypes.object,
    appliedFilters: PropTypes.object,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    EventHandler: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const { appliedFilters, startDate, endDate } = props;
    this.state = {
      isLoadingSpendOverview: false,
      chartType: 'bar',
      interval: 'daily',
      data: {},
      appliedFilters,
      startDate,
      endDate,
    };

    this.onChartTypeChange = this.onChartTypeChange.bind(this);
    this.onIntervalChange = this.onIntervalChange.bind(this);
  }

  componentDidMount() {
    this.fetchSpendOverview();
  }

  componentWillReceiveProps(newProps) {
    const { appliedFilters, startDate, endDate } = this.props;
    if (JSON.stringify(appliedFilters) !== JSON.stringify(newProps.appliedFilters) || startDate !== newProps.startDate || endDate !== newProps.endDate) {
      this.setState({ appliedFilters: newProps.appliedFilters, startDate: newProps.startDate, endDate: newProps.endDate }, () => this.fetchSpendOverview());
    }
  }

  onChartTypeChange(chartType) {
    this.setState({ chartType });
  }

  onIntervalChange(interval) {
    this.setState({ interval }, () => this.fetchSpendOverview());
  }

  async fetchSpendOverview() {
    const { customerAnalyticsActions, activeSegment, EventHandler } = this.props;
    const { interval, appliedFilters, startDate, endDate } = this.state;
    this.setState({ isLoadingSpendOverview: true });

    try {
      const fetchSpendOverviewResult = await customerAnalyticsActions.fetchSpendOverview({ startTime: startDate, endTime: endDate }, interval, null, appliedFilters);
      this.setState({ data: fetchSpendOverviewResult.data.Data });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingSpendOverview: false });
    }
  }

  render() {
    const { payments, currency } = this.props;
    const { data, interval, chartType, isLoadingSpendOverview } = this.state;

    const totalRevenue = Object.values(data).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const dataSchema = Object.keys(data).sort().map((key) => {
      let period = key;
      if (interval === 'daily' || interval === 'weekly') {
        const periodArray = period.split(' ')[0].split('-');
        if (periodArray.length > 1) {
          period = periodArray[2].concat(' ').concat(months[parseInt(periodArray[1], 10)]);
        }
      }
      return { period, amount: data[key] };
    });

    return (
      <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#6d6e71', width: '100%', padding: '10px 0 20px 0' }}>Overview</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', fontSize: 12, color: '#6d6e71', minWidth: 150 }}>
              <div>Total Revenue</div>
              {
                isLoadingSpendOverview ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Spinner spinnerColor="#002366" size={20} spinnerWidth={3} />
                  </div>
                ) : (
                  <div>
                    {currency}
                    &nbsp;
                    <span style={{ fontSize: 20 }}>
                      {numeral(totalRevenue).format('0,0')}
                    </span>
                  </div>
                )
              }
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-end', width: '100%' }}>
                <ChartTypes onChange={this.onChartTypeChange} chartOptions={['line', 'bar']} defaultChartType="line" />
                <Intervals onIntervalChange={this.onIntervalChange} />
              </div>
            </div>
          </div>
          {
            isLoadingSpendOverview ? (
              <div style={{ width: '100%', height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              </div>
            ) : !Object.keys(data).length ? (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 }}>No data to display</div>
            ) : (
              <SpendGraph data={dataSchema} payments={payments} chartType={chartType} />
            )
          }
        </div>
      </Col>
    );
  }
}
