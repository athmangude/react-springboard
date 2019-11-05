/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, no-shadow, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';
import numeral from 'numeral';
import Spinner from 'react-spinner-material';
import moment from 'moment';

import PieChart from './PieChart';

export default class Summary extends Component {
  static propTypes = {
    identifier: PropTypes.string,
    accountId: PropTypes.number,
    label: PropTypes.string,
    endpoint: PropTypes.string,
    statType: PropTypes.string,
    EventHandler: PropTypes.object,
    metricsActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoadingMetrics: false,
      data: {},
      today: moment(),
    };
  }

  componentDidMount() {
    this.fetchMetric();
  }

  async fetchMetric() {
    const { metricsActions, EventHandler, identifier, accountId, endpoint, statType } = this.props;
    const { today } = this.state;
    this.setState({ isLoadingMetrics: true });

    const previousDateRange = {
      startDate: today.clone().subtract(1, identifier).startOf(identifier).format('YYYY-MM-DD'),
      endDate: today.clone().subtract(1, identifier).endOf(identifier).format('YYYY-MM-DD'),
    };

    const currentDateRange = {
      startDate: today.clone().startOf(identifier).format('YYYY-MM-DD'),
      endDate: today.clone().endOf(identifier).format('YYYY-MM-DD'),
    };

    try {
      const fetchMetricResult = await Promise.all([
        metricsActions.fetchMetric({ ...previousDateRange, statType, accountId }, endpoint),
        metricsActions.fetchMetric({ ...currentDateRange, statType, accountId }, endpoint),
      ]);
      const data = {
        previous: parseFloat(Object.values(fetchMetricResult[0].data.Data).reduce((accumulator, increment) => accumulator + increment, 0), 10),
        current: parseFloat(Object.values(fetchMetricResult[1].data.Data).reduce((accumulator, increment) => accumulator + increment, 0), 10),
      };
      this.setState({ data });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingMetrics: false });
    }
  }

  render() {
    const { identifier, label } = this.props;
    const { data, isLoadingMetrics } = this.state;
    const percentageIncrease = (data.current - data.previous) / data.previous * 100;
    const sampleData = [
      { name: 'previous', value: data.previous },
      { name: 'current', value: data.current },
    ];
    return (
      <Col xl={4} lg={4} md={4} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10, minHeight: 'calc(100% - 20px)' }}>
          <div style={{ paddingBottom: 5, borderBottom: 'solid 1px #e2e4eb', fontSize: 20, fontWeight: 900, color: '#6d6e71', textTransform: 'capitalize' }}>{`${identifier} Comparison`}</div>
          {
            isLoadingMetrics ? (
              <div style={{ width: '100%', height: 150, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <div style={{ paddingBottom: 5, paddingTop: 5, fontSize: 11, fontWeight: 900, color: '#6d6e71', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  {
                    Object.keys(data).map((item) => (
                      <div key={item} style={{ textTransform: 'capitalize', textAlign: item === 'previous' ? 'left' : 'right' }}>
                        {`${item} ${identifier}: ${numeral(data[item]).format('0,0')}`}
                      </div>
                    ))
                  }
                </div>
                <PieChart title={identifier} data={sampleData} label={label} value={numeral(data.current).format('0 a')} percentageIncrease={percentageIncrease}/>
              </div>
            )
          }
        </div>
      </Col>
    );
  }
}
