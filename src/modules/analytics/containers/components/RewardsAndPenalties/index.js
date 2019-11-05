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

const demoData = [{ name: 'food', percentagePromoters: 50, percentageDetractors: 10 }, { name: 'hygiene', percentagePromoters: 98, percentageDetractors: 40 }, { name: 'service', percentagePromoters: 20, percentageDetractors: 30 }, { name: 'ambience', percentagePromoters: 60, percentageDetractors: 90 }, { name: 'price', percentagePromoters: 80, percentageDetractors: 80 }, { name: 'menu', percentagePromoters: 30, percentageDetractors: 40 }, { name: 'billing', percentagePromoters: 40, percentageDetractors: 10 }, { name: 'IT', percentagePromoters: 65, percentageDetractors: 50 }];

export default class RewardsAndPenalties extends PureComponent {
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
      isLoadingRewardsAndPenalties: false,
      selectedThemes: themeKeys,
      themeKeys,
      data: [],
    };

    this.onCheckedMultiSelectChange = this.onCheckedMultiSelectChange.bind(this);
    this.fetchRewardsAndPenalties = this.fetchRewardsAndPenalties.bind(this);
  }

  componentDidMount() {
    this.fetchRewardsAndPenalties();
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps;
    if (!newProps.demoMode) {
      this.fetchRewardsAndPenalties();
    }
  }

  onCheckedMultiSelectChange(options) {
    this.setState({ selectedThemes: options });
  }

  async fetchRewardsAndPenalties() {
    const { customerAnalyticsActions, selectedSegment, appliedFilters, EventHandler, selectedDateRange } = this.props;
    this.setState({ isLoadingRewardsAndPenalties: true });

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
      const fetchRewardsAndPenaltiesResult = await customerAnalyticsActions.fetchRewardsAndPenalties({ startTime: startDate, endTime: endDate }, selectedSegment.id, appliedFilters);
      const data = fetchRewardsAndPenaltiesResult.data.Data
        .map((record) => {
          const total = parseInt(record.promoters, 10) + parseInt(record.passives, 10) + parseInt(record.detractors, 10);
          const percentagePromoters = parseFloat((parseInt(record.promoters, 10) / total * 100).toFixed(1));
          const percentageDetractors = parseFloat((parseInt(record.detractors, 10) / total * 100).toFixed(1));
          return { name: record.theme, percentagePromoters, percentageDetractors };
        });
      this.setState({ data });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingRewardsAndPenalties: false });
    }
  }

  render() {
    const { minimal, width, colors, isLoadingThemes, demoMode } = this.props;
    const { selectedThemes, data: actualData, isLoadingRewardsAndPenalties, themeKeys } = this.state;

    const data = demoMode ? demoData : actualData;

    return (
      <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
        <Title title="Rewards and Penalties" subtitle="Which themes lead to customers rewarding or penalizing us when giving feedback?" help="Rewards and Penalties provides deeper insights into themtic areas where customers are rewarding or punishing a business. It is calculated by taking the aggregate proportion of Detractors versus the aggregate proportion of Promoters. Themes that have higher Detractor proportions are sources of penalization, while those with higher Promoter proportions are reward areas." />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>
          {
            isLoadingRewardsAndPenalties ? (
              <div style={{ backgroundColor: '#FFF', width: '100%', position: 'relative', textAlign: 'right', marginBottom: 20, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={20} spinnerWidth={4} />
              </div>
            ) : (
              <ScatterChart colors={colors} data={data.filter((record) => selectedThemes.includes(record.name))} dataKeys={selectedThemes} title="Percentage Promoters vs. Percentage Detractors" yAxis="percentagePromoters" xAxis="percentageDetractors" bottomRightLabel="Penalize" topLeftLabel="Reward" width={width} chartOptions={['scatter']} defaultChartType="scatter" domain={[0, 100]} diagonalSeparator />
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
