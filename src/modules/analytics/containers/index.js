/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Helmet } from "react-helmet";
import Spinner from "react-spinner-material";
import { XMasonry, XBlock } from "react-xmasonry/dist/index";
import moment from "moment";

import { getBlockWidth } from "Utils/MasonryLayoutUtils";

import ActionBar from "./components/ActionBar";
// import Landing from './Landing';
import Locations from "./components/Locations";
import NPSTrend from "./components/NPSTrend";
import NPS from "./components/NPS";
import Impact from "./components/ImpactRadarChart";
import Spend from "./components/Spend";
import Target from "./components/Target";
import TargetDistribution from "./components/TargetDistribution";
import Behaviour from "./components/Behaviour";
import Demographic from "./components/Demographic";
import GenericPagePlaceholder from "SharedComponents/mwamba-generic-page-place-holder";
import withAuthentication from "Utils/withAuthentication";
import SimpleLayoutExtended from "Layouts/simple-layout-extended";
import * as customerAnalyticsActions from "./flux/actions";
import * as appActions from "Modules/voc/containers/App/flux/actions";
import "./index.css";

const demoThemes = {
  billing: 64,
  drink: 2053,
  food: 10630,
  foreign_objects: 1,
  hygiene: 457,
  it: 119,
  maintenance: 285,
  menu: 241,
  pastries: 47,
  price: 217,
  service: 24726,
  speed: 5631,
  staff: 8099
};
const demoDemographics = {
  genderStats: [{ male: 18, female: 14 }],
  ageStats: { "18-25": 5, "26-35": 11, "36-45": 7, "46-55": 4, "56+": 2 },
  lsmStats: { "8": 1, "11": 2, "12": 2, "14": 1 },
  regionStats: { riftvalley: 2, central: 1, nairobi: 7, western: 1 },
  countyStats: {
    kiambu: 1,
    nairobi: 7,
    "uasin-gishu": 1,
    nakuru: 1,
    bungoma: 1
  },
  occupationStats: {
    "skilled worker": 4,
    "own business": 3,
    "other/unemployed": 3
  },
  educationLevelStats: {
    "completed university": 4,
    "some university": 1,
    "completed postgrad": 1
  },
  bankedStats: { false: 10, true: 1 },
  internetAccessStats: { true: 9, false: 2 },
  householdSpendingStats: {
    "more than 75%": 1,
    "less than 25%": 2,
    "25% - 50%": 5
  }
};
const target = {
  title: "Financial Target",
  subtitle: "What is my monthly target?",
  name: "Target",
  value: 9400000,
  valueContextLeft: "KES",
  raised: 7010000,
  icon: "gps_fixed"
};
const targetData = [
  { name: "raised", amount: target.raised },
  { name: "remaining", amount: target.value - target.raised }
];
const targetDistribution = {
  title: "NPS Group Contribution",
  subtitle: "How are my NPS groups contributing to my spend?",
  name: "Raised",
  value: 9400000,
  valueContextLeft: "KES",
  current: 7010000,
  icon: "data_usage"
};
const targetDistributionData = [
  { name: "promoter", value: 400 },
  { name: "passive", value: 300 },
  { name: "detractor", value: 300 }
];

@connect(
  state => ({
    history: state.history,
    configurations: state.configurations
  }),
  dispatch => ({
    customerAnalyticsActions: bindActionCreators(
      customerAnalyticsActions,
      dispatch
    ),
    appActions: bindActionCreators(appActions, dispatch),
    dispatch
  })
)
class CustomerAnalytics extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    configurations: PropTypes.object,
    windowDimensions: PropTypes.object,
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.currentColumnSpace = null;
    this.currentRowFilled = false;

    this.state = {
      selectedSegment: {},
      appliedFilters: [],
      selectedDateRange: {
        key: 3,
        label: "Last 30 Days",
        value: {
          from: moment()
            .subtract(30, "days")
            .startOf("day")
            .format(),
          to: moment()
            .endOf("day")
            .format(),
          label: "Last 30 Days"
        }
      },
      isLoadingThemes: false,
      themes: {},
      isLoadingDemographics: false,
      demographics: {}
    };

    this.onChangeSegment = this.onChangeSegment.bind(this);
    this.onApplyFilters = this.onApplyFilters.bind(this);
    this.onChangeDateRange = this.onChangeDateRange.bind(this);
    this.container = createRef();
  }

  componentDidMount() {
    const { appActions } = this.props;
    appActions.setRouteTitle("Analytics");
    this.fetchThemes();
    this.fetchDemographics();
  }

  componentWillUnmount() {
    const { appActions } = this.props;
    appActions.unsetRouteTitle();
  }

  onChangeSegment(selectedSegment) {
    this.setState({ selectedSegment }, () => {
      this.fetchDemographics();
      this.fetchThemes();
    });
  }

  onApplyFilters(appliedFilters) {
    this.setState({ appliedFilters }, () => {
      this.fetchDemographics();
      this.fetchThemes();
    });
  }

  onPaymentModeChange(selectedPaymentMode) {
    this.setState({ selectedPaymentMode });
  }

  onChangeDateRange(selectedDateRange) {
    this.setState({
      selectedDateRange: selectedDateRange.value
        ? selectedDateRange
        : {
            ...selectedDateRange,
            value: { from: selectedDateRange.from, to: selectedDateRange.to }
          }
    }, () => {
      this.fetchDemographics();
      this.fetchThemes();
    });
  }

  async fetchThemes() {
    const { customerAnalyticsActions, EventHandler } = this.props;
    const { selectedSegment, selectedDateRange, appliedFilters } = this.state;
    this.setState({ isLoadingThemes: true });

    try {
      const fetchThemesResult = await customerAnalyticsActions.fetchThemes(
        { startTime: null, endTime: null },
        selectedSegment.id,
        appliedFilters
      );
      this.setState({ themes: fetchThemesResult.data.Data });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingThemes: false });
    }
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

  render() {
    const {
      windowDimensions,
      customerAnalyticsActions,
      configurations,
      alertActions,
      EventHandler
    } = this.props;
    const { width } = windowDimensions;
    const {
      isLoadingThemes,
      themes: actualThemes,
      selectedDateRange,
      isLoadingDemographics,
      demographics: actualDemographics,
      appliedFilters,
      selectedSegment,
    } = this.state;
    const { demoMode } = configurations;
    let columns;

    const themes = demoMode ? demoThemes : actualThemes;
    const demographics = demoMode ? demoDemographics : actualDemographics;

    const { current } = this.container;

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
        <Helmet>
          <title>Customer Analytics</title>
          <meta
            name="description"
            content="Customer Analytics, Segments, Loyalty and Satisfaction, Demographics, Behaviour, Spend"
          />
        </Helmet>
        <div
          style={{ width: "100%", padding: width > 425 ? "0 10px 0 10px" : 0 }}
          className="customer-analytics-main"
        >
          {configurations.features.customerAnalytics === null ? (
            <div
              style={{
                width: "100%",
                padding: 50,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              <span style={{ margin: 20 }}>Checking Customer Analytics</span>
            </div>
          ) : !configurations.features.customerAnalytics ? (
            <GenericPagePlaceholder
              title="Customer Analytics"
              text="Analytics is not active for your account. Please contact support to learn more."
              widthx={width}
            />
          ) : (
            <div id="ca-landing">
              <div style={{ width: "100%" }}>
                <XMasonry
                  center={false}
                  targetBlockWidth={65}
                  ref={this.container}
                  responsive={true}
                >
                  <XBlock
                    key="nps-trend"
                    width={getBlockWidth(current, 1 / 2, 1 / 2, 3 / 4, 1, 1)}
                  >
                    <NPSTrend
                      selectedDateRange={selectedDateRange}
                      appliedFilters={appliedFilters}
                      selectedSegment={selectedSegment}
                      demoMode={demoMode}
                      themes={themes}
                      isLoadingThemes={isLoadingThemes}
                      customerAnalyticsActions={customerAnalyticsActions}
                      windowDimensions={windowDimensions}
                      EventHandler={EventHandler}
                      alertActions={alertActions}
                      showFooterActions
                    />
                  </XBlock>
                  {/* <XBlock
                    key="nps"
                    width={getBlockWidth(
                      current,
                      1 / 2,
                      1 / 4,
                      1 / 2,
                      1 / 2,
                      1
                    )}
                  >
                    <NPS
                      selectedDateRange={selectedDateRange}
                      appliedFilters={appliedFilters}
                      selectedSegment={selectedSegment}
                      themes={themes}
                      isLoadingThemes={isLoadingThemes}
                      customerAnalyticsActions={customerAnalyticsActions}
                      windowDimensions={windowDimensions}
                      EventHandler={EventHandler}
                      alertActions={alertActions}
                    />
                  </XBlock> */}
                  {/* <XBlock
                    key="target-distribution"
                    width={getBlockWidth(current, 1, 1, 1, 1, 1)}
                  >
                    <TargetDistribution
                      selectedDateRange={selectedDateRange}
                      appliedFilters={appliedFilters}
                      selectedSegment={selectedSegment}
                      metric={targetDistribution}
                      data={targetDistributionData}
                      customerAnalyticsActions={customerAnalyticsActions}
                      EventHandler={EventHandler}
                      alertActions={alertActions}
                    />
                  </XBlock> */}
                  {/*
                  </XMasonry>
                </div>
                <div style={{ width: '100%' }}>
                  <XMasonry>
                  */}
                  {/* <XBlock
                    key="target"
                    width={getBlockWidth(
                      current,
                      1 / 2,
                      1 / 4,
                      1 / 4,
                      1 / 2,
                      1
                    )}
                  >
                    <Target
                      selectedDateRange={selectedDateRange}
                      appliedFilters={appliedFilters}
                      selectedSegment={selectedSegment}
                      metric={target}
                      data={targetData}
                      customerAnalyticsActions={customerAnalyticsActions}
                      EventHandler={EventHandler}
                      alertActions={alertActions}
                    />
                  </XBlock> */}
                  <XBlock
                    key="spend"
                    width={getBlockWidth(current, 1 / 2, 1 / 2, 3 / 4, 1, 1)}
                  >
                    <Spend
                      selectedDateRange={selectedDateRange}
                      appliedFilters={appliedFilters}
                      selectedSegment={selectedSegment}
                      demoMode={demoMode}
                      customerAnalyticsActions={customerAnalyticsActions}
                      windowDimensions={windowDimensions}
                      EventHandler={EventHandler}
                      alertActions={alertActions}
                      showFooterActions
                    />
                  </XBlock>
                  {/*}
                  </XMasonry>
                </div>
                <div style={{ width: '100%' }}>
                  <XMasonry>
                  */}
                  <XBlock
                    key="demographic"
                    width={getBlockWidth(current, 1 / 2, 1 / 2, 3 / 4, 1, 1)}
                  >
                    <Demographic
                      selectedDateRange={selectedDateRange}
                      appliedFilters={appliedFilters}
                      selectedSegment={selectedSegment}
                      width={width}
                      demographics={demographics}
                      customerAnalyticsActions={customerAnalyticsActions}
                      EventHandler={EventHandler}
                      alertActions={alertActions}
                      showFooterActions
                    />
                  </XBlock>
                  <XBlock
                    key="themes"
                    width={getBlockWidth(current, 1 / 2, 1 / 2, 3 / 4, 1, 1)}
                  >
                    <Impact
                      selectedDateRange={selectedDateRange}
                      appliedFilters={appliedFilters}
                      selectedSegment={selectedSegment}
                      demoMode={demoMode}
                      themes={themes}
                      isLoadingThemes={isLoadingThemes}
                      customerAnalyticsActions={customerAnalyticsActions}
                      customerAnalyticsActions={customerAnalyticsActions}
                      EventHandler={EventHandler}
                      alertActions={alertActions}
                      minimal
                      showFooterActions
                    />
                  </XBlock>
                  {/*
                  </XMasonry>
                </div>
                <div style={{ width: '100%' }}>
                  <XMasonry>
                  */}
                  <XBlock
                    key="behaviour"
                    width={getBlockWidth(current, 1 / 2, 1 / 2, 3 / 4, 1, 1)}
                  >
                    <Behaviour
                      selectedDateRange={selectedDateRange}
                      appliedFilters={appliedFilters}
                      selectedSegment={selectedSegment}
                      demoMode={demoMode}
                      windowDimensions={windowDimensions}
                      EventHandler={EventHandler}
                      customerAnalyticsActions={customerAnalyticsActions}
                      alertActions={alertActions}
                      showFooterActions
                    />
                  </XBlock>
                </XMasonry>
              </div>
            </div>
          )}
        </div>
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(CustomerAnalytics);
