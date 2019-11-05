/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';

import IconButton from 'SharedComponents/icon-button';

export default class SendEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subject: '',
      message: '',
      emailSent: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSendEmail = this.onSendEmail.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSendEmail() {
    this.setState({ emailSent: true });
  }

  onCloseModal() {
    this.handlRef.click();
    this.setState({ emailSent: false, subject: '', message: '' });
  }

  render() {
    const { subject, message, emailSent } = this.state;
    return (
      <div ref={(ref) => { this.handlRef = ref; }}>
        <Modal
          trigger={(
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', padding: '0 10px 0 10px', color: 'rgb(109, 110, 113)', fontSize: 11, height: 35, borderRadius: 2, boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.07)', backgroundColor: '#ffffff', border: 'solid 1px #e2e4eb', marginLeft: 10 }}>
              <i className="material-icons" style={{ fontSize: 20, marginRight: 10 }}>email</i>
              <span>Send Email</span>
            </div>
          )}
          onClose={this.onCloseModal}
          style={{ marginTop: 170, position: 'relative', marginRight: 'auto', marginLeft: 'auto', borderRadius: 8 }}
        >
          <Modal.Content style={{ padding: 0, borderRadius: 8, backgroundColor: '#f8f9fa' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 22, fontSize: 16, fontWeight: 900, color: '#6d6e71' }}>
                <i className="material-icons" style={{ fontSize: 20, marginRight: 10 }}>email</i>
                <div>Send Email</div>
              </div>
              <button type="button" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ontSize: 12, fontWeight: 900, color: '#a9adaf' }}>
                <IconButton onClick={this.onCloseModal} icon="close" />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: 22, fontSize: 14, color: '#6d6e71', padding: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 900, marginRight: 10 }}>To: </div>
              <div>
                <div style={{ paddingRight: 10, paddingLeft: 10, backgroundColor: '#eee', padding: '3px 8px 2px 8px', borderRadius: 5 }}>401 Nairobi customers with...</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: 22, fontSize: 14, color: '#6d6e71', padding: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 900, marginRight: 10 }}>Subject: </div>
              <div style={{ width: '100%' }}>
                <input onChange={this.onChange} value={subject} name="subject" disabled={emailSent} style={{ width: '100%', height: 22, border: 'none', backgroundColor: '#ffffff', padding: 10, fontSize: 16, fontWeight: 900, color: '#d9d9d9', borderRadius: 8 }} placeholder="Type your subject here..." />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', borderTop: '1px solid #d9d9d9', padding: 20 }}>
              <textarea onChange={this.onChange} value={message} name="message" disabled={emailSent} style={{ width: '100%', height: 200, border: 'none', backgroundColor: '#ffffff', padding: 10, fontSize: 16, fontWeight: 900, color: '#d9d9d9', marginBottom: 20, borderRadius: 8 }} placeholder="Type your message here..." />
              <button type="button" onClick={this.onSendEmail} disabled={emailSent} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 200, height: 40, borderRadius: 8, backgroundColor: emailSent ? '#52bf8a' : '#2574a6', fontSize: 12, fontWeight: 900, color: '#ffffff' }}>
                <span>{emailSent ? 'Email Sent' : 'Send Email'}</span>
                {emailSent ? (<i className="material-icons" style={{ marginLeft: 10 }}>check</i>) : null }
              </button>
            </div>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
