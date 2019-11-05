/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import moment from 'moment';

import SummaryTabs from '../SummaryTabs';
import ComparisonChart from '../ComparisonChart';
import DateFilterOptions from '../DateFilterOptions';
import SidePanel from '../SidePanel';
import ComparisonFilters from '../ComparisonFilters';
import Title from '../Title';
import ActionButton from 'SharedComponents/action-button-styled';

const demoData = [{ period: '1 Dec', current: 40000, previous: 24000 }, { period: '2 Dec', current: 30000, previous: 13000 }, { period: '3 Dec', current: 20000, previous: 98000 }, { period: '4 Dec', current: 27000, previous: 39000 }, { period: '5 Dec', current: 18000, previous: 48000 }, { period: '6 Dec', current: 23000, previous: 38000 }, { period: '7 Dec', current: 34000, previous: 43000 }, { period: '8 Dec', current: 40000, previous: 24000 }, { period: '9 Dec', current: 30000, previous: 13000 }, { period: '10 Dec', current: 20000, previous: 98000 }, { period: '11 Dec', current: 27000, previous: 39000 }, { period: '12 Dec', current: 18000, previous: 48000 }, { period: '13 Dec', current: 23000, previous: 38000 }, { period: '14 Dec', current: 34000, previous: 43000 }];

export default class Spend extends PureComponent {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    windowDimensions: PropTypes.object,
    compare: PropTypes.bool,
    selectedDateRange: PropTypes.object.isRequired,
    selectedSegment: PropTypes.object.isRequired,
    appliedFilters: PropTypes.array,
    demoMode: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.onTabSelected = this.onTabSelected.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onCompare = this.onCompare.bind(this);
    this.onIntervalChange = this.onIntervalChange.bind(this);
    this.onFetchSpendOverview = this.onFetchSpendOverview.bind(this);
    this.onGoTo = this.onGoTo.bind(this);
  }

  state = {
    selectedTab: 'All Customers',
    showSidePanel: false,
    comparisonFilters: [],
    totalValue: 0,
    interval: 'daily',
    isLoadingSpendOverview: false,
    data: [],
  }

  componentDidMount() {
    this.onFetchSpendOverview();
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps;
    if (!newProps.demoMode) {
      this.onFetchSpendOverview();
    }
  }

  onGoTo() {
    const { router } = this.context;

    router.history.push('/analytics/spend');
  }

  onCompare() {
    this.setState({ showSidePanel: true });
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false });
  }

  onIntervalChange(interval) {
    this.setState({ interval }, () => this.onFetchSpendOverview());
  }

  async onFetchSpendOverview() {
    const { customerAnalyticsActions, EventHandler, selectedDateRange, selectedSegment, appliedFilters } = this.props;
    const { interval } = this.state;
    this.setState({ isLoadingSpendOverview: true });

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
      const fetchSpendOverviewResult = await customerAnalyticsActions.fetchSpendOverview({ startTime: startDate, endTime: endDate }, interval, selectedSegment.id, appliedFilters);
      const data = [];
      let totalValue = 0;

      Object.keys(fetchSpendOverviewResult.data.Data)
      .sort((a, b) => moment(a) - moment(b))
      .forEach((key) => {
        let period = key;
        // const delta = (Math.random() * (1 - 0) + -1.8).toFixed(0);
        if (interval === 'daily' || interval === 'weekly') {
          period = moment(key).format('D MMM');
        } else {
          period = moment(key).format('MMM YYYY');
        }
        const current = fetchSpendOverviewResult.data.Data[key];
        totalValue += fetchSpendOverviewResult.data.Data[key];
        data.push({ period, current });
      });

      this.setState({ data, totalValue});
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingSpendOverview: false });
    }
  }

  render() {
    const { windowDimensions, compare, selectedDateRange, demoMode, showFooterActions } = this.props;
    const { width } = windowDimensions;
    const { selectedTab, showSidePanel, comparisonFilters, data: actualData, isLoadingSpendOverview, interval, totalValue } = this.state;
    const data = demoMode ? demoData : actualData;

    const tabs = [
      { label: 'All Customers', value: totalValue, performance: -0.3 },
      // { label: 'Repeat Customers', value: 5400000, performance: 6.3 },
      // { label: 'New Customers', value: 400000, performance: -1.3 }
    ];

    return (
      <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
        <Title title="Spend Over Time" subtitle="How much are my customers spending over time?" />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10, position: 'relative' }}>
          {
            isLoadingSpendOverview ? (
              <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              </div>
            ) : (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <SummaryTabs tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} />
                <ComparisonChart
                  data={data}
                  onIntervalChange={this.onIntervalChange}
                  // title={`X vs. ${selectedDateRange.label}`}
                  width={width} 
                  chartOptions={['line', 'bar']}
                  defaultChartType="line"
                  defaultInterval={interval}
                />
              </div>
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
          <SidePanel component={showSidePanel ? (<ComparisonFilters appliedFilters={JSON.stringify(comparisonFilters)} onCloseSidePanel={this.onCloseSidePanel} windowDimensions={windowDimensions} applyFilters={this.onApplyComparisonFilters} />) : null} />
        </div>
      </div>
    );
  }
}
