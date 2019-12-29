/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import ContainerDimensions from 'react-container-dimensions';
import Alerts from 'Modules/main/containers/App/Alerts';

import ActionButton from 'SharedComponents/action-button-styled';

import withAuthentication from 'Utils/withAuthentication';
import * as authenticationActions from '../flux/actions';

import logo from 'Images/logo.png';
import wrapperBackground from 'Images/empty_list_background.png';

import themes from 'SharedComponents/themes';
const { primaryColor } = themes.light;

@connect((state) => ({
  authentication: state.authentication,
}),
(dispatch) => ({
  authenticationActions: bindActionCreators(authenticationActions, dispatch),
}))
class ResetPassword extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    alertActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onResetPassword = this.onResetPassword.bind(this);
    this.onGoToSignUp = this.onGoToSignUp.bind(this);
    this.onGoToSignIn = this.onGoToSignIn.bind(this);
    this.onFetchTokenUser = this.onFetchTokenUser.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  state = {
    password: '',
    confirmationPassword: '',
    isSubmitting: false,
    doPasswordsMatch: -1,
    success: false,
    resetPasswordError: null,
    user: {},
  };

  componentDidMount() {
    this.onFetchTokenUser();
  }

  onKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.onResetPassword();
    }
  }

  onGoToSignUp() {
    this.context.router.history.push('/sign-up');
  }

  onGoToSignIn() {
    this.context.router.history.push('/sign-in');
  }

  async onResetPassword() { // eslint-disable-line consistent-return
    this.setState({
      isSubmitting: true,
      resetPasswordError: null,
    });

    const { password, confirmationPassword, user } = this.state;
    const token = this.context.router.route.match.params.token;
    if (password !== confirmationPassword) {
      this.setState({
        isSubmitting: false,
      });
      return this.props.alertActions.addAlert({ type: 'error', message: 'Password confirmation doesn\'t match Password' });      ;
    }

    /**
     * ^ The password string will start this way
     * (?=.*[a-z]) The string must contain at least 1 lowercase alphabetical character
     * (?=.*[A-Z]) The string must contain at least 1 uppercase alphabetical character
     * (?=.*[0-9]) The string must contain at least 1 numeric character
     * (?=.[!@#\$%\^&]) The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
     * (?=.{8,}) The string must be eight characters or longer
     */
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password);
    if (!strong) {
      this.setState({ isSubmitting: false, resetPasswordError: 'password must be at least 8 characters long, contain a numeric character, have at least one lower case alphabetic character, one uppercase alphabetic character and one special character' });
      this.props.alertActions.addAlert({ type: 'error', message: this.state.resetPasswordError || exception.message });
      return;
    }

    try {
      await this.props.authenticationActions.resetPassword(user.id, { password, updateToken: token });
      this.setState({ success: 'Successfully reset password. Redirecting to login page...' });
      this.props.alertActions.addAlert({ type: 'success', message: this.state.success || exception.message });
      setInterval(() => this.onGoToSignIn(), 3000);
    } catch (exception) {
      if (!exception.response) {
        this.setState({
          resetPasswordError: 'Network Error! We could not submit your request you while offline. Also check if you are using HTTPS',
        });
      } else if (exception.response && exception.response.status === 401) {
        this.setState({
          resetPasswordError: exception.response.data.message,
        });
      }

      this.props.alertActions.addAlert({ type: 'error', message: this.state.resetPasswordError || exception.message });
    } finally {
      this.setState({
        isSubmitting: false,
      });
    }
  }

  async onFetchTokenUser() {
    const token = this.context.router.route.match.params.token;
    try {
      const onFetchTokenUserResult = await this.props.authenticationActions.fetchTokenUser(token);
      this.setState({ user: onFetchTokenUserResult.data.data.Data.user });
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message });
    }
  }

  handleChangePassword(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      const { password, confirmationPassword } = this.state;
      if (!!password && !!confirmationPassword && password !== confirmationPassword) {
        this.setState({ doPasswordsMatch: 0 });
      } else if (!!password && !!confirmationPassword && password === confirmationPassword) {
        this.setState({ doPasswordsMatch: 1 });
      } else {
        this.setState({ doPasswordsMatch: -1 });
      }
    });
  }

  render() {
    return (
      <div className="login-wrapper" style={{ background: 'linear-gradient(0.25turn, #FFFFFF, #F0F3F3)', height: '100vh', width: '100vw' }}>
        <Helmet title="Reset Password" meta={[{ name: 'description', content: 'Reset password page for Spring Board' }]} />
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
                          <h2 style={{ fontWeight: 'normal', margin: 0 }}>Reset your password</h2>
                          <p>Just provide your new password and you are good to go.</p>
                        </div>
                        <form className="ui large form" action="#" style={{ width: '100%' }}>
                          <div className="ui stacked">
                            <div className="field">
                              <div>
                                <input type="email" name="email" placeholder="Email" value={this.state.user.email} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #D8D8D8', padding: '10px 5px' }} disabled />
                              </div>
                            </div>
                            <div className="field">
                              <div>
                                <input type="password" name="password" onKeyDown={this.onKeyDown} placeholder="New password" value={this.state.pasword} onChange={this.handleChangePassword} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #D8D8D8', padding: '10px 5px' }} />
                              </div>
                            </div>
                            <div className="field">
                              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <input type="password" name="confirmationPassword" onKeyDown={this.onKeyDown} placeholder="Confirmation password" value={this.state.confirmationPassword} onChange={this.handleChangePassword} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #D8D8D8', padding: '10px 5px' }} />
                                {
                                  this.state.doPasswordsMatch === 1 ? (
                                    <i className="material-icons">check</i>
                                  ) : this.state.doPasswordsMatch === 0 ? (
                                    <i className="material-icons">clear</i>
                                  ) : null
                                }
                              </div>
                            </div>
                          </div>
                          <div className="ui error message"></div>
                        </form>
                        <ActionButton primary large text="Reset Password" onClick={this.onResetPassword} loading={this.state.isSubmitting} disabled={!this.state.password || !this.state.confirmationPassword} style={{ margin: '10px 0' }} />
                        <br />
                        <p style={{ marginTop: 30 }}>&copy; Copyright 2012 - {`${moment().format('YYYY')}`}</p>
                      </div>
                    </div>
                  );
                }
                return (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', flexDirection: 'column', padding: 20, borderRadius: 10, maxWidth: 392 }}>
                      <img src={logo} className="image" alt="logo" style={{ height: 79, width: 163 }} />
                      <h3 style={{ fontWeight: 100, marginTop: 35 }}>Rest your password!</h3>
                      <p>Just provide your new password and you are good to go.</p>
                      <form className="ui large form" action="#" style={{ width: '100%' }}>
                        <div className="ui stacked">
                          <div className="field">
                            <div>
                              <input type="password" name="password" onKeyDown={this.onKeyDown} placeholder="New password" value={this.state.pasword} onChange={this.handleChangePassword} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid rgba(191, 42, 43, 100)', padding: '10px 5px' }} />
                            </div>
                          </div>
                          <div className="field">
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                              <input type="password" name="confirmationPassword" onKeyDown={this.onKeyDown} placeholder="Confirmation password" value={this.state.confirmationPassword} onChange={this.handleChangePassword} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid rgba(191, 42, 43, 100)', padding: '10px 5px' }} />
                              {
                                this.state.doPasswordsMatch === 1 ? (
                                  <i className="material-icons">check</i>
                                ) : this.state.doPasswordsMatch === 0 ? (
                                  <i className="material-icons">clear</i>
                                ) : null
                              }
                            </div>
                          </div>
                        </div>
                        <div className="ui error message"></div>
                      </form>
                      <ActionButton primary large text="Reset Password" onClick={this.onResetPassword} loading={this.state.isSubmitting} disabled={!this.state.password || !this.state.confirmationPassword} style={{ margin: '10px 0' }} />
                      <br />
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

export default withAuthentication(ResetPassword);
