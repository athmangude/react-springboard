/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Spinner from 'react-spinner-material';

import SummaryTabs from '../SummaryTabs';
import ComparisonChart from '../ComparisonChart';
import DateFilterOptions from '../DateFilterOptions';
import SidePanel from '../SidePanel';
import ComparisonFilters from '../ComparisonFilters';
import Title from '../Title';
import ActionButton from 'SharedComponents/action-button-styled';

const demoData = [{ period: '1 Dec', current: 4000, previous: 2400, rangeDays: 30 }, { period: '2 Dec', current: 3000, previous: 1398, rangeDays: 30 }, { period: '3 Dec', current: 2000, previous: 9800, rangeDays: 30 }, { period: '4 Dec', current: 2780, previous: 3908, rangeDays: 30 }, { period: '5 Dec', current: 1890, previous: 4800, rangeDays: 30 }, { period: '6 Dec', current: 2390, previous: 3800, rangeDays: 30 }, { period: '7 Dec', current: 3490, previous: 4300, rangeDays: 30 }, { period: '8 Dec', current: 4000, previous: 2400, rangeDays: 30 }, { period: '9 Dec', current: 3000, previous: 1398, rangeDays: 30 }, { period: '10 Dec', current: 2000, previous: 9800, rangeDays: 30 }, { period: '11 Dec', current: 2780, previous: 3908, rangeDays: 30 }, { period: '12 Dec', current: 1890, previous: 4800, rangeDays: 30 }, { period: '13 Dec', current: 2390, previous: 3800, rangeDays: 30 }, { period: '14 Dec', current: 3490, previous: 4300, rangeDays: 30 }];

export default class Behaviour extends PureComponent {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    windowDimensions: PropTypes.object,
    compare: PropTypes.bool,
    customerAnalyticsActions: PropTypes.object,
    selectedSegment: PropTypes.object,
    appliedFilters: PropTypes.object,
    selectedDateRange: PropTypes.object,
    demoMode: PropTypes.bool,
    EventHandler: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onTabSelected = this.onTabSelected.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onCompare = this.onCompare.bind(this);
    this.onIntervalChange = this.onIntervalChange.bind(this);
    this.fetchBehaviourTrend = this.fetchBehaviourTrend.bind(this);
    this.onGoTo = this.onGoTo.bind(this);
  }

  state = {
    selectedTab: 'All Interactions',
    showSidePanel: false,
    comparisonFilters: [],
    isLoadingBehaviourTrend: false,
    data: [],
    totalInteractions: 0,
    interval: 'daily',
  }

  componentDidMount() {
    this.fetchBehaviourTrend();
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps;
    if (!newProps.demoMode) {
      this.fetchBehaviourTrend();
    }
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  onCompare() {
    this.setState({ showSidePanel: true });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false });
  }

  onIntervalChange(interval) {
    this.setState({ interval }, () => this.fetchBehaviourTrend());
  }

  onGoTo() {
    const { router } = this.context;

    router.history.push('/analytics/behaviour');
  }

  async fetchBehaviourTrend() {
    const { customerAnalyticsActions, selectedDateRange, selectedSegment, appliedFilters, EventHandler } = this.props;
    const { interval } = this.state;
    this.setState({ isLoadingBehaviourTrend: true });

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
      const fetchBehaviourTrendResult = await customerAnalyticsActions.fetchBehaviourOverview({ startTime: startDate, endTime: endDate }, interval, selectedSegment.id, appliedFilters);
      const data = [];
      let totalInteractions = 0;
      Object.keys(fetchBehaviourTrendResult.data.Data)
      .sort((a, b) => moment(a) - moment(b))
      .forEach((key) => {
        let period = key;
        // const delta = (Math.random() * (1 - 0) + -1.8).toFixed(0);
        if (interval === 'daily' || interval === 'weekly') {
          period = moment(key).format('D MMM');
        } else {
          period = moment(key).format('MMM YYYY');
        }
        const current = fetchBehaviourTrendResult.data.Data[key].all;
        totalInteractions += fetchBehaviourTrendResult.data.Data[key].all;
        data.push({ period, current });
      });
      this.setState({ data, totalInteractions });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingBehaviourTrend: false });
    }
  }

  render() {
    const { windowDimensions, compare, demoMode, showFooterActions } = this.props;
    const { width } = windowDimensions;
    const { selectedTab, data: actualData, isLoadingBehaviourTrend, showSidePanel, comparisonFilters, interval, totalInteractions } = this.state;
    
    const tabs = [
      { label: 'All Interactions', value: totalInteractions, performance: 1.2 }, 
      // { label: 'Repeat Customers', value: 15400, performance: 6.3 },
      // { label: 'New Customers', value: 4000, performance: -1.3 }
    ];

    const data = demoMode ? demoData : actualData;

    return (
      <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
        <Title title="Interactions Over Time" subtitle="How are my customers interacting with my business over time?" />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>
          <SummaryTabs tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} />
          {
            isLoadingBehaviourTrend ? (
              <div style={{ backgroundColor: '#FFF', width: '100%', position: 'relative', textAlign: 'right', marginBottom: 20, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={20} spinnerWidth={2} />
              </div>
            ) : (
              <ComparisonChart
                data={data}
                onIntervalChange={this.onIntervalChange}
                // title="X vs. 30 days ago"
                width={width}
                chartOptions={['line', 'bar']}
                defaultChartType="line"
                defaultInterval={interval}
              />
            )
          }
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: compare ? 'flex-end' : 'space-between', borderTop: '1px solid #dddddd', padding: 5 }}>
            {
              showFooterActions ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                  {/* <DateFilterOptions onChange={this.onDateFilterOptionChange} defaultOption="30" /> */}
                  <ActionButton text="Spend" icon="chevron_right" onClick={() => this.onGoTo()} />
                </div>
              ) : null
            }
          </div>
          {/* <SidePanel component={showSidePanel ? (<ComparisonFilters appliedFilters={JSON.stringify(comparisonFilters)} onCloseSidePanel={this.onCloseSidePanel} windowDimensions={windowDimensions} applyFilters={this.onApplyComparisonFilters} />) : null} /> */}
        </div>
      </div>
    );
  }
}
