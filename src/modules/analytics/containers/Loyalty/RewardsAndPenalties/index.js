/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';
import Spinner from 'react-spinner-material';

import RewardsAndPenaltiesGraph from './Graph';
import Themes from '../Themes';

export default class RewardsAndPenalties extends Component {
  static propTypes = {
    themes: PropTypes.object,
    width: PropTypes.number,
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
      isLoadingRewardsAndPenalties: false,
      selectedThemes,
      data: [],
      appliedFilters,
      startDate,
      endDate,
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.fetchRewardsAndPenalties();
  }

  componentWillReceiveProps(newProps) {
    const { appliedFilters, startDate, endDate } = this.props;
    if (JSON.stringify(appliedFilters) !== JSON.stringify(newProps.appliedFilters) || startDate !== newProps.startDate || endDate !== newProps.endDate) {
      this.setState({ appliedFilters: newProps.appliedFilters, startDate: newProps.startDate, endDate: newProps.endDate }, () => this.fetchRewardsAndPenalties());
    }
  }

  onChange(selectedThemes) {
    this.setState({ selectedThemes });
  }

  async fetchRewardsAndPenalties() {
    const { customerAnalyticsActions, activeSegment, EventHandler } = this.props;
    const { appliedFilters, startDate, endDate } = this.state;
    this.setState({ isLoadingRewardsAndPenalties: true });

    try {
      const fetchRewardsAndPenaltiesResult = await customerAnalyticsActions.fetchRewardsAndPenalties({ startTime: startDate, endTime: endDate }, activeSegment, appliedFilters);
      this.setState({ data: fetchRewardsAndPenaltiesResult.data.Data });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingRewardsAndPenalties: false });
    }
  }

  render() {
    const { themes, colors, alertActions, width } = this.props;
    const { selectedThemes, data, isLoadingRewardsAndPenalties } = this.state;
    return (
      <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: width > 425 ? '0 10px 0 10px' : 0, borderRadius: 8 }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
          <div style={{ width: '100%', fontSize: 18, fontWeight: 100, lineHeight: 1.78, color: '#434656' }}>
            <span style={{ fontSize: 20, fontWeight: 900, marginRight: 5 }}>Themes</span>
            &nbsp;Rewards and Penalties
          </div>
          <Themes themes={themes} selectedThemes={selectedThemes} colors={colors} onChange={this.onChange} alertActions={alertActions} />
          <div style={{ width: '100%', paddingTop: 20 }}>
            {
              isLoadingRewardsAndPenalties ? (
                <div style={{ backgroundColor: '#FFF', width: '100%', position: 'relative', textAlign: 'right', marginBottom: 20, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
                </div>
              ) : !data.filter((record) => parseInt(record.promoters + record.passives + record.detractors, 10) !== 0).length ? (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 }}>No data to display</div>
              ) : (
                <RewardsAndPenaltiesGraph data={data} themes={selectedThemes} colors={colors} width={width} />
              )
            }
          </div>
        </div>
      </Col>
    );
  }
}
