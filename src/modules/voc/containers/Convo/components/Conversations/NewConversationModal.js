import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';

export default class NewConversationModal extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    newConversationHandler: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {
    isSubmitting: false,
    commId: '',
    message: '',
  }

  async onSubmit() {
    this.setState({ isSubmitting: true });
    const { commId, message } = this.state;
    if (!message || !message.trim() || !commId || !commId.trim()) {
      this.setState({ isSubmitting: false });
      return;
    }

    await this.props.newConversationHandler(message, commId);
    this.setState({ isSubmitting: false, message: '', commId: '' });
    this.props.onClose();
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { commId, message, isSubmitting } = this.state;
    const { open, onClose } = this.props;
    return (
      <Modal size={'tiny'} dimmer={'blurring'} open={open} onClose={onClose} style={{ marginTop: 170, marginRight: 'auto', marginLeft: 'auto', position: 'relative' }}>
        <Modal.Header style={{ backgroundColor: '#d9d9d9' }}>
          <div style={{ height: 15, width: '100%', fontFamily: 'Lato', fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, textAlign: 'left', color: '#6d6e71', textAlign: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'inherit !important' }}>
            <i className="material-icons" style={{ paddingRight: 10 }}>sms</i>
            <span style={{ backgroundColor: 'inherit' }}>New Message</span>
          </div>
        </Modal.Header>
        <Modal.Content style={{ padding: 0 }}>
          <input
            style={{ height: 40, width: '100%', fontSize: 16, letterSpacing: 0.6, color: '#6d6e71', borderBottom: '1px solid #d9d9d9', padding: 30 }}
            type="text"
            placeholder="Telephone Number..."
            name="commId"
            value={commId}
            onChange={this.handleChange}
          />
          <textarea
            style={{ height: 200, width: '100%', fontSize: 16, letterSpacing: 0.6, color: '#6d6e71', padding: 30 }}
            placeholder="Message..."
            name="message"
            value={message}
            onChange={this.handleChange}
          />
          <button
            style={{ width: '100%', height: 70, backgroundColor: '#487db3', textAlign: 'center', color: '#ffffff', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
            onClick={this.onSubmit}
            disabled={isSubmitting}
          >{isSubmitting ? (<Spinner spinnerColor="#ffffff" size={30} spinnerWidth={3} />) : 'Send'}</button>
        </Modal.Content>
      </Modal>
    );
  }
}
