/* eslint-disable jsx-a11y/href-no-hash, no-return-assign, no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'semantic-ui-react';

import ActionButton from 'SharedComponents/action-button';

import * as conversationActions from '../../flux/actions';

@connect((state) => ({
  audiences: state.audiences,
  authentication: state.authentication,
}), (dispatch) => ({
  conversationActions: bindActionCreators(conversationActions, dispatch),
  dispatch,
}))
export default class DeleteSurveyModal extends Component {
  static propTypes = {
    EventHandler: PropTypes.object.isRequired,
    conversation: PropTypes.string,
    listType: PropTypes.object.isRequired,
    onHideDeleteSurveyModal: PropTypes.func,
    conversationActions: PropTypes.object,
    alertActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
    this.onConfirmationChange = this.onConfirmationChange.bind(this);
  }

  state = {
    open: true,
    isDeletingSurvey: false,
    serverErrorMessage: '',
    confirmation: '',
  }

  async onDelete() {
    const { conversationActions, EventHandler, alertActions, conversation, listType, onHideDeleteSurveyModal } = this.props;
    const { confirmation } = this.state;
    if (confirmation !== 'DELETE') {
      alertActions.addAlert({ type: 'error', message: 'Type confirmation text to confirm your action' });
      return;
    }
    this.setState({ isDeletingSurvey: true });
    try {
      await conversationActions.deleteConversation(conversation.id); // eslint-disable-line no-unused-vars
      conversationActions.removeConversation(conversation.id, listType);
      this.onClose();
      onHideDeleteSurveyModal();
      alertActions.addAlert({ type: 'success', message: 'Survey deleted successfully' });
      EventHandler.trackEvent({ category: 'Surveys', action: 'delete survey', value: true });
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      let errorMessage = 'Oops! Something went wrong and we could not send out the survey. Please try again later.';

      if (Object.keys(exception).includes('message')) {
        errorMessage = exception.message;
      } else if (Object.keys(exception).includes('response')) {
        if (Object.keys(exception.response).includes('data') && Object.keys(exception.response.data.message)) {
          errorMessage = exception.response.data.message || errorMessage;
        }
      }
      this.setState({ serverErrorMessage: errorMessage });
      EventHandler.handleException(exception);
      EventHandler.trackEvent({ category: 'Surveys', action: 'delete survey', value: false });
    } finally {
      this.setState({ isDeletingSurvey: false });
    }
  }

  onClose() {
    this.setState({ open: false });
  }

  onConfirmationChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { onHideDeleteSurveyModal } = this.props;
    const { open, serverErrorMessage, isDeletingSurvey, confirmation } = this.state;
    return (
      <Modal dimmer="blurring" open={open} onClose={this.close} centered={false} closeOnDimmerClick closeOnEscape closeOnRootNodeClick style={{ borderRadius: 16, marginTop: 170, marginRight: 'auto', marginLeft: 'auto', position: 'relative' }}>
        <Modal.Content style={{ borderRadius: 16 }}>
          <h1 style={{ border: 'none', margin: 'calc(2rem - 0.14285714em ) 0em 1rem', fontFamily: 'Lato, Helvetica Neue, Arial, Helvetica, sans-serif', fontWeight: 'bold', lineHeight: '1.28571429em', color: 'rgba(0, 0, 0, 0.87)' }}>Delete Survey</h1>
          <div>Are you sure you want to delete this survey?</div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <p>Type DELETE to confirm</p>
              <input type="text" name="confirmation" onChange={this.onConfirmationChange} placeholder="" value={confirmation} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px' }} />
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <ActionButton disabled={isDeletingSurvey} onClick={onHideDeleteSurveyModal} text="Dismiss" />
            <ActionButton onClick={this.onDelete} disabled={isDeletingSurvey || confirmation !== 'DELETE'} loading={isDeletingSurvey} text="Delete" />
          </div>
          {
            serverErrorMessage.length ? (
              <div className="form-errors-indicator" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fd9681', color: '#FFF', margin: '10px -21px -21px', padding: 5, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                <i className="material-icons">error_outline</i>
                &nbsp;&nbsp;
                <span>{serverErrorMessage}</span>
              </div>
            ) : null
          }
        </Modal.Content>
      </Modal>
    );
  }
}
