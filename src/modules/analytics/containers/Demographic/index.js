/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary, object-curly-newline */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-spinner-material';
import moment from 'moment';
import { XMasonry, XBlock } from 'react-xmasonry/dist/index';

import Main from '../components/Demographic';
import HighlightCard from '../components/HighlightCard';
import ActionBar from '../components/ActionBar';
import SelectedFiltersBar from '../components/SelectedFiltersBar';
import TargetDistribution from '../components/TargetDistribution';
import Locations from './Locations';
import Others from './Others';
import GenericPagePlaceholder from 'SharedComponents/mwamba-generic-page-place-holder';
import withAuthentication from 'Utils/withAuthentication';
import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import * as customerAnalyticsActions from '../flux/actions';
import * as appActions from 'Modules/voc/containers/App/flux/actions';

import './index.css';

const demoDemographics = {
  "genderStats":[{ male: 18, female: 14 }],
  "ageStats":{ "18-25": 5, "26-35": 11, "36-45": 7, "46-55": 4, "56+": 2 },
  "lsmStats":{ "8":1, "11":2, "12":2, "14":1 },
  "regionStats":{ "riftvalley":2, "central":1, "nairobi":7, "western":1, "kisumu": 3, 'thika': 2, 'eldoret': 4, "uasing-gishu": 3, "kirinyaga": 2, "meru": 5, "marsabit": 1, "mombasa": 2, "kwale": 1 },
  "countyStats":{ "kiambu":1, "nairobi":7, "uasin-gishu":1, "nakuru":1, "bungoma":1, "tharaka-nithi": 4, "kajiado": 3, "narok": 2, "siaya": 1, "migori": 3, "homa-bay": 6, "vihiga": 7, "kakamega": 1, "bomet": 5, "kilifi": 3, "mombasa": 2, "kwale": 2, "garissa": 1 },
  "occupationStats":{ "skilled worker":4, "own business":3, "other/unemployed":3 },
  "educationLevelStats":{ "completed university":4, "some university":1, "completed postgrad":1 },
  "bankedStats":{ "false":10, "true":1 },
  "internetAccessStats":{ "true":9, "false":2 },
  "householdSpendingStats":{ "more than 75%":1, "less than 25%":2, "25% - 50%":5 },
};

const regions = [
  { title: 'Highest Region', subtitle: 'Which region has the highest distribution of my customers?', name: 'Upperhill', value: 8000, valueContextRight: 'customers', performance: 2.9, icon: 'place', rangeDays: 30 },
  { title: 'Lowest Region', subtitle: 'Which region has the lowest distribution of my customers?', name: 'Kangemi', value: 200, valueContextRight: 'customers', performance: -1.7, icon: 'place', rangeDays: 30 },
];

const counties = [
  { title: 'Highest County', subtitle: 'Which county has the highest distribution of my customers?', name: 'Nairobi', value: 8000, valueContextRight: 'customers', performance: 1.4, icon: 'place', rangeDays: 30 },
  { title: 'Lowest County', subtitle: 'Which county has the lowest distribution of my customers?', name: 'Nairobi', value: 40, valueContextRight: 'customers', performance: -2.9, icon: 'place', rangeDays: 30 },
];

const npsGroups = [
  { title: 'Number of Promoters', subtitle: 'How many promoters do I have?', name: 'Promoters', value: 6700, valueContextRight: 'customers', performance: 22.3, icon: 'sentiment_satisfied_alt', rangeDays: 30 },
  { title: 'Number of Promoters Passives', subtitle: 'How many passives do I have?', name: 'Passives', value: 1500, valueContextRight: 'customers', performance: -1.9, icon: 'sentiment_satisfied', rangeDays: 30 },
  { title: 'Number of Promoters Detractors', subtitle: 'How many detractors do I have?', name: 'Detractors', value: 500, valueContextRight: 'customers', performance: -10.4, icon: 'sentiment_very_dissatisfied', rangeDays: 30 },
];

const npsGroupsDistribution = { title: 'NPS Group Contribution', subtitle: 'How is the demographic of my customers distributed with regards to the NPS groups?', name: 'All Customers', value: 9400000, valueContextRight: 'customers', current: 7010000, icon: 'people_outline' };

const npsGroupsDistributionData = [
  { name: 'promoter', value: 400 },
  { name: 'passive', value: 300 },
  { name: 'detractor', value: 300 },
];

@connect((state) => ({
  configurations: state.configurations,
}),
(dispatch) => ({
  customerAnalyticsActions: bindActionCreators(customerAnalyticsActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch),
  dispatch,
}))

class Demographic extends PureComponent {
  static propTypes = {
    windowDimensions: PropTypes.object,
    customerAnalyticsActions: PropTypes.object,
    appActions: PropTypes.object,
    alertActions: PropTypes.object,
    configurations: PropTypes.object,
    EventHandler: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedSegment: {},
      appliedFilters: [],
      npsGroupings: [],
      selectedDateRange: {
        key: 3, label: 'Last 30 Days', value: { from: moment().subtract(30, 'days').startOf('day').format(), to: moment().endOf('day').format(), label: 'Last 30 Days' },
      },
      isLoadingDemographics: false,
      isLoadingNPSSummary: false,
      demographics: {},
    };

    this.onChangeSegment = this.onChangeSegment.bind(this);
    this.onApplyFilters = this.onApplyFilters.bind(this);
    this.onChangeDateRange = this.onChangeDateRange.bind(this);
  }

  componentDidMount() {
    const { appActions } = this.props;
    appActions.setRouteTitle('Demographic');
    this.fetchDemographics();
    this.fetchNPSSummary();
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.demoMode) {
      this.fetchDemographics();
    }
  }

  componentWillUnmount() {
    const { appActions } = this.props;
    appActions.unsetRouteTitle();
  }

  onChangeSegment(selectedSegment) {
    this.setState({ selectedSegment }, () => {
      this.fetchDemographics()
      this.fetchNPSSummary();
    })
  }

  onApplyFilters(appliedFilters) {
    this.setState({ appliedFilters }, () => {
      this.fetchDemographics();
      this.fetchNPSSummary();
    });
  }

  onChangeDateRange(selectedDateRange) {
    this.setState({ selectedDateRange: selectedDateRange.value ? selectedDateRange.value : selectedDateRange }, () => {
      this.fetchDemographics();
      this.fetchNPSSummary();
    });
  }

  async fetchDemographics() {
    const { customerAnalyticsActions, EventHandler } = this.props;
    const { selectedSegment, selectedDateRange, appliedFilters } = this.state;

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

  async fetchNPSSummary() {
    const { customerAnalyticsActions, EventHandler } = this.props;
    const { selectedSegment, selectedDateRange, appliedFilters } = this.state;

    let startTime = '';
    let endTime = '';

    if (selectedDateRange.value !== undefined) {
      startTime = moment(selectedDateRange.value.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endTime = moment(selectedDateRange.value.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    } else {
      startTime = moment(selectedDateRange.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endTime = moment(selectedDateRange.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    }

    this.setState({ isLoadingNPSSummary: true });

    try {
      const fetchNPSSummaryResult = await customerAnalyticsActions.fetchNPSSummary({ startTime, endTime }, selectedSegment.id, appliedFilters);

      let detractors = fetchNPSSummaryResult.data.Data.detractors != null ? fetchNPSSummaryResult.data.Data.detractors : 0;
      let passives = fetchNPSSummaryResult.data.Data.passives != null ? fetchNPSSummaryResult.data.Data.passives : 0;
      let promoters = fetchNPSSummaryResult.data.Data.promoters != null ? fetchNPSSummaryResult.data.Data.promoters : 0;

      const npsGroupings = [
        {
          title: 'Number of Promoters',
          subtitle: 'How many promoters do I have?',
          name: 'Promoters',
          value: promoters,
          valueContextRight: 'customers',
          performance: 22.3,
          icon: 'sentiment_satisfied_alt',
          rangeDays: 30,
          bottomComponent:(<div style={{ width: '100%', height: 15, flexDirection: 'row', borderTop: '1px solid rgb(221, 221, 221)', backgroundColor: '#80c582' }}></div>)
        },
        {
          title: 'Number of Passives',
          subtitle: 'How many passives do I have?',
          name: 'Passives',
          value: passives ,
          valueContextRight: 'customers',
          performance: -1.9,
          icon: 'sentiment_satisfied',
          rangeDays: 30,
          bottomComponent:(<div style={{ width: '100%', height: 15, flexDirection: 'row', borderTop: '1px solid rgb(221, 221, 221)', backgroundColor: '#FCDA6E' }}></div>)
        },
        {
          title: 'Number of Detractors',
          subtitle: 'How many detractors do I have?',
          name: 'Detractors',
          value: detractors,
          valueContextRight: 'customers',
          performance: -10.4,
          icon: 'sentiment_very_dissatisfied',
          rangeDays: 30,
          bottomComponent:(<div style={{ width: '100%', height: 15, flexDirection: 'row', borderTop: '1px solid rgb(221, 221, 221)', backgroundColor: '#FD9681' }}></div>)
        },
      ];

      this.setState({ npsGroupings: npsGroupings});
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingNPSSummary: false });
    }
  }

  render() {
    const { windowDimensions, configurations, customerAnalyticsActions, alertActions, EventHandler } = this.props;
    const { width } = windowDimensions;
    const { demographics: actualDemographics, isLoadingDemographics, appliedFilters, npsGroupings } = this.state;
    const { demoMode } = configurations;

    const demographics = demoMode ? demoDemographics : actualDemographics;
    const npsGroupsArray = demoMode ? npsGroups : npsGroupings;

    return (
      <SimpleLayoutExtended
        customActionBar={
          <ActionBar
            appliedFilters={appliedFilters}
            onChangeSegment={this.onChangeSegment}
            onChangeDateRange={this.onChangeDateRange}
            onApplyFilters={this.onApplyFilters}
            windowDimensions={windowDimensions}
            customerAnalyticsActions={customerAnalyticsActions}
            actionBarStyle={{ justifyContent: 'flex-end' }}
          />
        }
      >
        {
          configurations.features.customerAnalytics === null ? (
            <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              <span style={{ margin: 20 }}>Confirming if Customer Analytics feature is enabled for this account...</span>
            </div>
          ) : !configurations.features.customerAnalytics ? (
            <GenericPagePlaceholder title="Customer Analytics" text="Analytics is not active for your account. Please contact support to learn more." width={width} />
          ) : (
            <div id="demographic">
              <SelectedFiltersBar
                onApplyFilters={this.onApplyFilters}
                appliedFilters={appliedFilters}
              />
              <div style={{ width: '100%' }}>
                <XMasonry>
                  {
                    npsGroupsArray.map((metric) => (
                      <XBlock key={metric.title.trim()} width={1}>
                        <HighlightCard metric={metric} />
                      </XBlock>
                    ))
                  }
                </XMasonry>
              </div>
              <div style={{ width: '100%' }}>
                <XMasonry>
                  <XBlock key="main" width={4}>
                    <Main
                      width={width}
                      EventHandler={EventHandler}
                      alertActions={alertActions}
                      demographics={demographics}
                      isLoadingDemographics={isLoadingDemographics}
                    />
                  </XBlock>
                  {/* <XBlock key="nps-groups-distribution" width={2}>
                    <TargetDistribution metric={npsGroupsDistribution} data={npsGroupsDistributionData} hideActions EventHandler={EventHandler} alertActions={alertActions} />
                  </XBlock> */}
                </XMasonry>
              </div>
              <div style={{ width: '100%' }}>
                <XMasonry>
                  <XBlock key="counties" width={2}>
                    <Locations title="Counties" subtitle="How are my customers distributed across counties?" data={demographics.countyStats} isLoadingDemographics={isLoadingDemographics} width={width} EventHandler={EventHandler} alertActions={alertActions} />
                  </XBlock>

                  <XBlock key="regions" width={2}>
                    <Locations title="Regions" subtitle="How are my customers distributed across regions?" data={demographics.regionStats} isLoadingDemographics={isLoadingDemographics} width={width} EventHandler={EventHandler} alertActions={alertActions} />
                  </XBlock>
                  {/* {
                    counties.map((metric) => (
                      <XBlock key={metric.title.trim()} width={1}>
                        <HighlightCard metric={metric} />
                      </XBlock>
                    ))
                  } */}
                </XMasonry>
              </div>
              <div style={{ width: '100%' }}>
                <XMasonry>
                  {/* <XBlock key="regions" width={2}>
                    <Locations title="Regions" subtitle="How are my customers distributed across regions?" data={demographics.regionStats} isLoadingDemographics={isLoadingDemographics} width={width} EventHandler={EventHandler} alertActions={alertActions} />
                  </XBlock> */}
                  {/* {
                    regions.map((metric) => (
                      <XBlock key={metric.title.trim()} width={1}>
                        <HighlightCard metric={metric} />
                      </XBlock>
                    ))
                  } */}
                </XMasonry>
              </div>
              <div style={{ width: '100%' }}>
                <XMasonry>
                  <XBlock key="others" width={4}>
                    <Others isLoadingDemographics={isLoadingDemographics} width={width} EventHandler={EventHandler} alertActions={alertActions} demographics={demographics} isLoadingDemographics={isLoadingDemographics} />
                  </XBlock>
                </XMasonry>
              </div>
            </div>
          )
        }
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(Demographic);
