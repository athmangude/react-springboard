/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline, no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';
import Spinner from 'react-spinner-material';

import Themes from '../Themes';
import ImpactGraph from './Graph';

export default class Impact extends Component {
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
      isLoadingImpact: false,
      selectedThemes,
      data: [],
      appliedFilters,
      startDate,
      endDate,
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.fetchImpact();
  }

  componentWillReceiveProps(newProps) {
    const { appliedFilters, startDate, endDate } = this.props;
    if (JSON.stringify(appliedFilters) !== JSON.stringify(newProps.appliedFilters) || startDate !== newProps.startDate || endDate !== newProps.endDate) {
      this.setState({ appliedFilters: newProps.appliedFilters, startDate: newProps.startDate, endDate: newProps.endDate }, () => this.fetchImpact());
    }
  }

  onChange(selectedThemes) {
    this.setState({ selectedThemes });
  }

  async fetchImpact() {
    const { customerAnalyticsActions, activeSegment, EventHandler } = this.props;
    const { appliedFilters, startDate, endDate } = this.state;
    this.setState({ isLoadingImpact: true });

    try {
      const fetchImpactResult = await customerAnalyticsActions.fetchImpact({ startTime: startDate, endTime: endDate }, activeSegment, appliedFilters);
      const data = [];
      Object.keys(fetchImpactResult.data.Data).forEach((key) => {
        data.push({ name: key, percentage: Number.isNaN(parseInt(fetchImpactResult.data.Data[key], 10)) ? 0 : fetchImpactResult.data.Data[key] });
      });
      this.setState({ data });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingImpact: false });
    }
  }

  render() {
    const { themes, colors, alertActions, width } = this.props;
    const { selectedThemes, isLoadingImpact, data } = this.state;

    return (
      <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
          <div style={{ width: '100%', fontSize: 18, fontWeight: 100, lineHeight: 1.78, color: '#434656' }}>
            <span style={{ fontSize: 20, fontWeight: 900, marginRight: 5 }}>Themes</span>
            &nbsp;Impact
          </div>
          <Themes themes={themes} selectedThemes={selectedThemes} colors={colors} onChange={this.onChange} alertActions={alertActions} />
          <div style={{ width: '100%', paddingTop: 20 }}>
            {
              isLoadingImpact ? (
                <div style={{ backgroundColor: '#FFF', width: '100%', position: 'relative', textAlign: 'right', marginBottom: 20, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
                </div>
              ) : !data.filter((record) => record.percentage !== 0).length ? (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 }}>No data to display</div>
              ) : (
                <ImpactGraph data={data} themes={selectedThemes} colors={colors} width={width} />
              )
            }
          </div>
        </div>
      </Col>
    );
  }
}
