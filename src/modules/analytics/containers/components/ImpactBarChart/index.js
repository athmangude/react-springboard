/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import moment from 'moment';

import DateFilterOptions from '../DateFilterOptions';
import Title from '../Title';
import ComparisonChart from '../ComparisonChart';
import CheckedMultiSelect from '../CheckedMultiSelect';
import ActionButton from 'SharedComponents/action-button-styled';

const demoData = [{ name: 'food', impact: 20 }, { name: 'hygiene', impact: -98 }, { name: 'service', impact: 86 }, { name: 'ambience', impact: 99 }, { name: 'pastries', impact: 0 }, { name: 'foreign_objects', impact: 10 }, { name: 'staff', impact: 40 }, { name: 'price', impact: -85 }, { name: 'menu', impact: 65 }, { name: 'speed', impact: -20 }, { name: 'drink', impact: 20 }, { name: 'billing', impact: -65 }, { name: 'it', impact: 65 }, { name: 'maintenance', impact: -40 }];

export default class Impact extends PureComponent {
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
      isLoadingImpact: false,
      selectedThemes: themeKeys,
      themeKeys,
      data: [],
    };

    this.onCheckedMultiSelectChange = this.onCheckedMultiSelectChange.bind(this);
    this.fetchImpact = this.fetchImpact.bind(this);
  }

  componentDidMount() {
    this.fetchImpact();
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps;
    if (!newProps.demoMode) {
      this.fetchImpact();
    }
  }

  onCheckedMultiSelectChange(options) {
    this.setState({ selectedThemes: options });
  }

  async fetchImpact() {
    const { customerAnalyticsActions, selectedSegment, EventHandler, selectedDateRange, appliedFilters } = this.props;
    this.setState({ isLoadingImpact: true });

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
      const fetchImpactResult = await customerAnalyticsActions.fetchImpact({ startTime: startDate, endTime: endDate }, selectedSegment.id, appliedFilters);
      const data = Object.keys(fetchImpactResult.data.Data).map((key) => ({ name: key, impact: Number.isNaN(parseInt(fetchImpactResult.data.Data[key], 10)) ? 0 : fetchImpactResult.data.Data[key] }));
      this.setState({ data });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingImpact: false });
    }
  }

  render() {
    const { minimal, width, colors, isLoadingThemes , demoMode} = this.props;
    const { selectedThemes, data: actualData, themeKeys, isLoadingImpact } = this.state;
    const help = (
      <span>
        The impact of theme
        &nbsp;
        <i>i</i>
        &nbsp;
        is calculated by getting the difference between the overall NPS
        &nbsp;
        <i>
          ( NPS
          <sub>T</sub>
          &nbsp;)
        </i>
        &nbsp;and the NPS without theme
        &nbsp;
        <i>i</i>
        &nbsp;
        <i>
          (&nbsp;NPS
          <sub>T-i</sub>
          &nbsp;)
        </i>
        &nbsp;i.e&nbsp;
        <i>
          NPS
          <sub>T</sub>
          &nbsp;-&nbsp;
          NPS
          <sub>T-i</sub>
        </i>
      </span>
    );

    const data = demoMode ? demoData : actualData;

    return (
      <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
        <Title title="Themes Impact" subtitle="What’s the impact of each key theme on my overall NPS?" help={help} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>
          {
            isLoadingImpact ? (
              <div style={{ backgroundColor: '#FFF', width: '100%', position: 'relative', textAlign: 'right', marginBottom: 20, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={20} spinnerWidth={4} />
              </div>
            ) : (
              <ComparisonChart colors={colors} data={data} dataKeys={selectedThemes} title="" yAxis="impact" width={width} chartOptions={['bar']} defaultChartType="bar" hideInterval nonLinear />
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
