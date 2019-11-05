/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import moment from 'moment';

import DateFilterOptions from '../DateFilterOptions';
import Title from '../Title';
import RadarChart from '../RadarChart';
import CheckedMultiSelect from '../CheckedMultiSelect';
import ActionButton from 'SharedComponents/action-button-styled';

const demoData = [{ theme: 'billing', nps: -20, fullMark: 100 }, { theme: 'drink', nps: 98, fullMark: 100 }, { theme: 'food', nps: 86, fullMark: 100 }, { theme: 'foreign_objects', nps: 99, fullMark: 100 }, { theme: 'hygiene', nps: 85, fullMark: 100 }, { theme: 'maintenance', nps: 65, fullMark: 100 }, { theme: 'menu', nps: 55, fullMark: 100 }, { theme: 'it', nps: 65, fullMark: 100 }, { theme: 'pastries', nps: 65, fullMark: 100 }, { theme: 'price', nps: 75, fullMark: 100 }, { theme: 'service', nps: 25, fullMark: 100 }, { theme: 'staff', nps: 15, fullMark: 100 }];

export default class Impact extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    minimal: PropTypes.bool,
    themes: PropTypes.object,
    isLoadingThemes: PropTypes.bool,
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    selectedSegment: PropTypes.object,
    selectedDateRange: PropTypes.object,
    appliedFilters: PropTypes.array,
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
      isLoadingImpact: false,
      selectedThemes,
      aggregatedThemeKeys,
      data: [],
    };

    this.onCheckedMultiSelectChange = this.onCheckedMultiSelectChange.bind(this);
    this.fetchImpact = this.fetchImpact.bind(this);
    this.onGoTo = this.onGoTo.bind(this);
  }

  componentDidMount() {
    this.fetchImpact();
  }

  componentWillReceiveProps(newProps) {
    const { themes } = newProps;
    const { aggregatedThemeKeys: oldAggreagatedThemeKeys } = this.state;
    const themeKeys = Object.keys(themes);
    const aggregatedThemeKeys = themeKeys
      .map((theme) => ({ theme, total: parseInt(themes[theme], 10) + parseInt(themes[theme], 10) + parseInt(themes[theme], 10) }))
      .sort((a, b) => b.total - a.total)
      .map((theme) => theme.theme);

    if (aggregatedThemeKeys !== oldAggreagatedThemeKeys) {
      const selectedThemes = aggregatedThemeKeys.slice(0, 5);
      this.setState({ selectedThemes, aggregatedThemeKeys }, () => this.fetchImpact());
    }
  }

  onCheckedMultiSelectChange(options) {
    this.setState({ selectedThemes: options });
  }

  onGoTo() {
    const { router } = this.context;

    router.history.push('/analytics/loyalty-satisfaction');
  }

  async fetchImpact() {
    const { customerAnalyticsActions, selectedDateRange, selectedSegment, appliedFilters, EventHandler } = this.props;
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
      const data = [];
      Object.keys(fetchImpactResult.data.Data).forEach((key) => {
        data.push({ theme: key, nps: Number.isNaN(parseInt(fetchImpactResult.data.Data[key], 10)) ? 0 : fetchImpactResult.data.Data[key] });
      });
      this.setState({ data });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingImpact: false });
    }
  }

  render() {
    const { minimal, isLoadingThemes, demoMode, showFooterActions } = this.props;
    const { selectedThemes, isLoadingImpact, aggregatedThemeKeys, data: actualData } = this.state;
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
                <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              </div>
            ) : data.length ? (
              <RadarChart data={data} nodes={selectedThemes} />
            ) : (
              <div style={{ backgroundColor: '#FFF', width: '100%', position: 'relative', textAlign: 'right', marginBottom: 20, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                No impact data found
              </div>
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
              showFooterActions ? (
                <ActionButton text="Loyalty & Satisfaction" icon="chevron_right" onClick={() => this.onGoTo('/analytics/loyalty-satisfaction')} />
              ) : null
            }
          </div>
        </div>
      </div>
    );
  }
}
