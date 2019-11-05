/* eslint-disable radix, no-extra-boolean-cast, no-nested-ternary, no-param-reassign, react/destructuring-assignment */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import ContainerDimensions from "react-container-dimensions";

import NPSCard from "./components/nps-card/npsCard";
import TrendsToday from "./components/trends-today";
import SideBarActivityLog from "../ActivityLog/SideBarActivityLog";
import TabbedActivityMetrics from "./components/tabbed-activity-metrics";

import HomeActionBar from "./components/home-feed-action-bar";

import withAuthentication from "Utils/withAuthentication";
import SimpleLayoutExtended from "Layouts/simple-layout-extended";
import NPSFeed from "./NPSFeed";
import SocialFeed from "./social-feed";

import * as homeActions from "./flux/actions";
import * as conversationActions from "../Conversations/flux/actions";
import * as collaboratorsActions from "../Settings/Collaborators/flux/actions";
import * as AppActions from "../App/flux/actions";

@connect(
  state => ({
    home: state.home,
    conversations: state.conversations,
    user: state.authentication.user,
    collaborators: state.collaborators,
    activityLogs: state.activityLogs,
    configurations: state.configurations
  }),
  dispatch => ({
    homeActions: bindActionCreators(homeActions, dispatch),
    conversationActions: bindActionCreators(conversationActions, dispatch),
    collaboratorsActions: bindActionCreators(collaboratorsActions, dispatch),
    AppActions: bindActionCreators(AppActions, dispatch),
    dispatch
  })
)
class HomeFeed extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    home: PropTypes.object.isRequired,
    homeActions: PropTypes.object.isRequired,
    conversations: PropTypes.object.isRequired,
    collaborators: PropTypes.array.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object,
    configurations: PropTypes.object.isRequired,
    collaboratorsActions: PropTypes.object.isRequired,
    conversationActions: PropTypes.object.isRequired,
    windowDimensions: PropTypes.object.isRequired
  };

  static whyDidYouRender = false;

  constructor(props) {
    super(props);

    this.fetchNPS = this.fetchNPS.bind(this);
    this.fetchContacted = this.fetchContacted.bind(this);
    // this.fetchHomeFeed = this.fetchHomeFeed.bind(this);
    this.fetchConversations = this.fetchConversations.bind(this);
    this.fetchCollaborators = this.fetchCollaborators.bind(this);
    // this.refreshHome = this.refreshHome.bind(this);
    this.fetchNPSComments = this.fetchNPSComments.bind(this);
    this.fetchComments = this.fetchComments.bind(this);
    this.fetchActivityFeed = this.fetchActivityFeed.bind(this);
    this.onLoadMoreActivityFeedItems = this.onLoadMoreActivityFeedItems.bind(
      this
    );
    this.handleDateChanged = this.handleDateChanged.bind(this);
    this.setNPSFilters = this.setNPSFilters.bind(this);
    this.setNPSTag = this.setNPSTag.bind(this);
    this.clearNPSTag = this.clearNPSTag.bind(this);
    this.fetchContactedLast30days = this.fetchContactedLast30days.bind(this);

    // NEW LAYOUT FEATURES START HERE
    this.onFeedFiltersChanged = this.onFeedFiltersChanged.bind(this);
    this.onFetchFeedComments = this.onFetchFeedComments.bind(this);
  }

  state = {
    isFetchingHomeFeed: false,
    isFetchingActiveConversations: false,
    isFetchingCollaborators: false,
    isFetchingNPS: false,
    isFetchingContacted: false,
    dateFilters: moment(),
    npsFilters: {},
    isFetchingDetractorComments: false,
    isFetchingPassiveComments: false,
    isFetchingPromoterComments: false,
    isRefreshingFeed: false,
    isFetchingTrendingThemes: false,
    tag: null, // specifies the selected nps tag from trending theme tags
    isFetchingContactedForLast30Days: false,
    feedFilters: {
      detractors: true,
      passives: true,
      promoters: true,
      bookmarked: null,
      read: null,
      from: moment()
        .utc()
        .subtract(30, "days")
        .format(),
      to: moment()
        .utc()
        .format(),
      timeRangeLabel: "Last\u00a030\u00a0days",
      tag: null
      // category: 'detractors',
    },
    isFetchingFeedComments: false,
    isFetchingSocialFeed: false,
    isInitalCall: true,
    activeTab: "NPS"
  };

  componentDidMount() {
    // prepare filters from NPS filters
    const { npsFilters } = this.state;
    const { AppActions } = this.props;
    const filters = {};

    AppActions.setRouteTitle("Home");

    Object.keys(npsFilters).forEach(key => {
      if (npsFilters[key]) {
        filters[key] = npsFilters[key];
      }
    });

    // fetch initial list of feedback items
    if (!this.props.home.feedItems.length) {
      this.onFetchFeedComments(
        {
          ...this.state.feedFilters,
          limit: 20,
          offset: this.props.home.feedItems.length
        },
        false
      );
    }

    // this.interval = setInterval(() => {
    //   this.setState({ isInitalCall: false }, () => this.fetchComments());
    // }, 10000);

    // this.fetchConversations();
    // this.fetchCollaborators();

    this.fetchContacted();
    this.fetchContactedLast30days();
    this.fetchNPS();
    this.fetchTrendingThemes();
  }

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

  async onFetchFeedComments(options, clearStore = false) {
    this.setState({ isFetchingFeedComments: true });

    // delete options.from;
    // delete options.to;
    delete options.timeRangeLabel;

    const filters = {};

    const { npsFilters } = this.state;
    Object.keys(npsFilters).forEach(key => {
      if (npsFilters[key]) {
        filters[key] = npsFilters[key];
      }
    });

    if (clearStore) {
      this.props.homeActions.clearHomeFeed();
    }

    try {
      const fetchHomeFeedresult = await this.props.homeActions.fetchActivityFeed(
        { ...options, ...filters }
      ); // NOTE: offset is passed in options
      const commentsItems = fetchHomeFeedresult.data.Data.map(item => ({
        ...item,
        uiSortDate: moment(item.createDate),
        type: "comment"
      }));

      this.props.homeActions.addFeedItems(commentsItems);
    } catch (exception) {
      console.log("[exception]", exception);
      this.props.alertActions.addAlert({
        type: "error",
        message: exception.response.data.message || exception.message
      });

      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingFeedComments: false });
    }
  }

  onFeedFiltersChanged(changes, clearStore = false) {
    // const nextFilters = { ...this.state.feedFilters, ...changes };
    // if (Object.keys(changes).includes('promoters') || Object.keys(changes).includes('passives') || Object.keys(changes).includes('detractors')) {
    //   nextFilters = { ...{ promoters: false, passives: false, detractors: false }, ...{ [Object.keys(changes)[0]]: true, category: Object.keys(changes)[0] } };
    // }

    console.log("changes", changes);

    if (clearStore) {
      this.props.homeActions.clearHomeFeed();
    }

    this.setState(
      {
        feedFilters: { ...this.state.feedFilters, ...changes }
      },
      () => {
        this.onFetchFeedComments(
          {
            ...this.state.feedFilters,
            limit: 10,
            offset: this.props.home.feedItems.length
          },
          clearStore
        );
        this.fetchNPS();
        this.fetchContacted();
      }
    );
  }

  onLoadMoreActivityFeedItems() {
    this.onFetchFeedComments(
      {
        ...this.state.feedFilters,
        limit: 10,
        offset: this.props.home.feedItems.length
      },
      false
    );
  }

  setNPSFilters(npsFilters = {}) {
    this.setState({ npsFilters }, () => {
      this.onFetchFeedComments(
        {
          ...this.state.feedFilters,
          limit: 10,
          offset: this.props.home.feedItems.length
        },
        true
      );
      this.fetchNPS();
      this.fetchContacted();
    });
  }

  async setNPSTag(tag = null) {
    this.setState({ feedFilters: { ...this.state.feedFilters, tag } }, () => {
      this.onFetchFeedComments(
        {
          ...this.state.feedFilters,
          limit: 10,
          offset: this.props.home.feedItems.length
        },
        true
      );
    });
  }

  async clearNPSTag() {
    this.setState(
      { feedFilters: { ...this.state.feedFilters, tag: null } },
      () => {
        this.onFetchFeedComments(
          {
            ...this.state.feedFilters,
            limit: 10,
            offset: this.props.home.feedItems.length
          },
          true
        );
      }
    );
  }

  handleDateChanged(dateFilters) {
    this.setState({ dateFilters }, () => {
      // this.refreshHome();
      this.fetchContacted();
    });
  }

  fetchComments(filters) {
    const { npsFilters } = this.state;
    Object.keys(npsFilters).forEach(key => {
      if (npsFilters[key]) {
        filters[key] = npsFilters[key];
      }
    });

    this.onFetchFeedComments(
      {
        ...this.state.feedFilters,
        category: "detractors",
        limit: 10,
        offset: this.props.home.feedItems.detractors.length
      },
      false
    );

    this.onFetchFeedComments(
      {
        ...this.state.feedFilters,
        category: "passives",
        limit: 10,
        offset: this.props.home.feedItems.passives.length
      },
      false
    );

    this.onFetchFeedComments(
      {
        ...this.state.feedFilters,
        category: "promoters",
        limit: 10,
        offset: this.props.home.feedItems.promoters.length
      },
      false
    );
  }

  async fetchContactedLast30days(
    from = moment()
      .subtract(30, "days")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss"),
    to = moment()
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss")
  ) {
    const { npsFilters } = this.state;
    this.setState({ isFetchingContactedForLast30Days: true });

    try {
      const fetchContactedLast30daysResult = await this.props.homeActions.fetchContacted(
        { from, to },
        npsFilters
      );

      this.props.homeActions.addContactedForLast30Days(
        fetchContactedLast30daysResult.data.Data
      );
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingContactedForLast30Days: false });
    }
  }

  async fetchContacted() {
    const { dateFilters, npsFilters, feedFilters } = this.state;
    this.setState({ isFetchingContacted: true });

    const from = moment(feedFilters.from)
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    const to = moment(feedFilters.to)
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss");

    try {
      const fetchContactedResult = await this.props.homeActions.fetchContacted(
        { from, to },
        npsFilters
      );
      this.props.homeActions.addContacted({
        date: dateFilters.clone(),
        items: fetchContactedResult.data.Data
      });
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingContacted: false });
    }
  }

  // async refreshHome(updateNPSComments = false) {
  //   console.warn('[refreshHome]');
  //   // updateNPSComments is false if the filter is date range. We do not filter the comments by date range because of too many records
  //   const updates = updateNPSComments ? [this.fetchHomeFeed(), this.fetchContacted(), this.fetchNPS()] : [this.fetchContacted(), this.fetchNPS()];
  //   // TODO: have a looj at the fetchHomeFeed above and make sure it does not cause issues with reloading the feed
  //   await Promise.all(updates);
  // }

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
      this.props.EventHandler.handleException(exception);
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
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingCollaborators: false });
    }
  }

  async fetchNPSComments(category = "detractors", options, clearStore = false) {
    const { isInitalCall } = this.state;
    if (isInitalCall) {
      if (category === "detractors") {
        this.setState({ isFetchingDetractorComments: true });
      } else if (category === "passives") {
        this.setState({ isFetchingPassiveComments: true });
      } else {
        this.setState({ isFetchingPromoterComments: true });
      }
    }

    try {
      const fetchNPSCommentsResults = await this.props.homeActions.fetchNPSComments(
        { limit: 10, ...options, tag: this.state.tag }
      ); // NOTE: offset is passed in options
      const commentsItems = fetchNPSCommentsResults.data.Data.map(item => ({
        ...item,
        uiSortDate: moment(item.createDate),
        type: "comment"
      }));
      if (clearStore) {
        this.props.homeActions.clearNPSCategoryComments(category);
      }
      this.props.homeActions.addNPSCcomments(commentsItems);
    } catch (exception) {
      this.props.alertActions.addAlert({
        type: "error",
        message: exception.response.data.message || exception.message
      });
      this.props.EventHandler.handleException(exception);
    } finally {
      if (category === "detractors") {
        this.setState({ isFetchingDetractorComments: false });
      } else if (category === "passives") {
        this.setState({ isFetchingPassiveComments: false });
      } else {
        this.setState({ isFetchingPromoterComments: false });
      }
    }
  }

  async fetchActivityFeed(options, clearFeed = false) {
    this.setState({ isFetchingActivityFeed: true });

    try {
      const fetchActivityFeedResult = await this.props.homeActions.fetchActivityFeed(
        {
          ...options,
          limit: 10,
          offset: this.props.home.feedItems.length,
          tag: this.state.tag
        }
      );
      const activityFeedItems = fetchActivityFeedResult.data.Data.map(item => ({
        ...item,
        uiSortDate: moment(item.createDate),
        type: "comment"
      }));
      if (clearFeed) {
        this.props.homeActions.removeFeedItems();
      }
      this.props.homeActions.addFeedItems(activityFeedItems);
    } catch (exception) {
      // TODO: handle exception
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingActivityFeed: false });
    }
  }

  async fetchNPS() {
    const { dateFilters, npsFilters, feedFilters } = this.state;

    const from = feedFilters.from;
    const to = feedFilters.to;

    this.setState({ isFetchingNPS: true });

    try {
      const fetchNPSResult = await this.props.homeActions.fetchNPS(
        { from, to },
        npsFilters
      );
      this.props.homeActions.setNPS(fetchNPSResult.data.Data);
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingNPS: false });
    }
  }

  async fetchTrendingThemes() {
    this.setState({ isFetchingTrendingThemes: true });

    try {
      const fetchTrendingThemesResult = await this.props.homeActions.fetchTrendingThemes();
      this.props.homeActions.setTrendingThemes(
        fetchTrendingThemesResult.data.Data
      );
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingTrendingThemes: false });
    }
  }

  onFetchSocialFeed = async () => {
    const { homeActions } = this.props;

    this.setState({ isFetchingSocialFeed: true });

    try {
      const fetchSocialFeedResult = await homeActions.fetchSocialFeed();
      homeActions.addSocialItems(
        fetchSocialFeedResult.data.records,
        fetchSocialFeedResult.data.offset
      );
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingSocialFeed: false });
    }
  };

  onActiveTabChanged = activeTab => {
    const { home } = this.props;
    this.setState({ activeTab }, () => {
      if (
        activeTab.toLowerCase() === "social" &&
        !home.socialItems.items.length
      ) {
        this.onFetchSocialFeed();
      }
    });
  };

  render() {
    const {
      home,
      conversations,
      collaborators,
      configurations,
      homeActions,
      windowDimensions,
      EventHandler,
      alertActions
    } = this.props;
    const {
      dateFilters,
      isFetchingActivityFeed,
      isFetchingFeedComments,
      isFetchingHomeFeed,
      npsFilters,
      isFetchingNPS,
      isFetchingContacted,
      isFetchingTrendingThemes,
      isRefreshingFeed,
      feedFilters,
      activeTab,
      isFetchingSocialFeed
    } = this.state;

    let contacted = home.contacted.items.map(value => ({
      date: moment(value.date, "x").toDate(),
      respondents: parseInt(value.contacted),
      finished: parseInt(value.finished),
      value
    }));

    // TODO: pick the last ten entries
    const daysInMonth = dateFilters.clone().daysInMonth();
    const padding = new Array(Math.abs(daysInMonth - contacted.length))
      .fill(0)
      .map((item, i) => ({
        date: contacted.length
          ? moment(contacted[contacted.length - 1].value.date).add(
              i + 1,
              "days"
            )
          : moment().add(i + 1, "days"),
        respondents: 0,
        finished: 0
      }));

    contacted = [...contacted, ...padding];

    const totalContacted = contacted.reduce(
      (currentValue, nextValue) => currentValue + nextValue.respondents,
      0
    );
    const totalResponded = contacted.reduce(
      (currentValue, nextValue) => currentValue + nextValue.finished,
      0
    );

    return (
      <SimpleLayoutExtended
        customActionBar={
          <HomeActionBar
            feedFilters={this.state.feedFilters}
            onFeedFiltersChanged={this.onFeedFiltersChanged}
            isLoadingFeed={this.state.isFetchingFeedComments}
            isLoadingSocialFeed={isFetchingSocialFeed}
            nps={this.props.home.nps}
            setNPSFilters={this.setNPSFilters}
            windowDimensions={this.props.windowDimensions}
            activeTab={this.state.activeTab}
            onActiveTabChanged={this.onActiveTabChanged}
            configurations={configurations}
          />
        }
        rightDrawerComponent={
          this.props.windowDimensions.width >= 768 ? (
            <SideBarActivityLog
              activityLogs={this.props.activityLogs}
              collaborators={this.props.collaborators}
              EventHandler={this.props.EventHandler}
            />
          ) : (
            <TabbedActivityMetrics
              activityLog={
                <SideBarActivityLog
                  activityLogs={this.props.activityLogs}
                  collaborators={this.props.collaborators}
                  EventHandler={this.props.EventHandler}
                  windowDimensions={this.props.windowDimensions}
                />
              }
              metrics={
                <div
                  style={{
                    width: "100%",
                    padding: 10,
                    height: "100%",
                    overflow: "auto"
                  }}
                >
                  <ContainerDimensions>
                    {({ width }) => (
                      <NPSCard
                        width={width}
                        nps={this.props.home.nps}
                        setNPSFilters={this.setNPSFilters}
                        isFetchingNPS={this.state.isFetchingNPS}
                        isFetchingHomeFeed={this.state.isFetchingHomeFeed}
                        contactedCount={totalContacted}
                        respondedCount={totalResponded}
                        contactedLast30Days={
                          this.props.home.contactedLast30Days
                        }
                        onFeedFiltersChanged={this.onFeedFiltersChanged}
                        contacted={contacted}
                        totalContacted={totalContacted}
                        date={this.props.home.contacted.date}
                        isFetchingContacted={this.state.isFetchingContacted}
                      />
                    )}
                  </ContainerDimensions>
                  <TrendsToday
                    isFetchingTrendingThemes={
                      this.state.isFetchingTrendingThemes
                    }
                    trends={this.props.home.trendingThemes}
                    tag={this.state.tag}
                    setNPSTag={this.setNPSTag}
                    clearNPSTag={this.clearNPSTag}
                  />
                </div>
              }
            />
          )
        }
      >
        {activeTab === "NPS" ? (
          <NPSFeed
            home={home}
            dateFilters={dateFilters}
            isFetchingActivityFeed={isFetchingActivityFeed}
            isFetchingFeedComments={isFetchingFeedComments}
            conversations={conversations}
            collaborators={collaborators}
            configurations={configurations}
            isFetchingHomeFeed={isFetchingHomeFeed}
            npsFilters={npsFilters}
            setNPSFilters={this.setNPSFIlters}
            isFetchingNPS={isFetchingNPS}
            homeActions={homeActions}
            onFeedFIltersChanged={this.onFeedFiltersChanged}
            isFetchingContacted={isFetchingContacted}
            isFetchingTrendingThemes={isFetchingTrendingThemes}
            onLoadMoreActivityFeedItems={this.onLoadMoreActivityFeedItems}
            windowDimensions={windowDimensions}
            EventHandler={EventHandler}
            alertActions={alertActions}
            isRefreshingFeed={isRefreshingFeed}
            conversations={conversations}
            setNPSFilters={this.setNPSFilters}
            feedFilters={feedFilters}
            setNPSTag={this.setNPSTag}
            clearNPSTag={this.clearNPSTag}
          />
        ) : (
          <SocialFeed
            socialItems={home.socialItems}
            dateFilters={dateFilters}
            homeActions={homeActions}
          />
        )}
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(HomeFeed);
