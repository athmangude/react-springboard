/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Spinner from 'react-spinner-material';

import * as EventHandler from 'Utils/EventHandler';
import * as alertActions from '../App/Alerts/flux/actions';

import background from 'Images/login_bg.jpg';

import Alerts from '../App/Alerts';

import UserDetails from './UserDetails';
import OTP from './OTP';
import * as wifiActions from './flux/actions';

@connect((state) => ({
  wifiDetails: state.wifi,
}),
(dispatch) => ({
  wifiActions: bindActionCreators(wifiActions, dispatch),
  alertActions: bindActionCreators(alertActions, dispatch),
  dispatch,
}))
export default class WifiAuthentication extends Component {
  constructor(props) {
    super(props);

    this.onGoBack = this.onGoBack.bind(this);
    this.onUserDetailsChanged = this.onUserDetailsChanged.bind(this);
    this.onShowOTP = this.onShowOTP.bind(this);
    this.findGetParameters = this.findGetParameters.bind(this);
    this.getBaseUrl = this.getBaseUrl.bind(this);
    this.registerWifiUser = this.registerWifiUser.bind(this);
    this.onSubmitOTP = this.onSubmitOTP.bind(this);
    this.sendAccessCode = this.sendAccessCode.bind(this);
    this.onOTPChanged = this.onOTPChanged.bind(this);
    this.redirectUser = this.redirectUser.bind(this);
    this.fetchBusinessWifiDetails = this.fetchBusinessWifiDetails.bind(this);
  }

  state = {
    screen: 'user-details',
    userDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      msisdn: '',
      nodeMacAddress: null,
    },
    otp: {
      accessCode: '',
    },
    baseGrantUrl: null,
    loginUrl: null,
    continueUrl: null,
    apMac: null,
    apName: null,
    clientIp: null,
    isRegistering: false,
    isSubmittingOTPCode: false,
    isFetchingBusinessDetails: false,
    authView: {
      accessCode: '',
      msisdn: '',
    },
    res: null,
    businessDetails : {
      businessName: null,
      businessLogo: null,
      businessBackgroundImg: null,
    },
  }

  componentWillMount() {
    this.setState({ baseGrantUrl: this.getBaseUrl() }, () => {
      this.findGetParameters();
    });
  }

  componentDidMount() {}


  onGoBack() {
    this.setState({ screen: 'user-details' });
  }

  onShowOTP(formData) {
    const { userDetails, authView } = this.state;
    const { firstName, msisdn } = formData;
    this.setState({ ...this.state, userDetails: { ...userDetails, firstName, msisdn }, authView: { ...authView, msisdn } }, () => {
      this.registerWifiUser();
    });
  }

  onSubmitOTP(formData) {
    const { authView } = this.state;
    const { accessCode } = formData;
    this.setState({ authView: { ...authView, accessCode } }, () => {
      this.sendAccessCode();
    });
  }

  onUserDetailsChanged(event) {
    const { userDetails } = this.state;
    this.setState({
      userDetails: { ...userDetails, [event.target.name]: event.target.value },
    });
  }

  onOTPChanged(event) {
    this.setState({ otp: { [event.target.name]: event.target.value.toUpperCase() } });
  }

  getBaseUrl() {
    const url = new URL(window.location.href);
    const baseUrl = decodeURIComponent(url.searchParams.get('base_grant_url'));
    return baseUrl;
  }

  findGetParameters() {
    const url = new URL(window.location.href);
    const loginUrl = decodeURIComponent(url.searchParams.get('login_url'));
    const continueUrl = decodeURIComponent(url.searchParams.get('user_continue_url'));
    const nodeMac = decodeURIComponent(url.searchParams.get('node_mac'));
    const apName = decodeURIComponent(url.searchParams.get('ap_name'));
    const apTags = decodeURIComponent(url.searchParams.get('ap_tags'));
    const clientMac = decodeURIComponent(url.searchParams.get('client_mac'));
    const clientIp = decodeURIComponent(url.searchParams.get('client_ip'));

    this.setState({
      userDetails: {
        nodeMacAddress: nodeMac,
      },
      loginUrl,
      continueUrl,
      clientMac,
      apName,
      apTags,
      clientIp,
    }, () => {
      this.fetchBusinessWifiDetails();
    });
  }

  async registerWifiUser() {
    try {
      this.setState({ isRegistering: true });
      await this.props.wifiActions.createWifiUser(this.state.userDetails);
      this.props.alertActions.addAlert({ type: 'info', message: 'User was succesfully created' });
      this.setState({ screen: 'otp' });
    } catch (exception) {
      EventHandler.handleException(exception);
      this.props.alertActions.addAlert({ type: 'error', message: exception.response ? exception.response.data.message : exception.message });
    } finally {
      this.setState({ isRegistering: false });
    }
  }

  async sendAccessCode() {
    // send OTP code to Meraki
    this.setState({ isSubmittingOTPCode: true });
    try {
      await this.props.wifiActions.authenticateWifiUser(this.state.authView);
      this.redirectUser();
    } catch (exception) {
      EventHandler.handleException(exception);
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isSubmittingOTPCode: false });
    }

  }

  redirectUser() {
    const cleanBaseGrantUrl = this.state.baseGrantUrl.split('&')[0];
    window.location.href = `${cleanBaseGrantUrl}` + `?continue_url=`+`${this.state.continueUrl}`;
  }

  async fetchBusinessWifiDetails() {
    this.setState({ isFetchingBusinessDetails: true });
    try {
      const businessWifiDetails = await this.props.wifiActions.fetchBusinessWifiDetails(this.state.userDetails.nodeMacAddress);
      this.props.wifiActions.setBusinessWifiDetails(businessWifiDetails.data.Data);
    } catch (exception) {
      EventHandler.handleException(exception);
      this.props.alertActions.addAlert({ type: 'error', message: exception.response ? exception.response.data.message : exception.message });
    }
    this.setState({ isFetchingBusinessDetails: false });
  }


  render() {
    const { userDetails, otp, screen, isFetchingBusinessDetails, isRegistering, isSubmittingOTPCode  } = this.state;
    const { wifiDetails } = this.props;
    let backgroundImg = null;

    if (wifiDetails.backgroundImg) {
      backgroundImg = wifiDetails.backgroundImg;
    } else {
      backgroundImg = background;
    }
    return (
      <div style={{ width: '100vw', height: '1000px', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundImage: "url(" + backgroundImg + ")", backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'repeat' }}>
        <Alerts />
        {
          screen === 'user-details' && isFetchingBusinessDetails === true ? (
            <Spinner spinnerColor="#002366" size={50} spinnerWidth={4} />
          )
            : screen === 'user-details' && isFetchingBusinessDetails === false ? (
              <UserDetails userDetails={userDetails} onChange={this.onUserDetailsChanged} onShowOTP={this.onShowOTP} isRegistering={isRegistering} wifiDetails={wifiDetails} />
            ) : (
              <OTP otp={otp} onChange={this.onOTPChanged} onGoBack={this.onGoBack} submitOTP={this.onSubmitOTP} isSubmittingOTPCode={isSubmittingOTPCode} />
            )

        }
      </div>
    );
  }
}
