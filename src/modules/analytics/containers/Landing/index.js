/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { XMasonry, XBlock } from 'react-xmasonry/dist/index';
import moment from 'moment';

import Locations from '../components/Locations';
import NPSTrend from '../components/NPSTrend';
import NPS from '../components/NPS';
import Impact from '../components/ImpactRadarChart';
import Spend from '../components/Spend';
import Target from '../components/Target';
import TargetDistribution from '../components/TargetDistribution';
import Behaviour from '../components/Behaviour';
import Demographic from '../components/Demographic';
import Mentions from '../components/Mentions';
import * as customerAnalyticsActions from '../flux/actions';
import * as appActions from 'Modules/voc/containers/App/flux/actions';
import './index.css';

const target = { title: 'Financial Target', subtitle: 'What is my monthly target?', name: 'Target', value: 9400000, valueContextLeft: 'KES', raised: 7010000, icon: 'gps_fixed' };
const targetData = [
  { name: 'raised', amount: target.raised },
  { name: 'remaining', amount: target.value - target.raised },
];
const targetDistribution = { title: 'NPS Group Contribution', subtitle: 'How are my NPS groups contributing to my spend?', name: 'Raised', value: 9400000, valueContextLeft: 'KES', current: 7010000, icon: 'data_usage' };
const targetDistributionData = [
  { name: 'promoter', value: 400 },
  { name: 'passive', value: 300 },
  { name: 'detractor', value: 300 },
];

@connect(() => ({}),
  (dispatch) => ({
    customerAnalyticsActions: bindActionCreators(customerAnalyticsActions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
    dispatch,
  }))

export default class Landing extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object,
    appActions: PropTypes.object,
    windowDimensions: PropTypes.object,
    customerAnalyticsActions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.fetchThemes = this.fetchThemes.bind(this);
    this.fetchDemographics = this.fetchDemographics.bind(this);
  }

  state = {
    isLoadingThemes: false,
    selectedSegment: {},
    appliedFilters: [],
    selectedDateRange: {
      key: 4, label: 'Last 60 Days', value: { from: moment().subtract(60, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), to: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'), label: 'Last 60 Days' },
    },
    themes: {},
    isLoadingDemographics: false,
    demographics: {},
  }

  componentDidMount() {
    const { appActions } = this.props;
    appActions.setRouteTitle('Analytics');
    this.fetchThemes();
    this.fetchDemographics();
  }

  componentWillUnmount() {
    const { appActions } = this.props;
    appActions.unsetRouteTitle();
  }

  async fetchThemes() {
    const { customerAnalyticsActions, EventHandler } = this.props;
    const { selectedSegment, selectedDateRange, appliedFilters } = this.state;
    this.setState({ isLoadingThemes: true });

    try {
      const fetchThemesResult = await customerAnalyticsActions.fetchThemes({ startTime: null, endTime: null }, selectedSegment.id, appliedFilters);
      this.setState({ themes: fetchThemesResult.data.Data });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingThemes: false });
    }
  }

  async fetchDemographics() {
    const { customerAnalyticsActions, EventHandler } = this.props;
    const { selectedDateRange, selectedSegment, appliedFilters } = this.state;

    let startDate = '';
    let endDate = '';

    if (selectedDateRange.value !== undefined) {
      startDate = moment(selectedDateRange.value.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endDate = moment(selectedDateRange.value.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    } else {
      startDate = moment(selectedDateRange.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endDate = moment(selectedDateRange.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    }

    this.setState({ isLoadingDemographics: true });

    try {
      const fetchDemographicsResult = await customerAnalyticsActions.fetchDemographics({ startDate, endDate }, selectedSegment.id, appliedFilters);
      this.setState({ demographics: Object.keys(fetchDemographicsResult.data.Data).length ? fetchDemographicsResult.data.Data : {} });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingDemographics: false });
    }
  }

  render() {
    const { windowDimensions, alertActions, EventHandler, customerAnalyticsActions } = this.props;
    const { width } = windowDimensions;
    const { isLoadingThemes, themes, selectedDateRange, spendOverTime, isLoadingSpendOverview, isLoadingDemographics, demographics, appliedFilters, selectedSegment } = this.state;

    return (
      <div id="ca-landing">
        <div style={{ width: '100%' }}>
          <XMasonry>
            <XBlock key="nps-trend" width={3}>
              <NPSTrend selectedDateRange={selectedDateRange} appliedFilters={appliedFilters} selectedSegment={selectedSegment} themes={themes} isLoadingThemes={isLoadingThemes} customerAnalyticsActions={customerAnalyticsActions} windowDimensions={windowDimensions} EventHandler={EventHandler} alertActions={alertActions} />
            </XBlock>
            <XBlock key="nps" width={2}>
              <NPS selectedDateRange={selectedDateRange} appliedFilters={appliedFilters} selectedSegment={selectedSegment} themes={themes} isLoadingThemes={isLoadingThemes} customerAnalyticsActions={customerAnalyticsActions} windowDimensions={windowDimensions} EventHandler={EventHandler} alertActions={alertActions} />
            </XBlock>
            {/*
          </XMasonry>
        </div>
        <div style={{ width: '100%' }}>
          <XMasonry>
          */}
            <XBlock key="spend" width={3}>
              <Spend selectedDateRange={selectedDateRange} appliedFilters={appliedFilters} selectedSegment={selectedSegment} data={spendOverTime} isLoading={isLoadingSpendOverview} customerAnalyticsActions={customerAnalyticsActions} windowDimensions={windowDimensions} EventHandler={EventHandler} alertActions={alertActions} />
            </XBlock>
            <XBlock key="target" width={1}>
              <Target selectedDateRange={selectedDateRange} appliedFilters={appliedFilters} selectedSegment={selectedSegment} metric={target} data={targetData} customerAnalyticsActions={customerAnalyticsActions} EventHandler={EventHandler} alertActions={alertActions} />
            </XBlock>
            <XBlock key="target-distribution" width={2}>
              <TargetDistribution selectedDateRange={selectedDateRange} appliedFilters={appliedFilters} selectedSegment={selectedSegment} metric={targetDistribution} data={targetDistributionData} customerAnalyticsActions={customerAnalyticsActions} EventHandler={EventHandler} alertActions={alertActions} />
            </XBlock>
            {/*}
          </XMasonry>
        </div>
        <div style={{ width: '100%' }}>
          <XMasonry>
          */}
            <XBlock key="demographic" width={2}>
              <Demographic selectedDateRange={selectedDateRange} appliedFilters={appliedFilters} selectedSegment={selectedSegment} width={width} isLoadingDemographics={isLoadingDemographics} demographics={demographics} customerAnalyticsActions={customerAnalyticsActions} EventHandler={EventHandler} alertActions={alertActions} showFooterActions />
            </XBlock>
            <XBlock key="themes" width={2}>
              <Impact selectedDateRange={selectedDateRange} appliedFilters={appliedFilters} selectedSegment={selectedSegment} themes={themes} isLoadingThemes={isLoadingThemes} customerAnalyticsActions={customerAnalyticsActions} customerAnalyticsActions={customerAnalyticsActions} EventHandler={EventHandler} alertActions={alertActions} />
            </XBlock>
            {/*
          </XMasonry>
        </div>
        <div style={{ width: '100%' }}>
          <XMasonry>
          */}
            <XBlock key="behaviour" width={3}>
              <Behaviour selectedDateRange={selectedDateRange} appliedFilters={appliedFilters} selectedSegment={selectedSegment} windowDimensions={windowDimensions} EventHandler={EventHandler} customerAnalyticsActions={customerAnalyticsActions} alertActions={alertActions} />
            </XBlock>
          </XMasonry>
        </div>
      </div>
    );
  }
}
