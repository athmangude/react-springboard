/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary, object-curly-newline */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Spinner from "react-spinner-material";
import moment from "moment";
import { XMasonry, XBlock } from "react-xmasonry/dist/index";

import Trend from "../components/Behaviour";
import HighlightCard from "../components/HighlightCard";
import ActionBar from "../components/ActionBar";
import SelectedFiltersBar from "../components/SelectedFiltersBar";
import HighestSpender from "../Spend/HighestSpender";
import Locations from "./Locations";
import Segments from "./Segments";
import GenericPagePlaceholder from "SharedComponents/mwamba-generic-page-place-holder";
import withAuthentication from "Utils/withAuthentication";
import SimpleLayoutExtended from "Layouts/simple-layout-extended";
import * as customerAnalyticsActions from "../flux/actions";
import * as homeActions from "Modules/voc/containers/Home/flux/actions";
import * as appActions from "Modules/voc/containers/App/flux/actions";

import "./index.css";

const locationsPerformance = [
  {
    title: "Top Location",
    subtitle: "Which is the location with the highest interactions?",
    name: "Java - Hurlingham",
    value: 8000,
    valueContextRight: "interactions",
    performance: 2.9,
    icon: "bar_chart",
    rangeDays: 30
  },
  {
    title: "Bottom Location",
    subtitle: "Which is location with the least interactions?",
    name: "Java - Karen",
    value: 400,
    valueContextRight: "interactions",
    performance: -1.9,
    icon: "bar_chart",
    rangeDays: 30
  }
];

const segmentsPerformance = [
  {
    title: "Top Segment",
    subtitle: "Which is the segment with the highest interactions?",
    name: "Nairobi",
    value: 9600,
    valueContextRight: "interactions",
    performance: 1.4,
    icon: "bar_chart",
    rangeDays: 30
  },
  {
    title: "Bottom Segments",
    subtitle: "Which is the location with the least interactions?",
    name: "Mombasa",
    value: 23,
    valueContextRight: "interactions",
    performance: -2.9,
    icon: "bar_chart",
    rangeDays: 30
  }
];

const npsGroups = [
  {
    title: "Interactions with Promoters",
    subtitle: "How many interactions from promoters?",
    name: "Promoters",
    value: 6700,
    valueContextRight: "interactions",
    performance: 22.3,
    icon: "sentiment_satisfied_alt",
    rangeDays: 30
  },
  {
    title: "Interactions with Passives",
    subtitle: "How many interactions from passives?",
    name: "Passives",
    value: 1500,
    valueContextRight: "interactions",
    performance: -1.9,
    icon: "sentiment_satisfied",
    rangeDays: 30
  },
  {
    title: "Interactions with Detractors",
    subtitle: "How many interactions from detractors?",
    name: "Detractors",
    value: 500,
    valueContextRight: "interactions",
    performance: -10.4,
    icon: "sentiment_very_dissatisfied",
    rangeDays: 30
  }
];

const highestSpenderComment = {
  bookmarked: false,
  chats: [],
  commId: "+254711151863",
  commentId: 5513116,
  createDate: 1555488599517,
  id: 12757008,
  metadata: {
    branch_code: "315302",
    amount: "10400.0",
    last_name: "ROTICH",
    location: "Aga Khan Dr. Plaza",
    first_name: "FAITH",
    transaction_timestamp: "2019-04-17T08:09:49Z"
  },
  npsComment: "The service was amazing and the food is always exceptional",
  npsScore: 10,
  read: true,
  surveyTitle: "Java Customer Feedback Nairobi",
  systemTags: ["food", "service"],
  userTags: []
};
const lowestSpenderComment = {
  bookmarked: false,
  chats: [],
  commId: "+254711151863",
  commentId: 5513116,
  createDate: 1555488599517,
  id: 12757008,
  metadata: {
    branch_code: "315301",
    amount: "120.0",
    last_name: "NJUGUNA",
    location: "Mama Ngina",
    first_name: "KEVIN",
    transaction_timestamp: "2019-04-17T08:09:49Z"
  },
  npsComment: "Excellent samosas, though pricy",
  npsScore: 8,
  read: true,
  surveyTitle: "Java Customer Feedback Nairobi",
  systemTags: ["food", "price"],
  userTags: []
};

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
class Behaviour extends Component {
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
      npsGroupings: [],
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
      }
    };

    this.onChangeSegment = this.onChangeSegment.bind(this);
    this.onApplyFilters = this.onApplyFilters.bind(this);
    this.onChangeDateRange = this.onChangeDateRange.bind(this);
  }

  componentDidMount() {
    const { appActions } = this.props;
    appActions.setRouteTitle("Behaviour");
    this.fetchNPSSummary();
    this.fetchBehaviourCustomerSpotlight();
  }

  componentWillUnmount() {
    const { appActions } = this.props;
    appActions.unsetRouteTitle();
  }

  onChangeSegment(selectedSegment) {
    this.setState({ selectedSegment }, () => {
      this.fetchNPSSummary();
      this.fetchBehaviourCustomerSpotlight();
    });
  }

  onApplyFilters(appliedFilters) {
    this.setState({ appliedFilters });
  }

  onChangeDateRange(selectedDateRange) {
    this.setState({ selectedDateRange: selectedDateRange.value? selectedDateRange.value : selectedDateRange}, () => {
      this.fetchNPSSummary();
      this.fetchBehaviourCustomerSpotlight();
    });
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

  async fetchBehaviourCustomerSpotlight() {
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
      const fetchBehaviourCustomerSpotlightResult = await customerAnalyticsActions.fetchBehaviourCustomerSpotlight({ startTime, endTime }, selectedSegment.id, appliedFilters);

      // console.log(fetchBehaviourCustomerSpotlightResult);
      // let detractors = fetchNPSSummaryResult.data.Data.detractors != null ? fetchNPSSummaryResult.data.Data.detractors : 0;
      // let passives = fetchNPSSummaryResult.data.Data.passives != null ? fetchNPSSummaryResult.data.Data.passives : 0;
      // let promoters = fetchNPSSummaryResult.data.Data.promoters != null ? fetchNPSSummaryResult.data.Data.promoters : 0;

      // const npsGroupings = [
      //   { title: 'Number of Promoters', subtitle: 'How many promoters do I have?', name: 'Promoters', value: promoters, valueContextRight: 'customers', performance: 22.3, icon: 'sentiment_satisfied_alt', rangeDays: 30 },
      //   { title: 'Number of Passives', subtitle: 'How many passives do I have?', name: 'Passives', value: passives , valueContextRight: 'customers', performance: -1.9, icon: 'sentiment_satisfied', rangeDays: 30 },
      //   { title: 'Number of Detractors', subtitle: 'How many detractors do I have?', name: 'Detractors', value: detractors, valueContextRight: 'customers', performance: -10.4, icon: 'sentiment_very_dissatisfied', rangeDays: 30 },
      // ];

      // this.setState({ npsGroupings: npsGroupings});
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingNPSSummary: false });
    }
  }
  render() {
    const {
      windowDimensions,
      configurations,
      collaborators,
      customerAnalyticsActions,
      alertActions,
      homeActions,
      EventHandler
    } = this.props;
    const { width } = windowDimensions;
    const { selectedDateRange, appliedFilters, selectedSegment, npsGroupings } = this.state;
    const { demoMode } = configurations;

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
          <div id="spend">
            <SelectedFiltersBar
              onApplyFilters={this.onApplyFilters}
              appliedFilters={appliedFilters}
            />
            <div style={{ width: "100%" }}>
              <XMasonry>
                {npsGroupsArray.map(metric => (
                  <XBlock key={metric.title.trim()} width={1}>
                    <HighlightCard metric={metric} />
                  </XBlock>
                ))}
                <XBlock key="spend" width={3}>
                  <Trend
                    selectedDateRange={selectedDateRange}
                    appliedFilters={appliedFilters}
                    selectedSegment={selectedSegment}
                    demoMode={demoMode}
                    windowDimensions={windowDimensions}
                    customerAnalyticsActions={customerAnalyticsActions}
                    EventHandler={EventHandler}
                    alertActions={alertActions}
                    compare
                  />
                </XBlock>
              </XMasonry>
            </div>
            <div style={{ width: "100%" }}>
              <XMasonry>
                <XBlock key="locations-performance" width={2}>
                  <Locations
                    selectedDateRange={selectedDateRange}
                    appliedFilters={appliedFilters}
                    selectedSegment={selectedSegment}
                    demoMode={demoMode}
                    width={width}
                    customerAnalyticsActions={customerAnalyticsActions}
                    EventHandler={EventHandler}
                    alertActions={alertActions}
                  />
                </XBlock>
                <XBlock key="segments-performance" width={2}>
                  <Segments
                    selectedDateRange={selectedDateRange}
                    appliedFilters={appliedFilters}
                    selectedSegment={selectedSegment}
                    demoMode={demoMode}
                    width={width}
                    customerAnalyticsActions={customerAnalyticsActions}
                    EventHandler={EventHandler}
                    alertActions={alertActions}
                  />
                </XBlock>
                {/* {locationsPerformance.map(metric => (
                  <XBlock key={metric.title.trim()} width={1}>
                    <HighlightCard metric={metric} />
                  </XBlock>
                ))} */}
              </XMasonry>
            </div>
            {/* <div style={{ width: "100%" }}>
              <XMasonry>
                <XBlock key="segments-performance" width={2}>
                  <Segments
                    selectedDateRange={selectedDateRange}
                    appliedFilters={appliedFilters}
                    selectedSegment={selectedSegment}
                    demoMode={demoMode}
                    width={width}
                    customerAnalyticsActions={customerAnalyticsActions}
                    EventHandler={EventHandler}
                    alertActions={alertActions}
                  />
                </XBlock>
                {segmentsPerformance.map(metric => (
                  <XBlock key={metric.title.trim()} width={1}>
                    <HighlightCard metric={metric} />
                  </XBlock>
                ))}
              </XMasonry>
            </div> */}
            {/* <div style={{ width: "100%" }}>
              <XMasonry>
                <XBlock key="highest-spender-comment" width={2}>
                  <HighestSpender
                    title="Customer Spotlight"
                    subtitle="Which customer has interacted the most with my business?"
                    comment={{
                      ...highestSpenderComment,
                      uiSortDate: moment(highestSpenderComment.createDate),
                      type: "comment"
                    }}
                    collaborators={collaborators}
                    configurations={configurations}
                    homeActions={homeActions}
                    EventHandler={EventHandler}
                    alertActions={alertActions}
                  />
                </XBlock>
                <XBlock key="lowest-spender-comment" width={2}>
                  <HighestSpender
                    title="&nbsp;"
                    subtitle="Which customer has interacted the least with my business?"
                    comment={{
                      ...lowestSpenderComment,
                      uiSortDate: moment(lowestSpenderComment.createDate),
                      type: "comment"
                    }}
                    collaborators={collaborators}
                    configurations={configurations}
                    homeActions={homeActions}
                    EventHandler={EventHandler}
                    alertActions={alertActions}
                  />
                </XBlock>
              </XMasonry>
            </div> */}
          </div>
        )}
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(Behaviour);
