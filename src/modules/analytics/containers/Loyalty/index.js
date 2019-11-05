/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary, object-curly-newline */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Spinner from "react-spinner-material";
import moment from "moment";

import Overview from "./Overview";
import Analytical from "./Analytical";
import ActionBar from "../components/ActionBar";
import SelectedFiltersBar from "../components/SelectedFiltersBar";
import GenericPagePlaceholder from "SharedComponents/mwamba-generic-page-place-holder";
import withAuthentication from "Utils/withAuthentication";
import SimpleLayoutExtended from "Layouts/simple-layout-extended";
import * as customerAnalyticsActions from "../flux/actions";
import * as homeActions from "Modules/voc/containers/Home/flux/actions";
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
const colors = [
  "#f39f02",
  "#2574a6",
  "#ae84a7",
  "#52bf8a",
  "#f46800",
  "#7986cb",
  "#ffca28",
  "#ef5350",
  "#42a5f5",
  "#1de8b5"
];
const tabs = [{ label: "Overview" }, { label: "Analytical" }];

function arrayMin(arr) {
  let min = arr[0];
  for (let i = 1; i < arr.length; ++i) {
    if (arr[i].nps < min.nps) {
      min = arr[i];
    }
  }

  return min;
}

function arrayMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; ++i) {
    if (arr[i].nps > max.nps) {
      max = arr[i];
    }
  }

  return max;
}

@connect(
  state => ({
    user: state.authentication.user,
    collaborators: state.collaborators,
    configurations: state.configurations
  }),
  dispatch => ({
    customerAnalyticsActions: bindActionCreators(
      customerAnalyticsActions,
      dispatch
    ),
    homeActions: bindActionCreators(homeActions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
    dispatch
  })
)
class Loyalty extends Component {
  static propTypes = {
    windowDimensions: PropTypes.object,
    customerAnalyticsActions: PropTypes.object,
    appActions: PropTypes.object,
    alertActions: PropTypes.object,
    homeActions: PropTypes.object,
    configurations: PropTypes.object,
    collaborators: PropTypes.object,
    EventHandler: PropTypes.object
  };

  constructor(props) {
    super(props);

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
            .format("YYYY-MM-DD HH:mm:ss"),
          to: moment()
            .endOf("day")
            .format("YYYY-MM-DD HH:mm:ss"),
          label: "Last 30 Days"
        }
      },
      selectedTab: "Overview",
      isLoadingThemes: false,
      themes: {},
      totalRaters: 0,
      ratings: [],
    };

    this.onChangeSegment = this.onChangeSegment.bind(this);
    this.onApplyFilters = this.onApplyFilters.bind(this);
    this.onChangeDateRange = this.onChangeDateRange.bind(this);
    this.onTabSelected = this.onTabSelected.bind(this);
    this.fetchThemes = this.fetchThemes.bind(this);
  }

  componentDidMount() {
    const { appActions } = this.props;
    appActions.setRouteTitle("Loyalty");
    this.fetchThemes();
    this.fetchNPSTrend();
  }

  componentWillUnmount() {
    const { appActions } = this.props;
    appActions.unsetRouteTitle();
  }

  onChangeSegment(selectedSegment) {
    this.setState({ selectedSegment }, () => {
      this.fetchNPSTrend();
    });
  }

  onApplyFilters(appliedFilters) {
    this.setState({ appliedFilters }, () => {
      this.fetchNPSTrend();
    });
  }

  onChangeDateRange(selectedDateRange) {
    this.setState({
      selectedDateRange: selectedDateRange.value
        ? selectedDateRange.value
        : selectedDateRange
    }, () => {
      this.fetchNPSTrend();
    });
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
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

  async fetchNPSTrend() {
    const { customerAnalyticsActions, EventHandler } = this.props;
    const { appliedFilters, selectedSegment, selectedDateRange } = this.state;
    // this.setState({ isLoading: true });

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
      const fetchNPSTrendResult = await customerAnalyticsActions.fetchNPSTrend({ startTime: startDate, endTime: endDate }, 'daily', selectedSegment.id, appliedFilters);
      const npsRatings = [];
      let totalPromoters = 0;
      let totalPassives = 0;
      let totalDetractors = 0;

      Object.keys(fetchNPSTrendResult.data.Data).sort((a, b) => moment(a) - moment(b)).forEach((key) => {
        let period = key;
        period = moment(key).format('D MMM YYYY');
        
        totalPromoters += fetchNPSTrendResult.data.Data[key].promoters;
        totalPassives += fetchNPSTrendResult.data.Data[key].passives;
        totalDetractors += fetchNPSTrendResult.data.Data[key].detractors;

        const current = Math.floor((fetchNPSTrendResult.data.Data[key].promoters - fetchNPSTrendResult.data.Data[key].detractors) / (fetchNPSTrendResult.data.Data[key].promoters + fetchNPSTrendResult.data.Data[key].passives + fetchNPSTrendResult.data.Data[key].detractors) * 100);
        npsRatings.push({
          nps: current,
          period
        });
      });

      const totalRaters = (totalPromoters + totalPassives + totalDetractors);

      const max = arrayMax(npsRatings);
      const min = arrayMin(npsRatings);

      const ratings = [
        {
          title: 'No. of Raters',
          subtitle: 'How many customers have rated my business?',
          name: '',
          value: totalRaters,
          valueContextRight: 'customers',
          performance: 2.9,
          icon: 'people_outline',
          rangeDays: 30,
        },
        {
          title: 'Highest NPS',
          subtitle: 'What has been my highest NPS?',
          name: '',
          value: max.nps,
          valueContextLeft: 'NPS',
          performance: 4.3,
          icon: 'star',
          rangeDays: 30,
          bottomComponent:(
            <div style={{ width: '100%', height: 15, flexDirection: 'row', borderTop: '1px solid rgb(221, 221, 221)', padding: '10px 0px 25px 10px' }}>
              { max.period }
            </div>
          )
        },
        {
          title: 'Lowest NPS',
          subtitle: 'What has been my lowest NPS?',
          name: '',
          value: min.nps,
          valueContextLeft: 'NPS',
          performance: -1.9,
          icon: 'star_border',
          rangeDays: 30,
          bottomComponent:(
            <div style={{ width: '100%', height: 15, flexDirection: 'row', borderTop: '1px solid rgb(221, 221, 221)', padding: '10px 0px 25px 10px' }}>
              { min.period }
            </div>
          )
        },
      ];
      
      this.setState({ totalRaters, ratings});
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const {
      windowDimensions,
      configurations,
      collaborators,
      alertActions,
      homeActions,
      EventHandler,
      customerAnalyticsActions
    } = this.props;
    const { width } = windowDimensions;
    const {
      selectedDateRange,
      appliedFilters,
      selectedSegment,
      selectedTab,
      themes: actualThemes,
      isLoadingThemes,
      ratings
    } = this.state;
    const { demoMode } = configurations;

    const themes = demoMode ? demoThemes : actualThemes;

    return (
      <SimpleLayoutExtended
        customActionBar={
          <ActionBar
            appliedFilters={appliedFilters}
            onChangeSegment={this.onChangeSegment}
            onChangeDateRange={this.onChangeDateRange}
            onApplyFilters={this.onApplyFilters}
            windowDimensions={windowDimensions}
            tabs={tabs}
            selectedTab={selectedTab}
            onTabSelected={this.onTabSelected}
            customerAnalyticsActions={customerAnalyticsActions}
          />
        }
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
            <span style={{ margin: 20 }}>
              Confirming if Customer Analytics feature is enabled for this
              account...
            </span>
          </div>
        ) : !configurations.features.customerAnalytics ? (
          <GenericPagePlaceholder
            title="Customer Analytics"
            text="Analytics is not active for your account. Please contact support to learn more."
            width={width}
          />
        ) : (
          <div style={{ width: "100%" }}>
            <SelectedFiltersBar
              onApplyFilters={this.onApplyFilters}
              appliedFilters={appliedFilters}
            />
            {selectedTab === "Overview" ? (
              <Overview
                themes={themes}
                isLoadingThemes={isLoadingThemes}
                selectedDateRange={selectedDateRange}
                appliedFilters={appliedFilters}
                selectedSegment={selectedSegment}
                demoMode={demoMode}
                collaborators={collaborators}
                windowDimensions={windowDimensions}
                colors={colors}
                configurations={configurations}
                customerAnalyticsActions={customerAnalyticsActions}
                homeActions={homeActions}
                EventHandler={EventHandler}
                alertActions={alertActions}
                ratings={ratings}
              />
            ) : (
              <Analytical
                themes={themes}
                isLoadingThemes={isLoadingThemes}
                selectedDateRange={selectedDateRange}
                appliedFilters={appliedFilters}
                selectedSegment={selectedSegment}
                demoMode={demoMode}
                windowDimensions={windowDimensions}
                colors={colors}
                customerAnalyticsActions={customerAnalyticsActions}
                EventHandler={EventHandler}
                alertActions={alertActions}
              />
            )}
          </div>
        )}
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(Loyalty);
