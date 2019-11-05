/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import ContainerDimensions from 'react-container-dimensions';
import Alerts from 'Modules/voc/containers/App/Alerts';

import ActionButton from 'SharedComponents/action-button-styled';

import themes from 'SharedComponents/themes';
const { primaryColor } = themes.light;

import withAuthentication from 'Utils/withAuthentication';
import * as authenticationActions from '../flux/actions';

import logo from 'Images/logo.png';
import wrapperBackground from 'Images/empty_list_background.png';

const callBackUrl = window.location.origin.concat('/reset-password/');

const isValidEmail = (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,24})+$/.test(email);

@connect((state) => ({
  authentication: state.authentication,
}),
(dispatch) => ({
  authenticationActions: bindActionCreators(authenticationActions, dispatch),
}))
class ForgotPassword extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    EventHandler: PropTypes.object,
    authenticationActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onForgotPassword = this.onForgotPassword.bind(this);
    this.onGoToSignIn = this.onGoToSignIn.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    email: '',
    isInvalidEmail: null,
    isSubmitting: false,
    forgotPasswordError: null,
    successMessage: null,
  };

  onKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.onForgotPassword();
    }
  }

  onGoToSignIn() {
    this.context.router.history.push('/sign-in');
  }

  async onForgotPassword() { // eslint-disable-line consistent-return
    this.setState({
      isSubmitting: true,
    });

    if (!isValidEmail(this.state.email)) {
      this.setState({ isInvalidEmail: true, isSubmitting: false });
      return;
    }

    try {
      const forgotPasswordResult = await this.props.authenticationActions.forgotPassword({ email: this.state.email, callBackUrl });
      this.setState({ successMessage: forgotPasswordResult.data.data.Data });
      this.props.alertActions.addAlert({ type: 'success', message: this.state.successMessage || exception.message });
    } catch (exception) {
      if (!exception.response) {
        this.setState({
          forgotPasswordError: 'Network Error! We could not submit your request you while offline. Also check if you are using HTTPS',
        });
      } else if (exception.response && exception.response.status === 401) {
        this.setState({
          forgotPasswordError: exception.response.data.message,
        });
      }

      this.props.alertActions.addAlert({ type: 'error', message: this.state.forgotPasswordError || exception.message });
    } finally {
      this.setState({
        isSubmitting: false,
      });
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      isInvalidEmail: false,
    });
  }

  render() {
    return (
      <div className="login-wrapper" style={{ background: 'linear-gradient(0.25turn, #FFFFFF, #F0F3F3)', height: '100vh', width: '100vw' }}>
        <Helmet title="Forgot Password" meta={[{ name: 'description', content: 'Forgot password page for Spring Board' }]} />
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
                          <h2 style={{ fontWeight: 'normal', margin: 0 }}>Forgot you password?</h2>
                          <p>Just provide your email so that we can send you a password reset link.</p>
                        </div>
                        <form className="ui large form" action="#" style={{ width: '100%' }}>
                          <div className="ui stacked">
                            <div className="field">
                              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <input type="email" name="email" onKeyDown={this.onKeyDown} placeholder="Email" value={this.state.email} onChange={this.handleChange} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #D8D8D8', padding: '10px 5px' }} />
                                {
                                  this.state.isInvalidEmail ? (
                                    <Popup
                                      trigger={<i className="material-icons">clear</i>}
                                      content={<span style={{ color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Invalid email address</span>}
                                      basic
                                      inverted
                                      hoverable
                                      style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
                                    />
                                  ) : null
                                }
                              </div>
                            </div>
                          </div>
                          <div className="ui error message"></div>
                        </form>
                        <ActionButton text="Submit" primary large loading={this.state.isSubmitting} disabled={!this.state.email} onClick={this.onForgotPassword} style={{ margin: '10px 0' }} />
                        <br />
                        <p style={{ fontSize: 12, textAlign: 'center' }}>Have an account?&nbsp;<a onClick={this.onGoToSignIn} href="#" style={{ color: primaryColor, display: 'inline' }}>Sign In</a></p>
                        <p style={{ marginTop: 30 }}>&copy; Copyright 2012 - {`${moment().format('YYYY')}`}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', flexDirection: 'column', padding: 20, borderRadius: 10, maxWidth: 392 }}>
                      <img src={logo} className="image" alt="logo" style={{ height: 79, width: 163 }} />
                      <h3 style={{ fontWeight: 100, marginTop: 35 }}>Forgot your password?</h3>
                      <p style={{ textAlign: 'center' }}>Just provide your email so that we can send you a password reset link.</p>
                      <form className="ui large form" action="#" style={{ width: '100%' }}>
                        <div className="ui stacked">
                          <div className="field">
                            <div>
                              <input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid rgba(191, 42, 43, 100)', padding: '10px 5px' }} />
                            </div>
                          </div>
                        </div>
                        <div className="ui error message"></div>
                      </form>
                      <ActionButton text="Submit" primary large loading={this.state.isSubmitting} disabled={!this.state.email} onClick={this.onForgotPassword} style={{ margin: '10px 0' }} />
                      <br />
                      <p style={{ fontSize: 12, textAlign: 'center' }}>Have an account?&nbsp;<a onClick={this.onGoToSignIn} href="#" style={{ color: primaryColor, display: 'inline' }}>Sign In</a></p>
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

export default withAuthentication(ForgotPassword);
