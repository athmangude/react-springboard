/* eslint-disable radix, no-extra-boolean-cast */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Row, Col } from "react-grid-system";
import moment from "moment";
import { Helmet } from "react-helmet";
import ContainerDimensions from "react-container-dimensions";
import { Button } from "semantic-ui-react";
import Spinner from "react-spinner-material";

import NPSCard from "./components/nps-card/npsCard";
import ContactedRespondedChart from "./components/contacted-responded-chart";
import WorkSpaceActivities from "./components/workspace-activities";
// import TrendsToday from './components/trends-today';
import Feedback from "./components/feedback";
import DateSegemnt from "./components/DateSegment";
import Activity from "./components/activity";

import withAuthentication from "Utils/withAuthentication";
import TopBarLayout from "Layouts/top-bar";
// import DefaultLayout from 'Layouts/default';
import Survey from "./components/survey";
import EmptyFeedItem from "./components/EmptyFeedItem";
import NPSGroups from "./components/nps-groups";

import ActivityHandler from "Utils/ActivityHandler";

import * as homeActions from "./flux/actions";
import * as conversationActions from "../Conversations/flux/actions";
import * as collaboratorsActions from "Modules/voc/containers/Settings/Collaborators/flux/actions";

@connect(
  state => ({
    home: state.home,
    conversations: state.conversations,
    user: state.authentication.user,
    collaborators: state.collaborators
  }),
  dispatch => ({
    homeActions: bindActionCreators(homeActions, dispatch),
    conversationActions: bindActionCreators(conversationActions, dispatch),
    collaboratorsActions: bindActionCreators(collaboratorsActions, dispatch),
    dispatch
  })
)
class HomeFeed extends Component {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    home: PropTypes.object.isRequired,
    homeActions: PropTypes.object.isRequired,
    conversations: PropTypes.object.isRequired,
    collaborators: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.fetchNPS = this.fetchNPS.bind(this);
    this.fetchContacted = this.fetchContacted.bind(this);
    this.fetchHomeFeed = this.fetchHomeFeed.bind(this);
    this.fetchConversations = this.fetchConversations.bind(this);
    this.fetchCollaborators = this.fetchCollaborators.bind(this);
  }

  state = {
    isFetchingHomeFeed: false,
    isFetchingActiveConversations: false,
    isFetchingCollaborators: false,
    isFetchingNPS: false,
    isFetchingContacted: false,
    feedOffset: 0
  };

  componentDidMount() {
    this.fetchHomeFeed();
    this.fetchConversations();
    this.fetchCollaborators();
    this.fetchContacted();
    this.fetchNPS({});
  }

  async fetchContacted(currentDate = moment()) {
    this.setState({ isFetchingContacted: true });

    const from = currentDate.startOf("month").format("YYYY-MM-DD HH:mm:ss");
    const to = currentDate.endOf("month").format("YYYY-MM-DD HH:mm:ss");

    try {
      const fetchContactedResult = await this.props.homeActions.fetchContacted(
        from,
        to
      );
      this.props.homeActions.addContacted({
        date: currentDate,
        items: fetchContactedResult.data.Data
      });
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingContacted: false });
    }
  }

  async fetchConversations() {
    this.setState({ isFetchingActiveConversations: true });
    try {
      const fetchConversationsResult = await this.props.conversationActions.fetchConversations(
        1,
        "active"
      );

      this.props.conversationActions.setConversations(
        {
          items: fetchConversationsResult.data.Data.objects,
          page: 1,
          totalCount: fetchConversationsResult.data.Data.meta.totalCount
        },
        "active"
      );
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingActiveConversations: false });
    }
  }

  async fetchCollaborators() {
    this.setState({ isFetchingCollaborators: true });
    try {
      const fetchCollaboratorsResult = await this.props.collaboratorsActions.fetchCollaborators();
      this.props.collaboratorsActions.addCollaborators(
        fetchCollaboratorsResult.data.Data
      );
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingCollaborators: false });
    }
  }

  async fetchHomeFeed() {
    const oldCommentsItemsCount = !!this.props.home.npsComments.length;
    let newCommentsItemsCount;

    this.setState({ isFetchingHomeFeed: true, isFetchingContacted: true });

    try {
      const homeFeedResult = await this.props.homeActions.fetchHomeFeed({
        limit: 10,
        offset: this.state.feedOffset
      });

      let feedItems = [];
      // this.props.homeActions.addContacted({ date: moment(), items: homeFeedResult.data[0].Data });
      const surveyItems = homeFeedResult.data[0].Data.surveys.map(item => ({
        ...item,
        uiSortDate: moment(item.lastActivity),
        type: "chart"
      }));
      feedItems = feedItems.concat(surveyItems);
      const commentsItems = homeFeedResult.data[1].Data.map(item => ({
        ...item,
        uiSortDate: moment(item.createDate),
        type: "comment"
      }));
      newCommentsItemsCount = commentsItems.length;
      this.props.homeActions.addNPSCcomments(commentsItems);

      // // TODO: filter out login items in the payload from the server
      // const activityItems = homeFeedResult.data[4].Data.map((item) => ({ ...item, uiSortDate: moment(item.createDate), type: 'activity' })).filter((item) => item.eventType !== 'USER_LOGIN');
      // this.props.homeActions.addNotifications(activityItems);

      feedItems = feedItems.sort((a, b) => b.uiSortDate - a.uiSortDate);

      this.props.homeActions.addFeedItems(feedItems);
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({
        isFetchingHomeFeed: false,
        isFetchingContacted: false,
        feedOffset: this.state.feedOffset + 10
      });

      if (!!oldCommentsItemsCount && !!newCommentsItemsCount) {
        this.props.alertActions.addAlert({
          type: "info",
          message: "New items have been added to your feed"
        });
      }

      if (!!!newCommentsItemsCount) {
        this.props.alertActions.addAlert({
          type: "info",
          message: "We couldn't find any new items for your feed"
        });
      }
    }
  }

  async fetchNPS(filters) {
    const filteredFilters = filters;
    Object.keys(filteredFilters).forEach(filter => {
      if (filters[filter] === null) {
        delete filteredFilters[filter];
      }
    });
    this.setState({ isFetchingNPS: true });
    try {
      const fetchNPSResult = await this.props.homeActions.fetchNPS(
        filteredFilters
      );
      this.props.homeActions.setNPS(fetchNPSResult.data.Data);
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingNPS: false });
    }
  }

  render() {
    let contacted = this.props.home.contacted.items.map(value => ({
      date: moment(value.date, "x").toDate(),
      respondents: parseInt(value.contacted),
      finished: parseInt(value.finished),
      value
    }));

    // TODO: pick the last ten entries
    const padding = new Array(30 - contacted.length).fill(0).map((item, i) => ({
      date: contacted.length
        ? moment(contacted[contacted.length - 1].value.date).add(i + 1, "days")
        : moment().add(i + 1, "days"),
      respondents: 0,
      finished: 0
    }));

    contacted = [...contacted, ...padding];

    const totalContacted = contacted.reduce((p, c) => p + c.respondents, 0);
    const totalResponded = contacted.reduce((p, c) => p + c.finished, 0);

    const { feedItems } = this.props.home;

    const timeline = [];
    let currentUISortdate;

    if (feedItems.length) {
      timeline.push({
        type: "date",
        value: feedItems[0].uiSortDate
      });

      currentUISortdate = feedItems[0].uiSortDate;
    }

    feedItems.forEach(feedItem => {
      if (currentUISortdate.diff(feedItem.uiSortDate, "days") > 0) {
        currentUISortdate = feedItem.uiSortDate;
        timeline.push({
          type: "date",
          value: feedItem.uiSortDate
        });
      }

      timeline.push(feedItem);
    });

    return (
      <TopBarLayout>
        <Helmet
          title="Home"
          meta={[{ name: "description", content: "Home feed" }]}
        />
        <Container style={{ width: "100%", padding: 0 }}>
          <Row style={{ width: "100%", margin: 0, padding: 0 }}>
            <Col xl={7} lg={7} md={7} sm={12} xs={12}>
              <div style={{ width: "100%" }}>
                <NPSGroups
                  items={this.props.home.npsComments}
                  collaborators={this.props.collaborators}
                  homeActions={this.props.homeActions}
                />
                {!timeline.length && !this.props.home.npsComments.length ? (
                  <EmptyFeedItem
                    items={3}
                    loading={this.state.isFetchingHomeFeed}
                  />
                ) : (
                  timeline.map(item => {
                    if (item.type === "chart") {
                      return (
                        <Survey
                          survey={item}
                          key={item.surveyId}
                          collaborators={this.props.collaborators}
                          homeActions={this.props.homeActions}
                        />
                      );
                    }

                    if (item.type === "comment") {
                      return (
                        <Feedback
                          comment={item}
                          collaborators={this.props.collaborators}
                          homeActions={this.props.homeActions}
                        />
                      );
                    }

                    if (item.type === "date") {
                      return (
                        <DateSegemnt
                          date={item}
                          homeActions={this.props.homeActions}
                        />
                      );
                    }

                    if (item.type === "activity") {
                      return (
                        <Activity
                          item={item}
                          key={item.id}
                          user={this.props.user}
                          collaborators={this.props.collaborators}
                          homeActions={this.props.homeActions}
                        />
                      );
                    }
                    return null;
                  })
                )}
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "10px 0",
                  padding: "10px 0"
                }}
              >
                {!this.props.home.npsComments.length ? null : !this.state
                    .isFetchingHomeFeed ? ( // eslint-disable-line no-nested-ternary
                  <Button
                    onClick={this.fetchHomeFeed}
                    disabled={false}
                    className="mwamba-primary-button"
                    style={{
                      borderRadius: 15,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0px 20px",
                      marginTop: 10
                    }}
                  >
                    <span>Load More</span>
                  </Button>
                ) : (
                  <div style={{ marginTop: 10 }}>
                    <Spinner
                      spinnerColor="#487db3"
                      size={30}
                      spinnerWidth={3}
                    />
                  </div>
                )}
              </div>
            </Col>
            <Col xl={5} lg={5} md={5} sm={12} xs={12}>
              <div style={{ width: "100%", padding: 10 }}>
                <ContactedRespondedChart
                  contacted={contacted}
                  totalContacted={totalContacted}
                  date={this.props.home.contacted.date}
                  fetchContacted={this.fetchContacted}
                  isFetchingContacted={this.state.isFetchingContacted}
                />
                <ContainerDimensions>
                  {({ width }) => (
                    <NPSCard
                      width={width}
                      nps={this.props.home.nps}
                      fetchNPS={this.fetchNPS}
                      isFetchingNPS={this.state.isFetchingNPS}
                      isFetchingHomeFeed={this.state.isFetchingHomeFeed}
                      contactedCount={totalContacted}
                      respondedCount={totalResponded}
                    />
                  )}
                </ContainerDimensions>
                {/*
                <TrendsToday />
                */}
                <WorkSpaceActivities
                  collaborators={this.props.collaborators}
                  activeConversations={this.props.conversations.active}
                  isFetchingActiveConversations={
                    this.state.isFetchingActiveConversations
                  }
                />
              </div>
            </Col>
          </Row>
        </Container>
      </TopBarLayout>
    );
  }
}

export default withAuthentication(HomeFeed);
