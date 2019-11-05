/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-grid-system';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Spinner from 'react-spinner-material';

import Themes from '../Themes';
import NPSCategories from './NSPCategories';
import Feedback from 'Modules/voc/containers/Home/components/feedback';
import ActionButton from 'SharedComponents/action-button-styled';
import * as homeActions from 'Modules/voc/containers/Homeflux/actions';
import * as collaboratorsActions from 'Modules/voc/containers/Settings/Collaborators/flux/actions';

@connect((state) => ({
  home: state.home,
  collaborators: state.collaborators,
}),
(dispatch) => ({
  homeActions: bindActionCreators(homeActions, dispatch),
  collaboratorsActions: bindActionCreators(collaboratorsActions, dispatch),
  dispatch,
}))

export default class Comments extends Component {
  static propTypes = {
    windowDimensions: PropTypes.object,
    home: PropTypes.object,
    themes: PropTypes.object,
    colors: PropTypes.array,
    alertActions: PropTypes.object,
    configurations: PropTypes.object,
    collaborators: PropTypes.array,
    homeActions: PropTypes.object,
    collaboratorsActions: PropTypes.object,
    conversationActions: PropTypes.object,
    EventHandler: PropTypes.object,
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
      selectedThemes,
      isFetchingFeedComments: false,
      isFetchingActivityFeed: false,
      npsFilters: {},
      tag: null,
      feedFilters: {
        detractors: true,
        passives: false,
        promoters: false,
        bookmarked: false,
        read: false,
        from: moment().subtract(30, 'days'),
        to: moment(),
        tag: null,
        category: 'detractors',
      },
    };

    this.onChange = this.onChange.bind(this);
    this.onFeedFiltersChanged = this.onFeedFiltersChanged.bind(this);
    this.setNPSFilters = this.setNPSFilters.bind(this);
    this.fetchCollaborators = this.fetchCollaborators.bind(this);
    this.fetchActivityFeed = this.fetchActivityFeed.bind(this);
    this.onFetchFeedComments = this.onFetchFeedComments.bind(this);
    this.onLoadMoreActivityFeedItems = this.onLoadMoreActivityFeedItems.bind(this);
  }

  componentDidMount() {
    const { home } = this.props;
    const { feedFilters } = this.state;
    // fetch initial list of detractors
    if (!home.feedItems.detractors.length) {
      this.onFetchFeedComments({
        ...feedFilters, category: 'detractors', limit: 10, offset: home.feedItems.detractors.length,
      }, false);
    }

    // fetch initial list of passives
    if (!home.feedItems.detractors.length) {
      this.onFetchFeedComments({
        ...feedFilters, category: 'passives', limit: 10, offset: home.feedItems.passives.length,
      }, false);
    }

    // fetch initial list of promoters
    if (!home.feedItems.detractors.length) {
      this.onFetchFeedComments({
        ...feedFilters, category: 'promoters', limit: 10, offset: home.feedItems.promoters.length,
      }, false);
    }

    this.fetchCollaborators();
  }

  onChange(selectedThemes) {
    this.setState({ selectedThemes });
  }

  onFeedFiltersChanged(changes, clearStore = false) {
    const { home } = this.props;
    const { feedFilters } = this.state;
    let nextFilters = { ...feedFilters, ...changes };
    if (Object.keys(changes).includes('promoters') || Object.keys(changes).includes('passives') || Object.keys(changes).includes('detractors')) {
      nextFilters = { ...{ promoters: false, passives: false, detractors: false }, ...{ [Object.keys(changes)[0]]: true, category: Object.keys(changes)[0] } };
    }

    this.setState({ feedFilters: { ...feedFilters, ...nextFilters } }, () => {
      const { feedFilters } = this.state;
      this.onFetchFeedComments({ ...feedFilters, limit: 10, offset: home.feedItems[feedFilters.category].length }, clearStore);
    });
  }

  async onFetchFeedComments(options, clearStore = false) {
    const { homeActions, alertActions, EventHandler } = this.props;
    this.setState({ isFetchingFeedComments: true });

    // TODO: work on supporting these filters in the next iteration
    delete options.promoters;
    delete options.passives;
    delete options.detractors;
    delete options.from;
    delete options.to;
    const filters = {};

    const { npsFilters } = this.state;
    Object.keys(npsFilters).forEach((key) => {
      if (npsFilters[key]) {
        filters[key] = npsFilters[key];
      }
    });

    try {
      const fetchHomeFeedresult = await homeActions.fetchActivityFeed({ ...options, ...filters }); // NOTE: offset is passed in options
      const commentsItems = fetchHomeFeedresult.data.Data.map((item) => ({ ...item, uiSortDate: moment(item.createDate), type: 'comment' }));

      if (clearStore) {
        homeActions.clearHomeFeed();
      }

      homeActions.addFeedItems(options.category, commentsItems);
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingFeedComments: false });
    }
  }

  onLoadMoreActivityFeedItems() {
    const { home } = this.props;
    const { feedFilters } = this.state;
    this.onFetchFeedComments({ ...feedFilters, limit: 10, offset: home.feedItems[feedFilters.category].length }, false);
  }

  setNPSFilters(npsFilters = {}) {
    const { home } = this.props;
    const { feedFilters } = this.state;
    this.setState({ npsFilters }, () => {
      this.onFetchFeedComments({ ...feedFilters, limit: 10, offset: home.feedItems[feedFilters.category].length }, true);
    });
  }

  async fetchCollaborators() {
    const { collaboratorsActions, EventHandler } = this.props;
    try {
      const fetchCollaboratorsResult = await collaboratorsActions.fetchCollaborators();
      collaboratorsActions.addCollaborators(fetchCollaboratorsResult.data.Data);
    } catch (exception) {
      EventHandler.handleException(exception);
    }
  }

  async fetchActivityFeed(options, clearFeed = false) {
    const { homeActions, home, EventHandler } = this.props;
    const { feedFilters, tag } = this.state;
    this.setState({ isFetchingActivityFeed: true });

    try {
      const fetchActivityFeedResult = await homeActions.fetchActivityFeed({
        ...options, limit: 10, offset: home.feedItems[feedFilters.category].length, tag,
      });
      const activityFeedItems = fetchActivityFeedResult.data.Data.map((item) => ({ ...item, uiSortDate: moment(item.createDate), type: 'comment' }));
      if (clearFeed) {
        homeActions.removeFeedItems();
      }
      homeActions.addFeedItems(activityFeedItems);
    } catch (exception) {
      // TODO: handle exception
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingActivityFeed: false });
    }
  }

  async fetchConversations() {
    const { EventHandler, conversationActions } = this.props;
    try {
      const fetchConversationsResult = await conversationActions.fetchConversations(1, 'active');
      conversationActions.setConversations({
        items: fetchConversationsResult.data.Data.objects,
        page: 1,
        totalCount: fetchConversationsResult.data.Data.meta.totalCount,
      }, 'active');
    } catch (exception) {
      EventHandler.handleException(exception);
    }
  }

  render() {
    const { themes, colors, alertActions, collaborators, configurations, homeActions, home, EventHandler, windowDimensions } = this.props;
    const { selectedThemes, feedFilters, isFetchingFeedComments, isFetchingActivityFeed } = this.state;
    const { feedItems } = home;
    const visibleFeedItemsGroup = feedItems[feedFilters.category];

    let timeline = [];
    let currentUISortdate;

    if (visibleFeedItemsGroup.length) {
      timeline.push({
        type: 'date',
        value: visibleFeedItemsGroup[0].uiSortDate,
      });

      currentUISortdate = visibleFeedItemsGroup[0].uiSortDate;
    }

    visibleFeedItemsGroup.forEach((feedItem) => {
      if (currentUISortdate.diff(feedItem.uiSortDate, 'days') > 0) {
        currentUISortdate = feedItem.uiSortDate;
        timeline.push({
          type: 'date',
          value: feedItem.uiSortDate,
        });
      }

      timeline.push(feedItem);
    });

    timeline = timeline.filter((comment) => comment.systemTags && comment.systemTags.some((tag) => selectedThemes.includes(tag)));

    return (
      <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
          <div style={{ width: '100%', fontSize: 18, fontWeight: 100, lineHeight: 1.78, color: '#434656' }}>
            <span style={{ fontSize: 20, fontWeight: 900, marginRight: 5 }}>Themes</span>
            &nbsp;Comments
          </div>
          <Themes themes={themes} selectedThemes={selectedThemes} colors={colors} onChange={this.onChange} alertActions={alertActions} />
          <NPSCategories feedFilters={feedFilters} onFeedFiltersChanged={this.onFeedFiltersChanged} isLoadingFeed={isFetchingFeedComments} nps={home.nps} setNPSFilters={this.setNPSFilters} windowDimensions={windowDimensions} />
          <div style={{ width: '100%', paddingTop: 20 }}>
            <Row style={{ width: '100%', margin: 0, padding: 0 }}>
              {
                !timeline.length && (isFetchingActivityFeed || isFetchingFeedComments) ? (
                  <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
                    <span style={{ margin: 20 }}>Fetching comments...</span>
                  </div>
                ) : !timeline.length && !isFetchingActivityFeed && !isFetchingFeedComments ? (
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>No comments to display</div>
                ) : timeline.map((item) => {
                  if (item.type === 'comment') {
                    return (
                      <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                        <Feedback comment={item} collaborators={collaborators} configurations={configurations} homeActions={homeActions} EventHandler={EventHandler} alertActions={alertActions} />
                      </Col>
                    );
                  }
                  return null;
                })
              }
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', padding: '10px 0' }}>
                {
                  !home.feedItems[feedFilters.category].length ? null : !isFetchingFeedComments ? ( // eslint-disable-line no-nested-ternary
                    <ActionButton text="Load More" onClick={this.onLoadMoreActivityFeedItems} disabled={false} style={{ borderRadius: 15, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px 20px', marginTop: 10 }} />
                  ) : (
                    <div style={{ marginTop: 10 }}>
                      <Spinner spinnerColor="#487db3" size={30} spinnerWidth={4} />
                    </div>
                  )
                }
              </div>
            </Row>
          </div>
        </div>
      </Col>
    );
  }
}
