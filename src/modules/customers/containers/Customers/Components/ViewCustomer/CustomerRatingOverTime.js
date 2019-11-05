/* eslint-disable object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import RatingOverTime from '../../../Segments/components/RatingOverTime';
import { createFakeNPSTRendData } from '../../../components/DummyData'

import Title from 'Modules/analytics/containers/components/Title';

// Change to stateful component
// Fetch data from api
// Handle change in interval
// Handle change in date

export default class CustomerRatingOverTime extends Component {
  static propTypes = {
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    participantId: PropTypes.number,
    selectedDateRange: PropTypes.object,
    currency: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.fetchCustomerNpsTrend = this.fetchCustomerNpsTrend.bind(this);
    this.createFakeNPSTRendData = this.createFakeNPSTRendData.bind(this);
    this.onChangeInterval = this.onChangeInterval.bind(this);

    this.state = {
      isLoadingNpsTrend: false,
      participantNpsTrendData: [],
      interval: 'daily'
    };
  }

  componentDidMount() {
    const { demoMode } = this.props;

    if(!demoMode) {
      this.fetchCustomerNpsTrend();
    } else {
      this.createFakeNPSTRendData(true);
    }
  }

  componentWillReceiveProps(newProps) {
    if((newProps.selectedDateRange.from !== this.props.selectedDateRange.from) || (newProps.selectedDateRange.to !== this.props.selectedDateRange.to)){
      if(!newProps.demoMode) {
        this.fetchCustomerNpsTrend();
      } else {
        this.createFakeNPSTRendData(true);
      }
    }
  }

  onChangeInterval(interval) {
    const { demoMode } = this.props;

    this.setState({ interval }, () => {
      if(!demoMode) {
        this.fetchCustomerNpsTrend();
      } else {
        this.createFakeNPSTRendData(false);
      }
    });
  }

  createFakeNPSTRendData(initialLoad = false) {
    const { selectedDateRange } = this.props;
    const { interval } = this.state;

    this.setState({ isLoadingNpsTrend: initialLoad });

    setTimeout(() => {
      const data = createFakeNPSTRendData(selectedDateRange);

      const dataSchema = Object.keys(data).sort().map((key) => {
        let period = '';
        if (interval === 'daily' || interval === 'weekly') {
          period = moment(key).format('D MMM');
        } else if (interval === 'monthly') {
          period = moment(key).format('MMM YYYY');
        } else {
          period = moment(key).format('YYYY');
        }
        return {
          period,
          promoters: data[key].promoters,
          passives: data[key].passives,
          detractors: data[key].detractors };
      });
      this.setState({ participantNpsTrendData: dataSchema, isLoadingNpsTrend: false });
    }, 1000)
  }

  async fetchCustomerNpsTrend(initialLoad = false) {
    const { customerAnalyticsActions, EventHandler, participantId, selectedDateRange } = this.props;
    const { interval } = this.state;

    let startTime = '';
    let endTime = '';

    if (selectedDateRange.value !== undefined) {
      startTime = moment(selectedDateRange.value.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endTime = moment(selectedDateRange.value.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    } else {
      startTime = moment(selectedDateRange.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endTime = moment(selectedDateRange.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    }

    this.setState({ isLoadingNpsTrend: initialLoad });
    try {
      const fetchCustomerNpsTrendResult = await customerAnalyticsActions.fetchCustomerNpsTrend(participantId, { startTime, endTime, interval });
      const dataSchema = Object.keys(fetchCustomerNpsTrendResult.data.Data).sort().map((key) => {
        let period = '';
        if (interval === 'daily' || interval === 'weekly') {
          period = moment(key).format('D MMM');
        } else if (interval === 'monthly') {
          period = moment(key).format('MMM YYYY');
        } else {
          period = moment(key).format('YYYY');
        }
        return {
          period,
          promoters: fetchCustomerNpsTrendResult.data.Data[key].promoters,
          passives: fetchCustomerNpsTrendResult.data.Data[key].passives,
          detractors: fetchCustomerNpsTrendResult.data.Data[key].detractors };
      });
      this.setState({ participantNpsTrendData: dataSchema});
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingNpsTrend: false });
    }
  }

  render() {
    const { currency } = this.props;
    const { participantNpsTrendData, isLoadingNpsTrend } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', width: '100%', padding: 10, backgroundColor: 'rgb(236, 236, 236)', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title title="Rating Over Time" subtitle="How is my customer's rating over time?" loading={isLoadingNpsTrend} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: 5 }}>
          <RatingOverTime
            width={300}
            data={participantNpsTrendData}
            isLoading={isLoadingNpsTrend}
            chartType="bar"
            style={{ boxShadow: 0, padding: 0 }}
          />
        </div>
      </div>
    );
  }
}
