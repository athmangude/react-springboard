import React, { Component } from 'react';
import Formsy from 'formsy-react';
import PropTypes from 'prop-types';

import Input from 'SharedComponents/mwamba-input';
import ActionButton from 'SharedComponents/action-button';

import logo from 'Images/logo.png';

export default class OTP extends Component {
  static propTypes = {
    otp: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onValid = this.onValid.bind(this);
    this.onInvalid = this.onInvalid.bind(this);
    this.onValidSubmit = this.onValidSubmit.bind(this);
    this.onInvalidSubmit = this.onInvalidSubmit.bind(this);
  }

  state = {
    isValid: false,
    isSubmitting: false,
  }

  onChange(event) {
    this.props.onChange(event);
  }

  onValid() {
    this.setState({ isValid: true });
  }

  onInvalid() {
    this.setState({ isValid: false });
  }

  onValidSubmit(formData) {
    this.setState({
      isSubmitting: true,
    }, () => {      
      this.props.submitOTP(formData);
    });
  }

  onInvalidSubmit() {
    // TODO: post a message informing user of form invalid state
    this.setState({ isValid: false });
  }

  render() {
    const { otp } = this.props;
    return (
      <div
        style={{
          minWidth: 300, minHeight: 400, maxWidth: 400, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', boxShadow: '0 0 10px 1px #e1e4e8', borderRadius: 8, backgroundColor: 'white',
        }}
      >
        <img src={logo} className="image" alt="logo" style={{ height: 79, width: 163, margin: 20 }} />
        <h3 style={{ fontWeight: 100, marginTop: 35 }}>Enter the One Time Password you received on your phone</h3>
        <Formsy
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
          }}
          onValidSubmit={this.onValidSubmit}
          onInvalidSubmit={this.onInvalidSubmit}
          onValid={this.onValid}
          onInvalid={this.onInvalid}
        >
          <div
            style={{
              width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', margin: '30px 0',
            }}
          >
            <small style={{ fontSize: 15, margin: '0 0 10px' }}>Enter the OTP Code you received through SMS</small>
            <Input name="accessCode" value={otp.accessCode} type="text" validations={{ minLength: 2, isExisty: true }} validationErrors={{ isExisty: 'this field is required', minLength: 'too short', isAlpha: 'use alphabetic characters only' }} required isDefaultRequiredValue placeholder="OTP code" onChange={this.onChange} style={{ width: '100%' }} />
          </div>
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
            }}
          >
            <span
              onClick={this.props.onGoBack}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <small>Back</small>
            </span>
            <ActionButton type="submit" text="Submit" loading={this.props.isSubmittingOTPCode} disabled={!this.state.isValid || this.props.isSubmittingOTPCode} large style={{ alignSelf: 'flex-end' }} />
          </div>
        </Formsy>
      </div>
    );
  }
}
