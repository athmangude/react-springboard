/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, no-shadow */
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
    width: PropTypes.number,
    activeSegment: PropTypes.object,
    customerAnalyticsActions: PropTypes.object,
    currency: PropTypes.string,
    appliedFilters: PropTypes.object,
    EventHandler: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const { appliedFilters } = props;

    this.state = {
      isLoadingSpendSummary: false,
      data: {},
      today: moment('2017-02-14 00:00:00'),
      appliedFilters,
    };
  }

  componentDidMount() {
    this.fetchSpendSummary();
  }

  componentWillReceiveProps(newProps) {
    const { appliedFilters } = this.props;
    if (JSON.stringify(appliedFilters) !== JSON.stringify(newProps.appliedFilters)) {
      this.setState({ appliedFilters: newProps.appliedFilters }, () => this.fetchSpendSummary());
    }
  }

  async fetchSpendSummary() {
    const { customerAnalyticsActions, activeSegment, identifier, EventHandler } = this.props;
    const { today, appliedFilters } = this.state;
    this.setState({ isLoadingSpendSummary: true });

    const previousDateRange = {
      startTime: today.clone().subtract(1, identifier).startOf(identifier).format('YYYY-MM-DD HH:mm:ss'),
      endTime: today.clone().subtract(1, identifier).endOf(identifier).format('YYYY-MM-DD HH:mm:ss'),
    };

    const currentDateRange = {
      startTime: today.clone().startOf(identifier).format('YYYY-MM-DD HH:mm:ss'),
      endTime: today.clone().endOf(identifier).format('YYYY-MM-DD HH:mm:ss'),
    };

    try {
      const fetchSpendSummaryResult = await Promise.all([
        customerAnalyticsActions.fetchSpendSummary(previousDateRange, activeSegment, appliedFilters),
        customerAnalyticsActions.fetchSpendSummary(currentDateRange, activeSegment, appliedFilters),
      ]);
      const data = {
        previous: parseFloat(fetchSpendSummaryResult[0].data.Data.amount, 10),
        current: parseFloat(fetchSpendSummaryResult[1].data.Data.amount, 10),
      };
      this.setState({ data });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingSpendSummary: false });
    }
  }

  render() {
    const { currency, width, identifier } = this.props;
    const { data, isLoadingSpendSummary } = this.state;
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
            isLoadingSpendSummary ? (
              <div style={{ width: '100%', height: 150, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <div style={{ paddingBottom: 5, paddingTop: 5, fontSize: 11, fontWeight: 900, color: '#6d6e71', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  {
                    Object.keys(data).map((item) => (
                      <div key={item} style={{ textTransform: 'capitalize', textAlign: item === 'previous' ? 'left' : 'right' }}>
                        {`${item} ${identifier}: ${currency} ${numeral(data[item]).format('0,0')}`}
                      </div>
                    ))
                  }
                </div>
                <PieChart title={identifier} data={sampleData} currency={currency} value={numeral(data.current).format('0 a')} percentageIncrease={percentageIncrease} width={width} />
              </div>
            )
          }
        </div>
      </Col>
    );
  }
}
