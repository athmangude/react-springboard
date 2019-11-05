import React, { Component } from 'react';
import { Dropdown, Segment, Dimmer, Loader } from 'semantic-ui-react/dist/commonjs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts/lib';
import PropTypes from 'prop-types';
import moment from 'moment';
import groupBy from 'lodash/groupBy';

import Download from './Download';
import DateRangePicker from '../../../Reports/components/DateRangePicker';
import CustomTooltip from './CustomTooltip';
import ActivityHandler from 'Utils/ActivityHandler';

import * as incentivesUsageActions from '../flux/actions';

const intervalOptions = [
  {
    key: 'daily',
    value: 'daily',
    text: 'Daily',
    reference: 'Today',
    style: { height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: '#808285' },
  },
  {
    key: 'weekly',
    value: 'weekly',
    text: 'Weekly',
    reference: 'This Week',
    style: { height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: '#808285' },
  },
  {
    key: 'monthly',
    value: 'monthly',
    text: 'Monthly',
    reference: 'This Month',
    style: { height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: '#808285' },
  },
  {
    key: 'quarterly',
    value: 'quarterly',
    text: 'Quarterly',
    reference: 'This Quarter',
    style: { height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: '#808285' },
  },
  {
    key: 'yearly',
    value: 'yearly',
    text: 'Yearly',
    reference: 'This Year',
    style: { height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: '#808285' },
  },
];

const months = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@connect(
  (state) => ({
    csReport: state.aodReport,
  }),
  (dispatch) => ({
    incentivesUsageActions: bindActionCreators(incentivesUsageActions, dispatch),
    dispatch,
  })
)

export default class Chart extends Component {
  static propTypes = {
    tab: PropTypes.string,
    surveyId: PropTypes.string,
    incentivesUsageActions: PropTypes.object,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      isFetchingIncentivesUsage: false,
      isFilteringByDate: false,
      data: [],
      interval: 'daily',
      startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      left: 0,
      right: 0,
    };
    this.panLeft = this.panLeft.bind(this);
    this.panRight = this.panRight.bind(this);
    this.onIntervalChanged = this.onIntervalChanged.bind(this);
    this.handleDateRangeChanged = this.handleDateRangeChanged.bind(this);
    this.fetchIncentivesUsage = this.fetchIncentivesUsage.bind(this);
  }

  componentDidMount() {
    this.fetchIncentivesUsage();
  }

  componentWillReceiveProps(newProps) {
    const { surveyId } = this.props;
    if (newProps.tab === 'Account' || (surveyId !== newProps.surveyId && newProps.tab === 'Survey' && newProps.surveyId)) {
      this.setState({ surveyId: newProps.surveyId }, () => {
        this.fetchIncentivesUsage();
      });
    }
  }

  onIntervalChanged(e, { name, value }) {
    this.setState({ [name]: value }, () => {
      this.fetchIncentivesUsage();
      this.props.EventHandler.trackEvent({ category: 'IncentivesUsage', action: 'interval changed', value });
    });
  }

  panLeft() {
    const { left, right } = this.state;
    if ((left + 100) >= 50) return;

    this.setState(() => ({
      right: right - 100,
      left: left + 100,
    }));
  }

  panRight() {
    const { left, right } = this.state;

    if ((right + 100) >= 50) {
      return;
    }

    this.setState(() => ({
      left: left - 100,
      right: right + 100,
    }));
  }

  handleDateRangeChanged({ from, to }) {
    this.setState({
      isFilteringByDate: true,
      startDate: from,
      endDate: to,
    }, async () => {
      await this.fetchIncentivesUsage();
      this.setState({ isFilteringByDate: false });
      this.props.EventHandler.trackEvent({ category: 'IncentivesUsage', action: 'changed date range', value: `${from} - ${to}` });
    });
  }

  async fetchIncentivesUsage() {
    try {
      this.setState({ isFetchingIncentivesUsage: true });
      const { interval, startDate, endDate, surveyId } = this.state;
      const fetchIncentivesUsageResult = await this.props.incentivesUsageActions.fetchIncentivesUsage({ surveyId, interval, from: startDate.concat(' 00:00:00'), to: endDate.concat(' 00:00:00') });
      const computedData = this.processFetchedData(fetchIncentivesUsageResult.data.Data, interval);
      const right = computedData.length > 15 ? -80 * computedData.length : 0;
      this.setState({ data: computedData, right, left: 0 });
      this.props.EventHandler.trackEvent({ category: 'IncentivesUsage', action: 'fetch incetives usage', value: true });
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'IncentivesUsage', action: 'fetch incetives usage', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingIncentivesUsage: false });
    }
  }

  processFetchedData(data, interval) {
    const computedData = [];
    const groupedData = groupBy(data, (record) => record.period);

    Object.keys(groupedData).forEach((key) => {
      const records = groupedData[key];
      let amount = 0;
      let contacted = 0;
      records.forEach((record) => {
        amount += record.amount;
        contacted += record.contacted;
      });
      let period = key;
      if (interval === 'daily' || interval === 'weekly') {
        const periodArray = key.split(' ')[0].split('-');
        if (periodArray.length > 1) {
          period = periodArray[2].concat(' ').concat(months[parseInt(periodArray[1], 10)]);
        }
      }

      computedData.push({
        amount,
        contacted,
        period,
      });
    });

    return computedData;
  }

  render() {
    const { data, interval, isFetchingIncentivesUsage, left, right, isFilteringByDate, startDate, endDate, surveyId } = this.state;

    const currentOption = intervalOptions.find((option) => option.value === interval);

    if (this.props.tab === 'Survey' && !surveyId) {
      return (
        <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: '#fafbfc', border: '1px solid #e1e4e8', borderRadius: 3, boxShadow: 'inset 0 0 10px rgba(27,31,35,0.05)' }}>
          <span style={{ color: '#6d6e71', fontSize: 16, fontWeight: 'normal' }}>Select a survey to view the incentives usage</span>
        </div>
      );
    }

    if (isFetchingIncentivesUsage) {
      return (
        <div>Fetching incentives usage...</div>
      );
    }

    return (
      <div style={{ width: '100%', borderRadius: 8, boxShadow: '1px 1px 1px 0 rgba(217, 217, 217, 0.3)', backgroundColor: '#ffffff', border: 'solid 1px #d9d9d9', padding: '10px 15px 15px 15px' }}>
        <Segment style={{ width: '100%', border: 'none', boxShadow: 'none' }}>
          <Dimmer active={isFetchingIncentivesUsage} inverted>
            <Loader active={isFetchingIncentivesUsage} >Loading {interval} incentives usage</Loader>
          </Dimmer>

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Download surveyId={surveyId} startDate={startDate} endDate={endDate} alertActions={this.props.alertActions} EventHandler={this.props.EventHandler} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              <DateRangePicker handleDateRangeChanged={this.handleDateRangeChanged} isFilteringByDate={isFilteringByDate} defaultStart={startDate} defaultEnd={endDate} padding={0} margin={0} />
              <Dropdown inline name="interval" defaultValue={interval} onChange={this.onIntervalChanged} trigger={<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 5 }}><i className="material-icons">date_range</i> &nbsp;<span>{currentOption.text}</span></div>} options={intervalOptions} item style={{ maxWidth: 125, height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'right', color: '#808285', display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }} />
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <button onClick={this.panLeft}><i className="material-icons" style={{ fontSize: 15 }}>arrow_back_ios</i></button>
            <button onClick={this.panRight}><i className="material-icons" style={{ fontSize: 15 }}>arrow_forward_ios</i></button>
          </div>
          <div style={{ width: '100%', height: 400 }}>
            {!data.length ? (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 400, wifth: '100%' }}>No data to display</div>
            ) : (
              <ResponsiveContainer>
                <ComposedChart data={data} barCategoryGap={5} barSize={80} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis allowDataOverflow tickLine={false} dataKey="period" padding={{ left, right }} />
                  <YAxis tickLine={false} yAxisId="left" label={{ value: 'Contacted', angle: -90, position: 'insideLeft' }} />
                  <YAxis tickLine={false} yAxisId="right" label={{ value: 'Incentives', angle: -90, position: 'insideRight' }} orientation="right" />
                  <Tooltip content={<CustomTooltip interval={interval} />} />
                  <Legend />
                  <defs>
                    <linearGradient id="colorContacted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7ca1c8" stopOpacity={1} />
                      <stop offset="100%" stopColor="rgba(199, 210, 223)" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="contacted" yAxisId="left" fill="url(#colorContacted)" background={{ fill: '#f7f7f7' }} />
                  <Line dataKey="amount" yAxisId="right" stroke="#33597f" strokeWidth={2} dot={{ r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </Segment>
      </div>
    );
  }
}
