/* eslint-disable jsx-a11y/href-no-hash */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import ContainerDimensions from 'react-container-dimensions';
import Alerts from 'Modules/shopping/containers/App/Alerts';

import ActionButton from 'SharedComponents/action-button-styled';
import PasswordToggleTextInput from 'SharedComponents/password-toggle-text-input';

import withAuthentication from 'Utils/withAuthentication';
import * as authenticationActions from '../flux/actions';
import * as authenticationMethods from '../flux/methods';

import themes from 'SharedComponents/themes';
const { primaryColor } = themes.light;

import logo from 'Images/logo.png';
import wrapperBackground from 'Images/empty_list_background.png';

@connect((state) => ({
  authentication: state.authentication,
}),
(dispatch) => ({
  authenticationActions: bindActionCreators(authenticationActions, dispatch),
}))
class SignIn extends PureComponent {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    EventHandler: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onGoToSignUp = this.onGoToSignUp.bind(this);
    this.onGoToForgotPassword = this.onGoToForgotPassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    username: '',
    password: '',
    isSigningIn: false,
    signInError: null,
    successfullySignedIn: null,
  };

  onKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.onSignIn();
    }
  }

  onGoToSignUp() {
    this.context.router.history.push('/sign-up');
  }

  onGoToForgotPassword() {
    this.context.router.history.push('/forgot-password');
  }

  async onSignIn() { // eslint-disable-line consistent-return
    this.setState({
      isSigningIn: true,
      successfullySignedIn: null,
    });

    try {
      const signInResult = await authenticationMethods.authenticate({ username: this.state.username.toLowerCase().trim(), password: this.state.password });
      const { data } = signInResult.data;
      const { token } = signInResult.data;
      const { Metadata, ...userdata } = data;

      this.props.authenticationActions.signIn(userdata, token);
      this.setState({
        successfullySignedIn: true,
      });

      this.props.EventHandler.trackEvent({ category: 'Authentication', action: 'sign in', value: true });

      this.context.router.history.replace('/');
    } catch (exception) {
      // TODO: appropriately handle the exception
      this.setState({
        signInError: null,
        successfullySignedIn: false,
      });

      this.props.EventHandler.trackEvent({ category: 'Authentication', action: 'sign in', value: false });

      if (!exception.response) {
        this.setState({
          signInError: 'Network Error! We could not authenticate you while offline. Also check if you are using HTTPS',
        });
      }

      if (exception.response && exception.response.status === 401) {
        this.setState({
          signInError: exception.response.data.message,
        });
      }

      this.props.alertActions.addAlert({ type: 'error', message: this.state.signInError || exception.message });
    } finally {
      this.setState({
        isSigningIn: false,
      });
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    return (
      <div className="login-wrapper" style={{ background: 'linear-gradient(0.25turn, #FFFFFF, #F0F3F3)', height: '100vh', width: '100vw' }}>
        <Helmet title="Sign In" meta={[{ name: 'description', content: '`Sign in page for Spring Board'}]} />
        <div style={{ width: '100%', height: '100vh', backgroundImage: `url(${wrapperBackground})`, backgroundSize: 'cover' }}>
          <Alerts />

          <ContainerDimensions>
            {
              ({ width }) => {
                if (width > 768) {
                  return (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '10px 100px 30px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', flexDirection: 'column', padding: 20, borderRadius: 10, maxWidth: 392 }}>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', marginBottom: 10 }}>
                          <img src={logo} className="image" alt="logo" style={{ height: 70, width: 70, margin: '0 0 10px' }} />
                          <h2 style={{ fontWeight: 'normal', margin: 0 }}>Sign In</h2>
                          <p>to log in to your account</p>
                        </div>
                        <form className="ui large form" action="#" style={{ width: '100%' }}>
                          <div className="ui stacked">
                            <div className="field">
                              <div>
                                <input type="text" name="username" onKeyDown={this.onKeyDown} placeholder="Username" value={this.state.username} onChange={this.handleChange} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: `1px solid ${primaryColor}`, padding: '10px 5px' }} />
                              </div>
                            </div>
                            <div className="field">
                              <PasswordToggleTextInput name="password" placeholder="Password" type="password" value={this.state.password} onChange={this.handleChange} onKeyDown={this.onKeyDown} />
                              <label htmlFor="submit" style={{ color: '#808285', fontSize: 12, fontWeight: 100, margin: '10px 0' }}>By clicking Sign In I agree to the <a target="_blank" href="https://msurvey.co/terms" style={{ color: primaryColor, display: 'inline' }}>Terms of Service</a> and <a target="_blank" href="https://msurvey.co/privacy-policy" style={{ color: primaryColor, display: 'inline' }}>Privacy Policy</a>.</label>
                            </div>
                          </div>
                          <div className="ui error message"></div>
                        </form>
                        <ActionButton text="Sign&nbsp;In" primary onClick={this.onSignIn} loading={this.state.isSigningIn} disabled={!(!!this.state.username && !!this.state.password)} large />
                        <br />
                        <p><a href="#" onClick={this.onGoToForgotPassword} style={{ color: primaryColor }}>Forgot password?</a></p>
                        {/*
                        <p style={{ fontSize: 12, textAlign: 'center' }}>Dont have an account? Contact us at <a href="mailto:support@msurvey.co.ke" style={{ color: primaryColor }}>support@msurvey.co.ke.</a></p>
                        */}
                        {/* <p style={{ fontSize: 12, textAlign: 'center' }}>Dont have an account?&nbsp;<a onClick={this.onGoToSignUp} href="#" style={{ color: primaryColor, display: 'inline' }}>Sign Up</a></p> */}

                        <p style={{ marginTop: 30 }}>&copy; Copyright 2012 - {`${moment().format('YYYY')}`}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', flexDirection: 'column', padding: 20, borderRadius: 10, maxWidth: 392 }}>
                      <img src={logo} className="image" alt="logo" style={{ height: 100, width: 100 }} />
                      <h3 style={{ fontWeight: 100, marginTop: 35 }}>Getting Started is easy</h3>
                      <p>Log in to your account</p>
                      <form className="ui large form" action="#" style={{ width: '100%' }}>
                        <div className="ui stacked">
                          <div className="field">
                            <div>
                              <input type="text" name="username" placeholder="Username" value={this.state.username} onChange={this.handleChange} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: `1px solid ${primaryColor}`, padding: '10px 5px' }} />
                            </div>
                          </div>
                          <div className="field">
                            <PasswordToggleTextInput name="password" placeholder="Password" type="password" value={this.state.password} onChange={this.handleChange} onKeyDown={this.onKeyDown} />
                            <label htmlFor="submit" style={{ color: '#808285', fontSize: 12, fontWeight: 100, margin: '10px 0' }}>By clicking Sign In I agree to the <a href="https://msurvey.co/terms" style={{ color: primaryColor, display: 'inline' }}>Terms of Service</a> and <a href="https://msurvey.co/privacy-policy" style={{ color: primaryColor, display: 'inline' }}>Privacy Policy</a>.</label>
                          </div>
                        </div>
                        <div className="ui error message"></div>
                      </form>
                      <ActionButton text="Sign&nbsp;In" primary onClick={this.onSignIn} loading={this.state.isSigningIn} disabled={!(!!this.state.username && !!this.state.password)} large />
                      <br />
                      <p><a href="#" onClick={this.onGoToForgotPassword} style={{ color: primaryColor }}>Forgot password?</a></p>
                      {/*
                      <p style={{ fontSize: 12, textAlign: 'center' }}>Dont have an account? Contact us at <a href="mailto:support@msurvey.co.ke" style={{ color: primaryColor }}>support@msurvey.co.ke.</a></p>
                      */}
                      {/* <p style={{ fontSize: 12, textAlign: 'center' }}>Dont have an account?&nbsp;<a onClick={this.onGoToSignUp} href="#" style={{ color: primaryColor, display: 'inline' }}>Sign Up</a></p> */}

                      <p style={{ marginTop: 30 }}>&copy; Copyright 2012 - {`${moment().format('YYYY')}`}</p>
                    </div>
                  </div>
                );
              }
            }
          </ContainerDimensions>
        </div>
      </div>
    );
  }
}

export default withAuthentication(SignIn);
