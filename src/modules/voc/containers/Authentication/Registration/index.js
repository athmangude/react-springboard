import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import ContainerDimensions from 'react-container-dimensions';
import Spinner from 'react-spinner-material';
import Alerts from 'Modules/voc/containers/App/Alerts';

import MwambaFormError from 'SharedComponents/mwamba-form-error';
import withAuthentication from 'Utils/withAuthentication';
import * as authenticationActions from '../flux/actions';

import logo from 'Images/logo.png';
import wrapperBackground from 'Images/empty_list_background.png';

@connect(() => ({}),
(dispatch) => ({
  authenticationActions: bindActionCreators(authenticationActions, dispatch),
}))
class Registration extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    alertActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onRegister = this.onRegister.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.onFetchTokenUser = this.onFetchTokenUser.bind(this);
    this.updateFormState = this.updateFormState.bind(this);
  }

  state = {
    user: {
      country: '',
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmationPassword: '',
    },
    formState: {
      username: false,
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      confirmationPassword: false,
    },
    doPasswordsMatch: -1,
    tokenUser: {},
    isSavingUser: false,
    savingUserError: null,
    success: false,
    tokenExpired: false,
    isCheckingToken: true,
  };

  componentDidMount() {
    this.onFetchTokenUser();
  }

  onKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.onRegister();
    }
  }

  onGoToSignIn() {
    this.context.router.history.push('/sign-in');
  }

  async onRegister() {
    let { user } = this.state;

    this.setState({
      isSavingUser: true,
    });

    if (user.password !== user.confirmationPassword) {
      this.setState({
        isSavingUser: false,
        doPasswordsMatch: 0,
      });
      return this.props.alertActions.addAlert({ type: 'error', message: 'Password confirmation doesn\'t match Password' });      ;
    }

    try {
      user.username = user.username.toLowerCase().trim();
      user.updateToken = this.context.router.route.match.params.token;
      user.email = this.state.tokenUser.email;
      user.country = this.state.tokenUser.country;
      user = Object.keys(user).reduce((object, key) => {
        if (key !== 'confirmationPassword') {
          // eslint-disable-next-line
          object[key] = user[key];
        }
        return object;
      }, {});
      await this.props.authenticationActions.register(user);
      const collaborator = {
        accountId: this.state.tokenUser.account,
        country: this.state.user.country,
        email: this.state.tokenUser.email,
        roleId: this.state.tokenUser.role,
        updateToken: this.context.router.route.match.params.token,
      };
      await this.props.authenticationActions.createCollaborator(this.state.tokenUser.account, collaborator);
      this.setState({ success: true });
      this.props.alertActions.addAlert({ type: 'success', message: 'Successfully registered user account. Redirecting to login page...' });      ;
      setInterval(() => this.onGoToSignIn(), 3000);
    } catch (exception) {
      setTimeout(() => {
        this.setState({
          savingUserError: null,
        });
      }, 5000);

      if (!exception.response) {
        this.setState({
          savingUserError: 'Network Error! We could not save your details while offline. Also check if you are using HTTPS',
        });
      } else if (exception.response && exception.response.status === 401) {
        this.setState({
          savingUserError: exception.response.data.message,
        });
      }

      this.props.alertActions.addAlert({ type: 'error', message: this.state.savingUserError || exception.message });
    } finally {
      this.setState({
        isSavingUser: false,
      });
    }
  }

  onCountryChanged(e, { name, value }) {
    this.setState({
      user: { ...this.state.user, [name]: value },
    });
  }

  async onFetchTokenUser() {
    const token = this.context.router.route.match.params.token;
    try {
      const onFetchTokenUserResult = await this.props.authenticationActions.fetchNewTokenUser(token);
      this.setState({ tokenUser: onFetchTokenUserResult.data.data.Data, isCheckingToken: false });
    } catch (exception) {
      this.setState({ tokenExpired: true, isCheckingToken: false });
      this.props.EventHandler.handleException(exception);
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message });
    }
  }

  handleChange(e) {
    this.setState({
      user: { ...this.state.user, [e.target.name]: e.target.value },
    });
  }

  handleChangePassword(e) {
    this.setState({ user: { ...this.state.user, [e.target.name]: e.target.value } }, () => {
      const { password, confirmationPassword } = this.state.user;
      if (!!password && !!confirmationPassword && password !== confirmationPassword) {
        this.setState({ doPasswordsMatch: 0 });
      } else if (!!password && !!confirmationPassword && password === confirmationPassword) {
        this.setState({ doPasswordsMatch: 1 });
      } else {
        this.setState({ doPasswordsMatch: -1 });
      }
    });
  }

  updateFormState(field, state) {
    this.setState({
      formState: { ...this.state.formState, [field]: state },
    });
  }

  render() {

    const { tokenExpired, isCheckingToken } = this.state;

    return (
      <div className="login-wrapper sign-up-page" style={{ background: 'linear-gradient(0.25turn, #FFFFFF, #F0F3F3)', height: '100vh', width: '100vw' }}>
        <Helmet title="Complete Registration" meta={[{ name: 'description', content: 'Sign up page for Spring Board' }]} />
        <div style={{ width: '100%', height: '100vh', backgroundImage: `url(${wrapperBackground})`, backgroundSize: 'cover' }}>
          <Alerts />
          <ContainerDimensions>
            {
              ({ width }) => {
                if (width > 768) {
                  return (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '10px 100px 30px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', flexDirection: 'column', padding: 20, borderRadius: 10, maxWidth: 392 }}>
                        {
                          (tokenExpired && !isCheckingToken) ? (
                            <div>
                              <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', marginBottom: 10 }}>
                                <img src={logo} className="image" alt="logo" style={{ height: 70, width: 70, margin: '0 0 10px' }} />
                                <h2 style={{ fontWeight: 'normal', margin: 0 }}>Token Expired!</h2>
                                <p>Please contact the administrator and ask for another one.</p>
                              </div>
                            </div>
                          ) : (isCheckingToken) ? (
                            <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <img src={logo} className="image" alt="logo" style={{ height: 70, width: 70, margin: '0 0 10px' }} />
                              <Spinner spinnerColor="#002366" size={20} spinnerWidth={2} />
                              <div style={{ width: '100%' }}>
                                <p>Checking if token is valid.</p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', marginBottom: 10 }}>
                                <h2 style={{ fontWeight: 'normal', margin: 0 }}>One more step to become a collaborator </h2>
                                <p>Complete the form below</p>
                              </div>
                              <form className="ui large form" action="#" style={{ width: '100%' }}>
                                <div className="ui stacked">
                                  <div className="field field-spaced">
                                    <div>
                                      <input type="text" name="firstName" placeholder="First name" value={this.state.user.firstName} onChange={this.handleChange} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #D8D8D8', padding: '10px 5px' }} />
                                    </div>
                                    <MwambaFormError name="firstName" value={this.state.user.firstName} rules={['required']} updateFormState={this.updateFormState} />
                                  </div>
                                  <div className="field field-spaced">
                                    <div>
                                      <input type="text" name="lastName" placeholder="Surname" value={this.state.user.lastName} onChange={this.handleChange} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #D8D8D8', padding: '10px 5px' }} />
                                    </div>
                                    <MwambaFormError name="lastName" value={this.state.user.lastName} rules={['required']} updateFormState={this.updateFormState} />
                                  </div>
                                  <div className="field field-spaced">
                                    <div>
                                      <input type="text" name="email" placeholder="Email" value={this.state.tokenUser.email} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #D8D8D8', padding: '10px 5px' }} disabled />
                                    </div>
                                    {/* <MwambaFormError name="email" value={this.state.user.email} rules={['required', 'validEmail']} updateFormState={this.updateFormState} /> */}
                                  </div>
                                  <div className="field field-spaced">
                                    <div>
                                      <input type="text" name="username" placeholder="Username" value={this.state.user.username} onChange={this.handleChange} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #D8D8D8', padding: '10px 5px' }} />
                                    </div>
                                    <MwambaFormError name="username" value={this.state.user.username} rules={['required']} updateFormState={this.updateFormState} />
                                  </div>
                                  <div className="field field-spaced">
                                    <div>
                                      <input type="password" name="password" placeholder="Password" value={this.state.user.password} onChange={this.handleChangePassword} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #D8D8D8', padding: '10px 5px' }} />
                                    </div>
                                    <MwambaFormError name="password" value={this.state.user.password} rules={['required', 'strongPassword']} updateFormState={this.updateFormState} />
                                  </div>
                                  <div className="field field-spaced">
                                    <div>
                                      <input type="password" name="confirmationPassword" placeholder="Confirmation Password" value={this.state.user.confirmationPassword} onChange={this.handleChangePassword} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #D8D8D8', padding: '10px 5px' }} />
                                    </div>
                                    <MwambaFormError name="confirmationPassword" value={this.state.user.confirmationPassword} rules={['required']} updateFormState={this.updateFormState} />
                                    <label htmlFor="submit" style={{ color: '#808285', fontSize: 12, fontWeight: 100, margin: '10px 0' }}>By signing up I agree to the <a target="_blank" href="https://msurvey.co/terms" style={{ color: '#BF2A2B', display: 'inline' }}>Terms of Service</a> and <a target="_blank" href="https://msurvey.co/privacy-policy" style={{ color: '#BF2A2B', display: 'inline' }}>Privacy Policy</a>.</label>
                                  </div>
                                </div>
                                <div className="ui error message"></div>
                              </form>
                              <Button as="button" className="ui fluid large red button" style={{ width: '89%', borderRadius: '1.9em', marginTop: 40 }} onClick={this.onRegister} loading={this.state.isSavingUser} disabled={!this.state.user.firstName || !this.state.user.lastName || !this.state.user.username || !this.state.user.password || !this.state.user.confirmationPassword}>Complete Registration</Button>
                              <br />
                            </div>
                          )
                        }
                        <p style={{ fontSize: 12, textAlign: 'center' }}>Already have an account? <a href="#" onClick={this.onSignin} style={{ color: '#BF2A2B', display: 'inline' }}>Sign In</a></p>

                        <p style={{ marginTop: 30 }}>&copy; Copyright 2012 - {`${moment().format('YYYY')}`}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', flexDirection: 'column', padding: 20, borderRadius: 10, maxWidth: 392 }}>
                      <img src={logo} className="image" alt="logo" style={{ height: 120, width: 120 }} />
                      {
                        (tokenExpired && !isCheckingToken) ? (
                          <div>
                            <h3 style={{ fontWeight: 100, marginTop: 35 }}>Token Expired!</h3>
                            <p>Please contact the administrator and ask for another one.</p>
                          </div>
                        ) : (isCheckingToken) ? (
                          <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <Spinner spinnerColor="#002366" size={20} spinnerWidth={2} />
                              <div style={{ width: '100%' }}>
                                <p>Checking if token is valid.</p>
                              </div>
                          </div>
                        ) : (
                          <div>
                            <h3 style={{ fontWeight: 100, marginTop: 35 }}>One more step to become a collaborator </h3>
                            <form className="ui large form" action="#" style={{ width: '100%' }}>
                              <div className="ui stacked">
                                <div className="field field-spaced">
                                  <div>
                                    <input type="text" name="firstName" placeholder="First name" value={this.state.user.firstName} onChange={this.handleChange} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid rgba(191, 42, 43, 100)', padding: '10px 5px' }} />
                                  </div>
                                  <MwambaFormError name="firstName" value={this.state.user.firstName} rules={['required']} updateFormState={this.updateFormState} />
                                </div>
                                <div className="field field-spaced">
                                  <div>
                                    <input type="text" name="lastName" placeholder="Surname" value={this.state.user.lastName} onChange={this.handleChange} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid rgba(191, 42, 43, 100)', padding: '10px 5px' }} />
                                  </div>
                                  <MwambaFormError name="lastName" value={this.state.user.lastName} rules={['required']} updateFormState={this.updateFormState} />
                                </div>
                                <div className="field field-spaced">
                                  <div>
                                    <input type="text" name="email" placeholder="Email" value={this.state.tokenUser.email} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid rgba(191, 42, 43, 100)', padding: '10px 5px' }} disabled />
                                  </div>
                                  {/* <MwambaFormError name="email" value={this.state.user.email} rules={['required', 'validEmail']} updateFormState={this.updateFormState} /> */}
                                </div>
                                <div className="field field-spaced">
                                  <div>
                                    <input type="text" name="username" placeholder="Username" value={this.state.user.username} onChange={this.handleChange} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid rgba(191, 42, 43, 100)', padding: '10px 5px' }} />
                                  </div>
                                  <MwambaFormError name="username" value={this.state.user.username} rules={['required']} updateFormState={this.updateFormState} />
                                </div>
                                <div className="field field-spaced">
                                  <div>
                                    <input type="password" name="password" placeholder="Password" value={this.state.user.password} onChange={this.handleChangePassword} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid rgba(191, 42, 43, 100)', padding: '10px 5px' }} />
                                  </div>
                                  <MwambaFormError name="password" value={this.state.user.password} rules={['required', 'strongPassword']} updateFormState={this.updateFormState} />
                                </div>
                                <div className="field field-spaced">
                                  <div>
                                    <input type="password" name="confirmationPassword" placeholder="Confirmation Password" value={this.state.user.confirmationPassword} onChange={this.handleChangePassword} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid rgba(191, 42, 43, 100)', padding: '10px 5px' }} />
                                  </div>
                                  <MwambaFormError name="confirmationPassword" value={this.state.user.confirmationPassword} rules={['required']} updateFormState={this.updateFormState} />
                                  <label htmlFor="submit" style={{ color: '#808285', fontSize: 12, fontWeight: 100, margin: '10px 0' }}>By signing up I agree to the <a href="/terms-of-service" style={{ color: '#BF2A2B', display: 'inline' }}>Terms of Service</a> and <a href="/privacy-policy" style={{ color: '#BF2A2B', display: 'inline' }}>Privacy Policy</a>.</label>
                                </div>
                              </div>
                              <div className="ui error message"></div>
                            </form>
                            <Button as="button" className="ui fluid large red button" style={{ width: '89%', borderRadius: '1.9em', marginTop: 40 }} onClick={this.onRegister} loading={this.state.isSavingUser} disabled={!this.state.user.firstName || !this.state.user.lastName || !this.state.user.username || !this.state.user.password || !this.state.user.confirmationPassword}>Complete Registration</Button>
                            <br />
                            <p style={{ fontSize: 12, textAlign: 'center' }}>Already have an account? <a href="/sign-in" style={{ color: '#BF2A2B', display: 'inline' }}>Sign In</a></p>

                            <p style={{ marginTop: 30 }}>&copy; Copyright 2012 - {`${moment().format('YYYY')}`}</p>
                          </div>
                        )
                      }
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

export default withAuthentication(Registration);
