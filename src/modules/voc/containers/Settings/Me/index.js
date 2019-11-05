/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ActionButton from 'SharedComponents/action-button-styled';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';
import ActivityHandler from 'Utils/ActivityHandler';
import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../components/SettingsNavigationContainer';
import * as meActions from '../../Authentication/flux/actions';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';

@connect((state) => ({
  user: state.authentication.user,
  collaborators: state.collaborators,
}),
(dispatch) => ({
  meActions: bindActionCreators(meActions, dispatch),
  alertActions: bindActionCreators({ addAlert }, dispatch),
  dispatch,
}))

class Me extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    meActions: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    EventHandler: PropTypes.func,
  }

  constructor(props) {
    super(props);

    const { user } = props.user;
    const { id, firstName, lastName, username, email } = user;
    this.state = {
      me: {
        id,
        firstName,
        lastName,
        username,
        email,
      },
      newPassword: '',
      confirmPassword: '',
      isUpdatingDetails: false,
      isUpdatingPassword: false,
      doPasswordsMatch: -1,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.updateUserDetails = this.updateUserDetails.bind(this);
    this.updateUserPassword = this.updateUserPassword.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { user: userObject } = this.props;
    const { user } = userObject;
    if (user !== newProps.user.user) {
      this.setState({ me: newProps.user.user });
    }
  }

  handleChange(e) {
    const { me } = this.state;
    this.setState({
      me: { ...me, [e.target.name]: e.target.value },
    });
  }

  handleChangePassword(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      const { newPassword, confirmPassword } = this.state;
      if (!!newPassword && !!confirmPassword && newPassword !== confirmPassword) {
        this.setState({ doPasswordsMatch: 0 });
      } else if (!!newPassword && !!confirmPassword && newPassword === confirmPassword) {
        this.setState({ doPasswordsMatch: 1 });
      } else {
        this.setState({ doPasswordsMatch: -1 });
      }
    });
  }

  async updateUserPassword() {
    this.setState({ isUpdatingPassword: true });
    const { alertActions, meActions, EventHandler } = this.props;
    const { me, newPassword, confirmPassword } = this.state;

    if (newPassword !== confirmPassword) {
      alertActions.addAlert({ type: 'error', message: 'Passwords do not match' });
      this.setState({ isUpdatingPassword: false });
      return;
    }

    /**
     * ^ The password string will start this way
     * (?=.*[a-z]) The string must contain at least 1 lowercase alphabetical character
     * (?=.*[A-Z]) The string must contain at least 1 uppercase alphabetical character
     * (?=.*[0-9]) The string must contain at least 1 numeric character
     * (?=.[!@#\$%\^&]) The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
     * (?=.{8,}) The string must be eight characters or longer
     */
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(newPassword);
    if (!strong) {
      alertActions.addAlert({ type: 'error', message: 'Password must be at least 8 characters long, contain a numeric character, have at least one lower case alphabetic character, one uppercase alphabetic character and one special character'})
      this.setState({ isUpdatingPassword: false });
      return;
    }

    try {
      await meActions.updateUserDetails({ id: me.id, password: newPassword });
      alertActions.addAlert({ type: 'success', message: 'Successfully updated password' });
      EventHandler.trackEvent({ category: 'Profile', action: 'update password', value: true });
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'Profile', action: 'update password', value: false });
    } finally {
      this.setState({
        isUpdatingPassword: false,
        newPassword: '',
        confirmPassword: '',
      });
    }
  }

  async updateUserDetails() {
    this.setState({ isUpdatingDetails: true });
    const { meActions, alertActions, EventHandler } = this.props;
    const { me } = this.state;

    try {
      const updateUserDetailsResults = await meActions.updateUserDetails(me);
      meActions.updateUser(updateUserDetailsResults.data.data.Data);
      alertActions.addAlert({ type: 'success', message: 'Successfully updated details' });
      EventHandler.trackEvent({ category: 'Profile', action: 'update user details', value: true });
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'Profile', action: 'update user details', value: false });
    } finally {
      this.setState({
        isUpdatingDetails: false,
      });
      EventHandler.trackEvent({ category: 'Profile', action: 'update user details' });
    }
  }

  render() {
    const { me, newPassword, confirmPassword, isUpdatingDetails, isUpdatingPassword, doPasswordsMatch } = this.state;
    const { user: userObject, EventHandler, windowDimensions } = this.props;
    const { user } = userObject;
    const colorMix = stringToHexColor(`${user.firstName} ${user.lastName}`);

    return (
      <SettingsNavigationContainer EventHandler={EventHandler}>
        <div style={{ width: '100%', backgroundColor: '#fff' }}>
          <div style={{ padding: '0 10px 0 10px', display: 'flex', flexDirection: windowDimensions.width > 728 ? 'row' : 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <div style={{ width: windowDimensions.width > 728 ? 200 : '100%' }}>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                  <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(`${user.firstName} ${user.lastName}`)}</div>
                  <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{`${user.firstName} ${user.lastName}`}</span>
                </div>
              </div>
            </div>
            <div style={{ width: windowDimensions.width > 728 ? 'calc(100% - 200px)' : '100%', paddingLeft: windowDimensions.width > 728 ? 50 : 0 }}>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', margin: '0 10px' }}>
                  <p>First Name</p>
                  <input type="text" name="firstName" placeholder="First Name" value={me.firstName} onChange={this.handleChange} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%' }} />
                </div>
              </div>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', margin: '0 10px' }}>
                  <p>Last Name</p>
                  <input type="text" name="lastName" placeholder="Last Name" value={me.lastName} onChange={this.handleChange} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%' }} />
                </div>
              </div>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
                  <ActionButton className="primary" large icon="edit" text="Update Details" loading={isUpdatingDetails} disabled={isUpdatingDetails} onClick={this.updateUserDetails} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
                </div>
              </div>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Change Password</h2>
              </div>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', margin: '0 10px' }}>
                  <p>Old Password</p>
                  <input type="password" name="oldPassword" placeholder="Old Password" value="old password" className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%' }} />
                </div>
              </div>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', margin: '0 10px' }}>
                  <p>New Password</p>
                  <input type="password" name="newPassword" placeholder="New Password" value={newPassword} onChange={this.handleChangePassword} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%' }} />
                </div>
              </div>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', margin: '0 10px' }}>
                  <p>Confirmation Password</p>
                  <input type="password" name="confirmPassword" placeholder="Confirmation Password" value={confirmPassword} onChange={this.handleChangePassword} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: doPasswordsMatch === 0 ? '1px solid rgba(191, 42, 43, 100)' : '1px solid #808285', padding: '10px 5px', width: '100%' }} />
                </div>
              </div>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
                  <ActionButton className="primary" large icon="edit" text="Update Password" loading={isUpdatingPassword} disabled={isUpdatingPassword || doPasswordsMatch !== 1} onClick={this.updateUserPassword} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SettingsNavigationContainer>
    );
  }
}

export default withAuthentication(Me);
