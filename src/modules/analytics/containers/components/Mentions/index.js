/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Spinner from 'react-spinner-material';

import SummaryTabs from '../SummaryTabs';
import Title from '../Title';
import ComparisonChart from '../ComparisonChart';
import DateFilterOptions from '../DateFilterOptions';
import CheckedMultiSelect from '../CheckedMultiSelect';
import ActionButton from 'SharedComponents/action-button-styled';

// const data = {
//   drink: 11,
//   food: 31,
//   maintenance: 15,
//   pastries: 2,
//   service: 105,
//   speed: 19,
//   staff: 26,
// };
// const data = [{ period: '1 Dec', current: 4000, previous: 2400, amt: 2400 }, { period: '2 Dec', current: 3000, previous: 1398, amt: 2210 }, { period: '3 Dec', current: 2000, previous: 9800, amt: 2290 }, { period: '4 Dec', current: 2780, previous: 3908, amt: 2000 }, { period: '5 Dec', current: 1890, previous: 4800, amt: 2181 }, { period: '6 Dec', current: 2390, previous: 3800, amt: 2500 }, { period: '7 Dec', current: 3490, previous: 4300, amt: 2100 }];

export default class Mentions extends Component {
  static propTypes = {
    windowDimensions: PropTypes.object,
    themes: PropTypes.object,
    isLoadingThemes: PropTypes.bool,
    minimal: PropTypes.bool,
    selectedDateRange: PropTypes.object,
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    selectedSegment: PropTypes.object,
    appliedFilters: PropTypes.array,
    demoMode: PropTypes.bool,
    colors: PropTypes.array,
  };

  constructor(props) {
    super(props);

    const { themes } = props;
    const themeKeys = Object.keys(themes);
    const aggregatedThemeKeys = themeKeys
      .map((theme) => ({ theme, total: parseInt(themes[theme], 10) + parseInt(themes[theme], 10) + parseInt(themes[theme], 10) }))
      .sort((a, b) => b.total - a.total)
      .map((theme) => theme.theme);
    const selectedThemes = aggregatedThemeKeys.slice(0, 5);
    this.state = {
      isLoading: false,
      selectedThemes,
      aggregatedThemeKeys,
      selectedTab: 'Mentions',
      totalMentions: 0,
      data: [],
      interval: 'daily',
    };

    this.onTabSelected = this.onTabSelected.bind(this);
    this.onIntervalChange = this.onIntervalChange.bind(this);
    this.onCheckedMultiSelectChange = this.onCheckedMultiSelectChange.bind(this);
    this.fetchMentions = this.fetchMentions.bind(this);
  }

  componentDidMount() {
    this.fetchMentions(this.props);
  }

  componentWillReceiveProps(newProps) {
    const { appliedFilters: newAppliedFilters, selectedSegment: newSelectedSegment, selectedDateRange: newSelectedDateRange, themes: newThemes } = newProps;
    const { appliedFilters, selectedSegment, selectedDateRange } = this.props;
    const { aggregatedThemeKeys: oldAggreagatedThemeKeys } = this.state;
    if (JSON.stringify(newAppliedFilters) !== JSON.stringify(appliedFilters) || newSelectedSegment.id !== selectedSegment.id || JSON.stringify(newSelectedDateRange) !== JSON.stringify(selectedDateRange)) {
      this.fetchMentions(newProps);
    }

    const themeKeys = Object.keys(newThemes);
    const aggregatedThemeKeys = themeKeys
      .map((theme) => ({ theme, total: parseInt(newThemes[theme], 10) + parseInt(newThemes[theme], 10) + parseInt(newThemes[theme], 10) }))
      .sort((a, b) => b.total - a.total)
      .map((theme) => theme.theme);

    if (aggregatedThemeKeys !== oldAggreagatedThemeKeys) {
      const selectedThemes = aggregatedThemeKeys.slice(0, 5);
      this.setState({ selectedThemes, aggregatedThemeKeys });
    }
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  onIntervalChange(interval) {
    this.setState({ interval }, () => this.fetchMentions());
  }

  onCheckedMultiSelectChange(options) {
    this.setState({ selectedThemes: options });
  }

  async fetchMentions(props) {
    const { customerAnalyticsActions, selectedSegment, selectedDateRange, appliedFilters, EventHandler } = props;
    const { interval, aggregatedThemeKeys } = this.state;
    this.setState({ isLoading: true });

    let startDate = '';
    let endDate = '';

    if (selectedDateRange.value !== undefined) {
      startDate = moment(selectedDateRange.value.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endDate = moment(selectedDateRange.value.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    } else {
      startDate = moment(selectedDateRange.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endDate = moment(selectedDateRange.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    }

    try {
      const fetchMentionsResult = await customerAnalyticsActions.fetchMentions({ startTime: startDate, endTime: endDate }, interval, selectedSegment.id, appliedFilters);
      const data = [];
      const defaultValues = {};
      aggregatedThemeKeys.forEach((key) => {
        defaultValues[key] = 0;
      });
      let totalMentions = 0;
      Object.keys(fetchMentionsResult.data.Data).sort((a, b) => moment(a) - moment(b)).forEach((key) => {
        let period = key;
        if (interval === 'daily' || interval === 'weekly') {
          period = moment(key).format('D MMM');
        } else {
          period = moment(key).format('MMM YYYY');
        }
        let items = fetchMentionsResult.data.Data[key]
        Object.keys(items).forEach((key) => totalMentions += items[key]);

        data.push({ period, ...defaultValues, ...fetchMentionsResult.data.Data[key] });
      });

      this.setState({ data, totalMentions });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { windowDimensions, minimal, isLoadingThemes, colors } = this.props;
    const { width } = windowDimensions;
    const { selectedTab, selectedThemes, aggregatedThemeKeys, isLoading, data, interval, totalMentions } = this.state;

    const tabs = [{ label: 'Mentions', value: totalMentions, performance: 13.4 }];

    return (
      <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
        <Title title="Theme Mentions" subtitle="What are my customers&#39; talking about?" />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>
          <SummaryTabs tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} />
          {
            isLoading ? (
              <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              </div>
            ) : (
              <ComparisonChart
                data={data}
                onIntervalChange={this.onIntervalChange}
                dataKeys={selectedThemes}
                colors={colors}
                // title="X vs. 30 days ago"
                width={width}
                chartOptions={['line', 'bar', 'stacked']}
                defaultChartType="line"
                defaultInterval={interval}
              />
            )
          }
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderTop: '1px solid #dddddd', padding: 5 }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {
                !minimal ? (
                  <DateFilterOptions onChange={this.onDateFilterOptionChange} defaultOption="30" />
                ) : null
              }
              {
                isLoadingThemes ? (
                  <div style={{ backgroundColor: '#FFF', width: '100%', position: 'relative', textAlign: 'right', marginBottom: 20, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner spinnerColor="#002366" size={20} spinnerWidth={4} />
                  </div>
                ) : (
                  <CheckedMultiSelect onChange={this.onCheckedMultiSelectChange} options={aggregatedThemeKeys} defaultOptions={selectedThemes} />
                )
              }
            </div>
            {
              !minimal ? (
                <ActionButton text="Loyalty" icon="chevron_right" onClick={() => this.onGoTo('/analytics/loyalty-satisfaction')} />
              ) : null
            }
          </div>
        </div>
      </div>
    );
  }
}
