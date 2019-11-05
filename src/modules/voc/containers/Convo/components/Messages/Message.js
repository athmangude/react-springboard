import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SentMessage from './SentMessage';
import ReceivedMessage from './ReceivedMessage';
import StartIssuePresenter from './../StartIssuePresenter';
import EndIssuePresenter from './../EndIssuePresenter';

export default class Message extends Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
    issues: PropTypes.array,
    activeParticipant: PropTypes.object,
    initials: PropTypes.object,
    account: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onAddTag = this.onAddTag.bind(this);
    this.onTagFieldKeyDown = this.onTagFieldKeyDown.bind(this);
    this.onTagFieldChanged = this.onTagFieldChanged.bind(this);
  }

  state = {
    tags: [],
    currentTag: '',
    isSubmitting: false,
  }

  onAddTag() {
    if (!this.state.currentTag.replace(/\s/g, '').length) {
      return;
    }

    this.setState({
      tags: [...this.state.tags, this.state.currentTag],
      currentTag: '',
    });
  }

  onTagFieldKeyDown(event) {
    if (event.keyCode === 13) {
      this.onAddTag(event);
    }
  }

  onTagFieldChanged(event) {
    this.setState({
      currentTag: event.target.value,
    });
  }

  render() {
    const { message, issues, activeParticipant, initials, account } = this.props;

    if (!message) {
      return null;
    }

    return (
      <div>
        <StartIssuePresenter issues={issues} messageId={message.id} />
        {message.originatedFrom === 'userId' ? (<SentMessage message={message} account={account} />) : (<ReceivedMessage message={message} activeParticipant={activeParticipant} initials={initials} />)}
        <EndIssuePresenter issues={issues} messageId={message.id} />
      </div>
    );
  }
}
