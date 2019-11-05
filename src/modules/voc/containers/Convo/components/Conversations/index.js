import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Loader } from 'semantic-ui-react';

import Conversation from './Conversation';
import DatePresenter from './../DatePresenter';
import ConversationsPlaceholder from '../../components/ConversationsPlaceholder';
import ActivityActivityHandler from 'Utils/ActivityHandler';

import * as liveChatActions from '../../flux/actions';

@connect((state) => ({
  convo: state.convo,
  history: state.history,
  route: state.route,
}),
(dispatch) => ({
  liveChatActions: bindActionCreators(liveChatActions, dispatch),
  dispatch,
}))

export default class Conversations extends Component {

  static propTypes = {
    activePlatformId: PropTypes.number,
    activeConversationId: PropTypes.number,
    dispatch: PropTypes.func,
    liveChatActions: PropTypes.object,
    convo: PropTypes.object,
    clickConversationHandler: PropTypes.func,
    pollTime: PropTypes.number,
    width: PropTypes.number,
  };

  constructor(props) {
    super(props);

    const { activePlatformId, activeConversationId } = props;

    this.state = {
      activePlatformId,
      activeConversationId,
      loading: true,
      loadingMoreConversations: false,
      totalCount: 0,
      limit: 10,
      offset: 0,
      lastPollTime: props.pollTime,
    };

    this.fetchConversations = this.fetchConversations.bind(this);
    this.loadMoreConversations = this.loadMoreConversations.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    const { activePlatformId } = this.state;
    if (!this.props.convo.conversations.length) {
      this.fetchConversations(activePlatformId);
    }
  }

  componentWillReceiveProps(newProps) {
    const { activePlatformId, activeConversationId, lastPollTime } = this.state;
    const { activePlatformId: newActivePlatformId, activeConversationId: newActiveConversationId, pollTime } = newProps;


    if (activePlatformId !== newActivePlatformId || activeConversationId !== newActiveConversationId) {
      this.setState(() => ({
        activePlatformId: newActivePlatformId,
        activeConversationId: newActiveConversationId,
      }));
      if (activePlatformId !== newActivePlatformId) {
        this.fetchConversations(newActivePlatformId);
      }
    }

    if (lastPollTime !== pollTime) {
      this.setState({ lastPollTime: pollTime }, () => this.fetchConversations(activePlatformId, true));
    }
  }

  async fetchConversations(platformId, polling = false) {
    const { toggleLoading } = this.props;
    const { limit, offset } = this.state;

    if (!polling) {
      toggleLoading(true);
      this.setState(() => ({
        loading: true,
      }));
    }

    try {
      const fetchConversationsResult = await this.props.liveChatActions.fetchConversations(platformId, limit, offset);
      this.props.liveChatActions.setConversations({
        conversations: fetchConversationsResult.data.Data.items,
        totalCount: fetchConversationsResult.data.Data.totalCount,
      });
    } catch (exception) {
      ActivityActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      toggleLoading(false);
      this.setState(() => ({
        loading: false,
      }));
    }
  }

  async loadMoreConversations() {
    const { limit, offset, activePlatformId } = this.state;
    this.setState({
      loadingMoreConversations: true,
    });

    const newOffset = limit + offset;

    try {
      this.setState({ offset: newOffset }, async () => {
        const fetchConversationsResult = await this.props.liveChatActions.fetchConversations(activePlatformId, limit, newOffset);
        this.props.liveChatActions.setMoreConversations({
          conversations: fetchConversationsResult.data.Data.items,
          totalCount: fetchConversationsResult.data.Data.totalCount,
        });
      });
    } catch (exception) {
      ActivityActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({
        isLoadingMoreConversations: false,
      });
    }
  }

  handleScroll() {
    const { limit, offset, totalCount, loadingMoreConversations } = this.state;
    // eslint-disable-next-line
    const conversationsScroller = ReactDOM.findDOMNode(this.conversationsScroller);

    if (conversationsScroller && conversationsScroller.scrollHeight - conversationsScroller.scrollTop <= conversationsScroller.clientHeight && limit + offset < totalCount && !loadingMoreConversations) {
      this.setState({ loadingMoreConversations: true }, () => {
        conversationsScroller.scrollTo(0, conversationsScroller.scrollTop + 150);
      });
      this.loadMoreConversations();
    }
  }

  render() {
    const today = moment().format('dddd, Do MMM');
    const { convo: { conversations }, clickConversationHandler, width } = this.props;
    const { loadingMoreConversations, activeConversationId, loading } = this.state;

    if (loading && !conversations.length) {
      return (
        <ConversationsPlaceholder loading={loading} array={[1, 2, 3]} />
      );
    }

    if (!loading && !conversations.length) {
      return (
        <ConversationsPlaceholder loading={loading} array={[1, 2, 3]} />
      );
    }

    return (
      <div
        onScroll={this.handleScroll}
        ref={(conversationsScroller) => { this.conversationsScroller = conversationsScroller; }}
        style={{ overflowX: 'hidden', overflowY: 'auto', width: '100%', height: width > 425 ? 'calc(100vh - 250px)' : 'calc(100vh - 300px)' }}
      >
        {
          conversations ? conversations.map((conversation, index) => (
            [
              <DatePresenter
                today={today}
                previousDate={typeof conversations[index - 1] === 'undefined' ? null : moment.utc(conversations[index - 1].message.createDate).format('dddd, Do MMM')}
                currentDate={moment.utc(conversation.message.createDate).format('dddd, Do MMM')}
                key={`date-presenter-${conversation.id}`}
              />,
              <Conversation
                conversation={conversation}
                key={`conversation-${conversation.participant.id}`}
                activeConversationId={activeConversationId}
                clickConversationHandler={clickConversationHandler}
              />,
            ]
          )) : null
        }
        <Loader active={loadingMoreConversations} indeterminate inline="centered" style={{ margin: '20px auto 20px auto', backgroundColor: 'transparent' }}>
          <span className="loader-text-wrapper">Loading more conversations...</span>
        </Loader>
      </div>
    );
  }
}
