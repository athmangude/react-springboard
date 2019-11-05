/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import moment from 'moment';

import DateFilterOptions from '../DateFilterOptions';
import Title from '../Title';
import ScatterChart from '../ScatterChart';
import CheckedMultiSelect from '../CheckedMultiSelect';
import ActionButton from 'SharedComponents/action-button-styled';

const demoData = [{ name: 'food', frequency: 150, importance: 0.4 }, { name: 'staff', frequency: 98, importance: -0.4 }, { name: 'service', frequency: 86, importance: 0.8 }, { name: 'maintenance', frequency: 99, importance: -0.1 }, { name: 'price', frequency: 55, importance: -0.9 }, { name: 'menu', frequency: 65, importance: 0.7 }, { name: 'billing', frequency: 35, importance: -0.9 }, { name: 'it', frequency: 165, importance: 0.5 }];

export default class KDA extends PureComponent {
  static propTypes = {
    minimal: PropTypes.bool,
    isLoadingThemes: PropTypes.bool,
    themes: PropTypes.object,
    width: PropTypes.number,
    colors: PropTypes.array,
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    selectedSegment: PropTypes.object,
    selectedDateRange: PropTypes.object,
    appliedFilters: PropTypes.array,
    demoMode: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    const { themes } = props;
    const themeKeys = Object.keys(themes);
    this.state = {
      isLoadingKeyDriverAnalysis: false,
      selectedThemes: themeKeys,
      themeKeys,
      data: [],
      yReferenceLine: 0,
    };

    this.onCheckedMultiSelectChange = this.onCheckedMultiSelectChange.bind(this);
    this.fetchKeyDriverAnalysis = this.fetchKeyDriverAnalysis.bind(this);
  }

  componentDidMount() {
    this.fetchKeyDriverAnalysis();
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps;
    if (!newProps.demoMode) {
      this.fetchKeyDriverAnalysis();
    }

  }

  onCheckedMultiSelectChange(options) {
    this.setState({ selectedThemes: options });
  }

  async fetchKeyDriverAnalysis() {
    const { customerAnalyticsActions, selectedSegment, appliedFilters, EventHandler, selectedDateRange } = this.props;
    this.setState({ isLoadingKeyDriverAnalysis: true });

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
      const fetchKeyDriverAnalysisResult = await customerAnalyticsActions.fetchKeyDriverAnalysis({ startTime: startDate, endTime: endDate }, selectedSegment.id, appliedFilters);
      const data = fetchKeyDriverAnalysisResult.data.Data.map((record) => ({ name: record.theme, frequency: record.frequency, importance: record.importance === 'NaN' ? 0 : parseFloat((record.importance).toFixed(1)) }));
      const yReferenceLine = Math.max(...data.map((theme) => theme.frequency)) / 2;
      this.setState({ data, yReferenceLine });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingKeyDriverAnalysis: false });
    }
  }

  render() {
    const { minimal, width, colors, isLoadingThemes, demoMode } = this.props;
    const { selectedThemes, data: actualData, themeKeys, isLoadingKeyDriverAnalysis, yReferenceLine } = this.state;

    const data = demoMode ? demoData : actualData;

    return (
      <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
        <Title title="Themes Key Driver Analysis" subtitle="Which key themes are highly associated with my NPS Trend overtime?" help="A key driver analysis (KDA) allows you to identify what themes have the biggest impact on an outcome variable such as likelihood to recommend, brand attitudes, and UX quality." />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>
          {
            isLoadingKeyDriverAnalysis ? (
              <div style={{ backgroundColor: '#FFF', width: '100%', position: 'relative', textAlign: 'right', marginBottom: 20, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={20} spinnerWidth={4} />
              </div>
            ) : (
              <ScatterChart colors={colors} data={data.filter((record) => selectedThemes.includes(record.name))} dataKeys={selectedThemes} title="Frequency vs Importance" yAxis="frequency" xAxis="importance" bottomLeftLabel="Low Gain" bottomRightLabel="Fix" topLeftLabel="Maintain" topRightLabel="Leverage/Expand" width={width} chartOptions={['scatter']} defaultChartType="scatter" domain={[-1, 1]} xReferenceLine={0} yReferenceLine={yReferenceLine} />
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
                  <CheckedMultiSelect onChange={this.onCheckedMultiSelectChange} options={themeKeys} defaultOptions={selectedThemes} />
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
