import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NewConversationModal from './NewConversationModal';
import ActivityActivityHandler from 'Utils/ActivityHandler';

import * as liveChatActions from '../../flux/actions';

@connect(() => ({}),
(dispatch) => ({
  liveChatActions: bindActionCreators(liveChatActions, dispatch),
  dispatch,
}))

export default class NewConversationFAB extends Component {
  static propTypes = {
    platformId: PropTypes.number,
    loading: PropTypes.bool,
    dispatch: PropTypes.func,
    alertActions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.toggleNewConversationModal = this.toggleNewConversationModal.bind(this);
    this.newConversationHandler = this.newConversationHandler.bind(this);
  }

  state = {
    openNewConversationModal: false,
  };

  toggleNewConversationModal(e) {
    if (e) e.preventDefault();
    this.setState((state) => ({ openNewConversationModal: !state.openNewConversationModal }));
  }

  async newConversationHandler(message, commId) {
    try {
      const newConversationResult = await this.props.liveChatActions.newConversation({ message, commId });
      if (newConversationResult.data.data.Data.id) {
        this.props.alertActions.addAlert({ message: 'New message successfully sent' });
      }
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      ActivityActivityHandler.handleException(this.props.dispatch, exception);
    }
  }

  render() {
    const { platformId } = this.props;
    const { openNewConversationModal } = this.state;
    return (
      <div role="button" tabIndex={0} onClick={this.toggleNewConversationModal} style={{ position: 'absolute', right: 20, bottom: 50, width: 55, height: 55, borderRadius: '50%', backgroundImage: 'linear-gradient(139deg, #fad961, #f76b1c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="material-icons" style={{ height: 20, color: '#ffffff' }}>add</i>
        <NewConversationModal activePlatformId={platformId} onClose={this.toggleNewConversationModal} open={openNewConversationModal} newConversationHandler={this.newConversationHandler} />
      </div>
    );
  }
}
