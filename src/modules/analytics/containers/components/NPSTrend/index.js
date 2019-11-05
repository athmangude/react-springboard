/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import moment from 'moment';

import SummaryTabs from '../SummaryTabs';
import Title from '../Title';
import ComparisonChart from '../ComparisonChart';
import DateFilterOptions from '../DateFilterOptions';
import SidePanel from '../SidePanel';
import ComparisonFilters from '../ComparisonFilters';
import ActionButton from 'SharedComponents/action-button-styled';

const demoData = [{ period: '1 Dec', current: 40, previous: 24, benchmark: 30 }, { period: '2 Dec', current: 30, previous: 13, benchmark: 30 }, { period: '3 Dec', current: 20, previous: 98, benchmark: 30 }, { period: '4 Dec', current: 27, previous: 39, benchmark: 30 }, { period: '5 Dec', current: 18, previous: 48, benchmark: 30 }, { period: '6 Dec', current: 23, previous: 38, benchmark: 30 }, { period: '7 Dec', current: 34, previous: 43, benchmark: 30 }, { period: '8 Dec', current: 40, previous: 24, benchmark: 30 }, { period: '9 Dec', current: 30, previous: 13, benchmark: 30 }, { period: '10 Dec', current: 20, previous: 98, benchmark: 30 }, { period: '11 Dec', current: 27, previous: 39, benchmark: 30 }, { period: '12 Dec', current: 18, previous: 48, benchmark: 30 }, { period: '13 Dec', current: 23, previous: 38, benchmark: 30 }, { period: '14 Dec', current: 34, previous: 43, benchmark: 30 }];

export default class NPSTrend extends PureComponent {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    windowDimensions: PropTypes.object,
    compare: PropTypes.bool,
    selectedDateRange: PropTypes.object,
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    selectedSegment: PropTypes.object,
    appliedFilters: PropTypes.array,
    demoMode: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.onTabSelected = this.onTabSelected.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onCompare = this.onCompare.bind(this);
    this.onIntervalChange = this.onIntervalChange.bind(this);
    this.fetchNPSTrend = this.fetchNPSTrend.bind(this);
    this.onGoTo = this.onGoTo.bind(this);
  }

  state = {
    selectedTab: 'NPS',
    showSidePanel: false,
    comparisonFilters: [],
    isLoading: false,
    data: [],
    interval: 'daily',
    totalPromoters: 0,
    totalPassives: 0,
    totalDetractors: 0,
    averageNPS: 0,
  }

  componentDidMount() {
    this.fetchNPSTrend();
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps;
    this.fetchNPSTrend();
    // const { appliedFilters: newAppliedFilters, selectedSegment: newSelectedSegment, selectedDateRange: newSelectedDateRange } = newProps;
    // const { appliedFilters, selectedSegment, selectedDateRange } = this.props;
    // if (JSON.stringify(newAppliedFilters) !== JSON.stringify(appliedFilters) || newSelectedSegment.id !== selectedSegment.id || JSON.stringify(newSelectedDateRange) !== JSON.stringify(selectedDateRange)) {
    //   this.fetchNPSTrend();
    // }
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
    this.setState({ interval }, () => this.fetchNPSTrend());
  }

  onGoTo() {
    const { router } = this.context;

    router.history.push('/analytics/loyalty-satisfaction');
  }

  async fetchNPSTrend() {
    const { customerAnalyticsActions, EventHandler, selectedDateRange, selectedSegment, appliedFilters } = this.props;
    const { interval } = this.state;
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
      const fetchNPSTrendResult = await customerAnalyticsActions.fetchNPSTrend({ startTime: startDate, endTime: endDate }, interval, selectedSegment.id, appliedFilters);
      const data = [];
      let totalPromoters = 0;
      let totalPassives = 0;
      let totalDetractors = 0;

      Object.keys(fetchNPSTrendResult.data.Data).sort((a, b) => moment(a) - moment(b)).forEach((key) => {
        let period = key;
        const delta = (Math.random() * (1 - 0) + -1.8).toFixed(0);
        if (interval === 'daily' || interval === 'weekly') {
          period = moment(key).format('D MMM');
        } else {
          period = moment(key).format('MMM YYYY');
        }
        
        totalPromoters += fetchNPSTrendResult.data.Data[key].promoters;
        totalPassives += fetchNPSTrendResult.data.Data[key].passives;
        totalDetractors += fetchNPSTrendResult.data.Data[key].detractors;

        const current = Math.floor((fetchNPSTrendResult.data.Data[key].promoters - fetchNPSTrendResult.data.Data[key].detractors) / (fetchNPSTrendResult.data.Data[key].promoters + fetchNPSTrendResult.data.Data[key].passives + fetchNPSTrendResult.data.Data[key].detractors) * 100);
        data.push({
          period,
          current,
          // previous: current + (delta * 10),
          // benchmark: 50
        });
      });

      const averageNPS = Math.floor(((totalPromoters - totalPassives) / (totalPassives + totalPromoters + totalDetractors)) * 100);

      this.setState({ data, totalPromoters, totalDetractors, totalPassives, averageNPS });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { windowDimensions, compare, demoMode, showFooterActions } = this.props;
    const { width } = windowDimensions;
    const { selectedTab, showSidePanel, isLoading, data: actualData, comparisonFilters, interval, totalDetractors, totalPassives, totalPromoters, averageNPS } = this.state;
    const data = demoMode ? demoData : actualData;

    const tabs = [
      { label: 'NPS', value: averageNPS, performance: 2.7 },
      { label: 'Promoters', value: totalPromoters, performance: 8.1 },
      { label: 'Passives', value: totalPassives, performance: -0.7 },
      { label: 'Detractors', value: totalDetractors, performance: 1.6 }
    ];

    return (
      <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
        <Title title="Net Promoter Score" subtitle="How is my Net Promoter Score trending over time?" />
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
                // benchmark
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
                  <ActionButton text="Loyalty & Satisfication" icon="chevron_right" onClick={() => this.onGoTo()} />
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
