/* eslint-disable jsx-a11y/href-no-hash, react/no-unused-state, no-nested-ternary, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';
import moment from 'moment';
import Spinner from 'react-spinner-material';

import Themes from '../Themes';
import MentionsGraph from './Graph';
import ChartTypes from '../../components/ChartTypes';
import Intervals from '../../components/Intervals';

const months = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default class Mentions extends Component {
  static propTypes = {
    themes: PropTypes.object,
    colors: PropTypes.array,
    customerAnalyticsActions: PropTypes.object,
    alertActions: PropTypes.object,
    activeSegment: PropTypes.object,
    appliedFilters: PropTypes.object,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    EventHandler: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const { themes, appliedFilters, startDate, endDate } = props;
    const themeKeys = Object.keys(themes);
    const aggregatedThemeKeys = themeKeys
      .map((theme) => ({ theme, total: parseInt(themes[theme], 10) + parseInt(themes[theme], 10) + parseInt(themes[theme], 10) }))
      .sort((a, b) => b.total - a.total)
      .map((theme) => theme.theme);
    const selectedThemes = aggregatedThemeKeys.slice(0, 5);
    this.state = {
      isLoadingMentions: false,
      selectedThemes,
      chartType: 'line',
      interval: 'daily',
      data: [],
      appliedFilters,
      startDate,
      endDate,
    };

    this.onChange = this.onChange.bind(this);
    this.onChartTypeChange = this.onChartTypeChange.bind(this);
    this.onIntervalChange = this.onIntervalChange.bind(this);
  }

  componentDidMount() {
    this.fetchMentions();
  }

  componentWillReceiveProps(newProps) {
    const { appliedFilters, startDate, endDate } = this.props;
    if (JSON.stringify(appliedFilters) !== JSON.stringify(newProps.appliedFilters) || startDate !== newProps.startDate || endDate !== newProps.endDate) {
      this.setState({ appliedFilters: newProps.appliedFilters, startDate: newProps.startDate, endDate: newProps.endDate }, () => this.fetchMentions());
    }
  }

  onChange(selectedThemes) {
    this.setState({ selectedThemes });
  }

  onChartTypeChange(chartType) {
    this.setState({ chartType });
  }

  onIntervalChange(interval) {
    this.setState({ interval }, () => this.fetchMentions());
  }

  async fetchMentions() {
    const { customerAnalyticsActions, activeSegment, EventHandler } = this.props;
    const { interval, appliedFilters, startDate, endDate } = this.state;
    this.setState({ isLoadingMentions: true });

    try {
      const fetchMentionsResult = await customerAnalyticsActions.fetchMentions({ startTime: startDate, endTime: endDate }, interval, activeSegment, appliedFilters);
      const data = [];
      Object.keys(fetchMentionsResult.data.Data).sort((a, b) => moment(a) - moment(b)).forEach((key) => {
        let period = key;
        if (interval === 'daily' || interval === 'weekly') {
          const periodArray = period.split(' ')[0].split('-');
          if (periodArray.length > 1) {
            period = periodArray[2].concat(' ').concat(months[parseInt(periodArray[1], 10)]);
          }
        }
        data.push({ period, ...fetchMentionsResult.data.Data[key] });
      });
      this.setState({ data });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingMentions: false });
    }
  }

  render() {
    const { themes, colors, alertActions } = this.props;
    const { selectedThemes, data, isLoadingMentions, chartType } = this.state;

    return (
      <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
          <div style={{ width: '100%', fontSize: 18, fontWeight: 100, lineHeight: 1.78, color: '#434656' }}>
            <span style={{ fontSize: 20, fontWeight: 900, marginRight: 5 }}>Themes</span>
            &nbsp;Mentions
          </div>
          <Themes themes={themes} selectedThemes={selectedThemes} colors={colors} onChange={this.onChange} alertActions={alertActions} />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <ChartTypes onChange={this.onChartTypeChange} chartOptions={['line', 'bar']} defaultChartType={chartType} />
            <Intervals onIntervalChange={this.onIntervalChange} />
          </div>
          <div style={{ width: '100%', paddingTop: 20 }}>
            {
              isLoadingMentions ? (
                <div style={{ width: '100%', height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
                </div>
              ) : !data.length ? (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 }}>No data to display</div>
              ) : (
                <MentionsGraph data={data} themes={selectedThemes} colors={colors} chartType={chartType} />
              )
            }
          </div>
        </div>
      </Col>
    );
  }
}
