import React, { Component } from 'react';
import Formsy from 'formsy-react';
import PropTypes from 'prop-types';

import Input from 'SharedComponents/mwamba-input';
import ActionButton from 'SharedComponents/action-button';

import logo from 'Images/logo.png';

export default class UserDetails extends Component {
  static propTypes = {
    userDetails: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onShowOTP: PropTypes.func.isRequired,
    isRegistering: PropTypes.bool.isRequired,
    wifiDetails: PropTypes.object,
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
      this.props.onShowOTP(formData);
    });
  }

  onInvalidSubmit() {
    // TODO: post a message informing user of form invalid state
    this.setState({ isValid: false });
  }

  render() {
    const { userDetails, wifiDetails } = this.props;
    let logo = null;
    let welcomeMsg = null;

    if (wifiDetails.logo) {
      logo = <img src={wifiDetails.logo} className="image" alt="logo" style={{ height: 100, width: 100, margin: 20 }} />;
    } else {
      logo = <img src={logo} className="image" alt="logo" style={{ height: 100, width: 100, margin: 20 }} />
    }

    if (wifiDetails.welcomeMsg) {
      welcomeMsg = <h2 style={{ fontWeight: 100, marginTop: 35 }}>{wifiDetails.welcomeMsg}</h2>
    } else {
      welcomeMsg = <h2 style={{ fontWeight: 100, marginTop: 35 }}>Welcome customer.</h2>
    }
    return (
      <div
        style={{
          minWidth: 300, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', boxShadow: '0 0 10px 1px #e1e4e8', borderRadius: 8, backgroundColor: 'white',
        }}
      >
        { logo }
        { welcomeMsg }
        <h3 style={{ fontWeight: 100, marginTop: 35 }}>Getting started is easy</h3>        
        <Formsy
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
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
            <small style={{ fontSize: 15, margin: '0 0 10px' }}>Name</small>
            <Input name="firstName" value={userDetails.firstName} type="text" validations={{ isWords: true }} validationErrors={{ isWords: 'use alphabetic characters only' }} placeholder="Please enter your name (optional)" onChange={this.onChange} style={{ width: '100%' }} />
          </div>
          {/* <div
            style={{
              width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', margin: '30px 0',
            }}
          >
            <small style={{ fontSize: 15, margin: '0 0 10px' }}>Surname</small>
            <Input name="lastName" value={userDetails.lastName} type="text" validations={{ isExisty: true, minLength: 2, isAlpha: true }} validationErrors={{ isExisty: 'this field is required', minLength: 'too short', isAlpha: 'use alphabetic characters only' }} required isDefaultRequiredValue placeholder="enter your surname" onChange={this.onChange} style={{ width: '100%' }} />
          </div>
          <div
            style={{
              width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', margin: '30px 0',
            }}
          >
            <small style={{ fontSize: 15, margin: '0 0 10px' }}>Email</small>
            <Input name="email" value={userDetails.email} type="email" validations={{ isEmail: true, isExisty: true }} validationErrors={{ isExisty: 'this field is required', isEmail: 'use a valid email' }} required isDefaultRequiredValue placeholder="enter your email" onChange={this.onChange} style={{ width: '100%' }} />
          </div> */}
          <div
            style={{
              width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', margin: '30px 0',
            }}
          >
            <small style={{ fontSize: 15, margin: '0 0 10px' }}>Phone Number </small>
            <small style={{ fontSize: 14, color: '#767676', margin: '-10px 0 14px' }}>We need this to send you the password</small>
            <Input
              name="msisdn"
              value={userDetails.msisdn}
              type="text"
              validations={{
                isExisty: true, minLength: 10, maxLength: 16, matchRegexp: /^\+{0,1}(?:[0-9] ?){6,14}[0-9]$/,
              }}
              validationErrors={{
                isExisty: 'this field is required', minLength: 'too short', maxLength: 'too long', matchRegexp: 'invalid phone number',
              }}
              required
              isDefaultRequiredValue
              placeholder="+254701234567"
              onChange={this.onChange}
              style={{ width: '100%' }}
            />
          </div>
          <ActionButton type="submit" text="Proceed" loading={this.props.isRegistering} disabled={!this.state.isValid || this.props.isRequired} large style={{ alignSelf: 'flex-end' }} />
        </Formsy>
      </div>
    );
  }
}
