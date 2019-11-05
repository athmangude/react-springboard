import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import Message from './Message';
import SendMessage from './SendMessage';
import MessagePlaceholder from './MessagePlaceholder';
import DatePresenter from './../DatePresenter';
import RespondentPreview from '../CurrentRespondent/Preview';
import EmptyConversation from '../EmptyConversation';
import ActivityActivityHandler from 'Utils/ActivityHandler';
import ActionButton from 'SharedComponents/action-button';

import * as liveChatActions from '../../flux/actions';
// import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';

const today = moment().format('dddd, Do MMM');

@connect((state) => ({
  convo: state.convo,
  history: state.history,
  route: state.route,
}),
(dispatch) => ({
  liveChatActions: bindActionCreators(liveChatActions, dispatch),
  // notificationActions: bindActionCreators({ addAlert }, dispatch),
  dispatch,
}))

export default class Messages extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    liveChatActions: PropTypes.object,
    activeConversationId: PropTypes.string,
    activeParticipant: PropTypes.object,
    loading: PropTypes.bool,
    pollTime: PropTypes.number,
    backToConversations: PropTypes.func,
    width: PropTypes.number,
    alertActions: PropTypes.object,
    account: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { activeConversationId } = props;
    this.state = {
      isLoadingMessages: true,
      isLoadingMoreMessages: false,
      isSendingMessage: false,
      totalCount: 0,
      limit: 15,
      offset: 0,
      activeConversation: {
        messages: [],
        user: {},
      },
      activeConversationIssues: [],
      activeConversationId,
      lastPollTime: props.pollTime,
    };

    this.fetchConversation = this.fetchConversation.bind(this);
    this.loadMoreMessages = this.loadMoreMessages.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentWillReceiveProps(newProps) {
    const { activeConversationId, lastPollTime } = this.state;
    if (newProps.activeConversationId !== activeConversationId) {
      this.setState({
        activeConversationId: newProps.activeConversationId,
        activeConversation: {
          messages: [],
        },
        activeConversationIssues: [],
      }, () => {
        this.fetchConversation(newProps.activeConversationId);
      });
    }

    if (lastPollTime !== newProps.pollTime && newProps.activeConversationId) {
      this.setState({ lastPollTime: newProps.pollTime }, () => this.fetchConversation(newProps.activeConversationId, true));
    }
  }

  async fetchConversation(activeConversationId, polling = false) {
    this.setState({
      isLoadingMessages: !polling,
    });

    const { limit, offset, activeConversation } = this.state;
    let newParticipantId = activeConversationId;

    try {
      const fetchConversationResult = await this.props.liveChatActions.fetchConversation(activeConversationId, limit + offset, 0);
      const newMessages = polling ? fetchConversationResult.data[0].Data.items.messages : activeConversation.messages.concat(fetchConversationResult.data[0].Data.items.messages);
      this.setState({
        activeConversation: { ...fetchConversationResult.data[0].Data.items, messages: newMessages },
        totalCount: fetchConversationResult.data[0].Data.totalCount,
        activeConversationIssues: fetchConversationResult.data[1].Data,
      });
    } catch (exception) {
      newParticipantId = null;
      ActivityActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({
        isLoadingMessages: false,
        activeParticipantConversationId: newParticipantId,
      });
    }
  }

  async loadMoreMessages() {
    this.setState({ isLoadingMoreMessages: true });

    const { limit, offset, activeConversationId } = this.state;
    const newOffset = limit + offset;

    try {
      const fetchConversationResult = await this.props.liveChatActions.fetchConversation(activeConversationId, limit, newOffset);
      const { activeConversation, activeConversationIssues } = this.state;
      const newMessages = activeConversation.messages.concat(fetchConversationResult.data[0].Data.items.messages);
      const newActiveConversationIssues = activeConversationIssues.concat(fetchConversationResult.data[1].Data);
      this.setState({
        activeConversation: { ...activeConversation, messages: newMessages },
        totalCount: fetchConversationResult.data[0].Data.totalCount,
        activeConversationIssues: newActiveConversationIssues,
        offset: newOffset,
      });
    } catch (exception) {
      ActivityActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({
        isLoadingMoreMessages: false,
      }, () => true);
    }
  }

  sendMessageHandler = async (message, participantId) => {
    try {
      this.setState({ isSendingMessage: true });

      const sendMessageResult = await this.props.liveChatActions.sendMessage({ message, participantId });
      if (sendMessageResult.data.data.Data.id) {
        this.fetchConversation(participantId, true);
      }
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      ActivityActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({
        isSendingMessage: false,
      });
    }
  }

  scrollToBottom() {
    // eslint-disable-next-line
    const messagesScroller = ReactDOM.findDOMNode(this.messagesScroller);
    if (messagesScroller) {
      messagesScroller.scrollTo(0, messagesScroller.scrollHeight - messagesScroller.clientHeight);
    }
  }

  render() {
    const { activeConversation: { messages }, activeConversationIssues, activeConversationId, isLoadingMoreMessages, isLoadingMessages, isSendingMessage, limit, offset, totalCount } = this.state;
    const { loading, activeParticipant, backToConversations, width, account } = this.props;

    if (!activeConversationId && loading) {
      return (
        <EmptyConversation text={(<span>Loading...</span>)} />
      );
    }

    if (!activeConversationId && !loading) {
      return (
        <EmptyConversation text={(<span>Select a conversation to get started</span>)} />
      );
    }

    if (!activeConversationId) {
      return (
        <EmptyConversation text={(<span>Oops! Something went wrong!</span>)} />
      );
    }

    let initials = '';
    if (activeParticipant) {
      initials = activeParticipant.commId.substring(10, 13);
      if (activeParticipant.name.trim()) {
        const matches = activeParticipant.name.match(/\b(\w)/g);
        initials = matches.join('').toUpperCase();
      }
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: width > 425 ? 'calc(100vh - 60px)' : 'calc(100vh - 115px)', width: '100%' }}>
        <RespondentPreview activeParticipant={activeParticipant} loading={loading} initials={initials} backToConversations={backToConversations} width={width} />
        <div style={{ overflowX: 'hidden', overflowY: 'auto', width: '100%', height: width > 425 ? 'calc(100vh - 160px)' : 'calc(100vh - 230px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column-reverse' }} ref={(messagesScroller) => { this.messagesScroller = messagesScroller; }}>
            <MessagePlaceholder isLoading={isLoadingMessages || !messages.length} width={width} initial />
            <MessagePlaceholder isLoading={isSendingMessage} width={width} newMessage />
            {
              messages ? messages.map((message, index) => (
                [
                  <Message message={message} issues={activeConversationIssues} activeParticipant={activeParticipant} key={`message-${message.id}`} initials={initials} account={account} />,
                  <DatePresenter padding={80} today={today} currentDate={typeof messages[index + 1] === 'undefined' ? null : moment(message.createDate).format('dddd, Do MMM')} previousDate={typeof messages[index + 1] === 'undefined' ? moment(message.createDate).format('dddd, Do MMM') : moment(messages[index + 1].createDate).format('dddd, Do MMM')} key="date-presenter" />,
                ]
              )) : null
            }
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {(limit + offset < totalCount) && !loading ? (<ActionButton text={!isLoadingMoreMessages ? 'Check for more' : 'Checking for more'} large icon="history" loading={isLoadingMoreMessages} disabled={isLoadingMoreMessages} onClick={this.loadMoreMessages} />) : null }
            </div>
          </div>
        </div>
        <SendMessage participantId={activeConversationId} sendMessageHandler={this.sendMessageHandler} loading={loading} width={width} />
      </div>
    );
  }
}
