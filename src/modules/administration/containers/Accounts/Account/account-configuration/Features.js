/* eslint-disable jsx-a11y/href-no-hash, react/no-unused-state, radix, no-return-assign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import Switch from 'react-switch';

import ActionButton from 'SharedComponents/action-button';

export default class Features extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    alertActions: PropTypes.object.isRequired,
    accountDetails: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.onUpdateSettings = this.onUpdateSettings.bind(this);
    this.onFormValid = this.onFormValid.bind(this);
    this.onFormInvalid = this.onFormInvalid.bind(this);
    this.onInvalidSubmit = this.onInvalidSubmit.bind(this);
    this.onSwitchToggled = this.onSwitchToggled.bind(this);

    const { accountFeatures } = props.accountDetails;

    this.state = {
      isUpdatingConfiguration: false,
      form: {
        aod: accountFeatures.aod,
        voc: accountFeatures.voc,
        // prime: accountFeatures.prime,
        consumerWallet: accountFeatures.consumerWallet,
        convo: accountFeatures.convo,
        lnm: accountFeatures.lnm,
        ussd: accountFeatures.ussd,
        customerAnalytics: accountFeatures.customerAnalytics,
        wifi: accountFeatures.wifi,
        socialMedia: accountFeatures.socialMedia
      },
    };
  }

  onSwitchToggled(change) {
    const { form } = this.state;
    this.setState({ form: { ...form, ...change } });
  }

  onFormValid() {
    this.setState({ formValid: true });
  }

  onFormInvalid() {
    this.setState({ formValid: false });
  }

  async onUpdateSettings() {
    const { accountsActions, onfetchAccountDetails, alertActions, EventHandler } = this.props;
    const { form } = this.state;
    const { router } = this.context;
    const { id } = router.route.match.params;
    this.setState({ isUpdatingConfiguration: true });

    try {
      const accountDetails = { ...form };
      await accountsActions.updateAccountFeatures(id, accountDetails);
      alertActions.addAlert({ type: 'success', message: 'The account has been updated successfully' });
      onfetchAccountDetails(id);
    } catch (exception) {
      EventHandler.handleException(exception);
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isUpdatingConfiguration: false });
    }
  }

  onInvalidSubmit() {
    this.setState({ formValid: false });
  }

  handleChange(event) {
    const { form } = this.state;
    this.setState({ form: { ...form, [event.target.name]: event.target.value } });
  }

  render() {
    const { form, isUpdatingConfiguration } = this.state;
    return (
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Formsy ref={(f) => this.form = form} action="#" onValid={this.onFormValid} onInvalid={this.onFormInvalid} onValidSubmit={this.onUpdateSettings} onInvalidSubmit={this.onInvalidSubmit}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', margin: '20px 0' }}>
              <Switch
                checked={form.aod}
                onChange={(change) => this.onSwitchToggled({ aod: change })}
                onColor="#fc8384"
                onHandleColor="#002366"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <span style={{ margin: '0 10px' }}>{form.aod ? 'AOD ON' : 'AOD OFF'}</span>
            </div>
            <div style={{ width: '100%', margin: '10px 0px 30px' }}>
              <span>Configure whether this account uses Audience on Demand</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', margin: '20px 0' }}>
              <Switch
                checked={form.voc}
                onChange={(change) => this.onSwitchToggled({ voc: change })}
                onColor="#fc8384"
                onHandleColor="#002366"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <span style={{ margin: '0 10px' }}>{form.voc ? 'VOC ON' : 'VOC OFF'}</span>
            </div>
            <div style={{ width: '100%', margin: '10px 0px 30px' }}>
              <span>Configure whether this account Voice of the Customer</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', margin: '20px 0' }}>
              <Switch
                checked={form.consumerWallet}
                onChange={(change) => this.onSwitchToggled({ consumerWallet: change })}
                onColor="#fc8384"
                onHandleColor="#002366"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <span style={{ margin: '0 10px' }}>{form.consumerWallet ? 'Consumer Wallet ON' : 'Consumer Wallet OFF'}</span>
            </div>
            <div style={{ width: '100%', margin: '10px 0px 30px' }}>
              <span>Configure whether this account uses Consumer Wallet</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', margin: '20px 0' }}>
              <Switch
                checked={form.convo}
                onChange={(change) => this.onSwitchToggled({ convo: change })}
                onColor="#fc8384"
                onHandleColor="#002366"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <span style={{ margin: '0 10px' }}>{form.convo ? 'Convo ON' : 'Convo OFF'}</span>
            </div>
            <div style={{ width: '100%', margin: '10px 0px 30px' }}>
              <span>Configure whether this account uses Convo live chat</span>
            </div>
          </div>
          {/*
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', margin: '20px 0' }}>
              <Switch
                checked={form.prime}
                onChange={(change) => this.onSwitchToggled({ prime: change })}
                onColor="#fc8384"
                onHandleColor="#002366"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <span style={{ margin: '0 10px' }}>{form.prime ? 'Prime ON' : 'Prime OFF'}</span>
            </div>
            <div style={{ width: '100%', margin: '10px 0px 30px' }}>
              <span>Configure whether this account uses mSurvey Prime</span>
            </div>
          </div>
          */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', margin: '20px 0' }}>
              <Switch
                checked={form.lnm}
                onChange={(change) => this.onSwitchToggled({ lnm: change })}
                onColor="#fc8384"
                onHandleColor="#002366"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <span style={{ margin: '0 10px' }}>{form.lnm ? 'LNM ON' : 'LNM OFF'}</span>
            </div>
            <div style={{ width: '100%', margin: '10px 0px 30px' }}>
              <span>Configure whether this account uses Lipa na Mpesa</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', margin: '20px 0' }}>
              <Switch
                checked={form.ussd}
                onChange={(change) => this.onSwitchToggled({ ussd: change })}
                onColor="#fc8384"
                onHandleColor="#002366"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <span style={{ margin: '0 10px' }}>{form.ussd ? 'USSD ON' : 'USSD OFF'}</span>
            </div>
            <div style={{ width: '100%', margin: '10px 0px 30px' }}>
              <span>Configure whether this account uses USSD</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', margin: '20px 0' }}>
              <Switch
                checked={form.customerAnalytics}
                onChange={(change) => this.onSwitchToggled({ customerAnalytics: change })}
                onColor="#fc8384"
                onHandleColor="#002366"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <span style={{ margin: '0 10px' }}>{form.customerAnalytics ? 'Customer Analytics ON' : 'Customer Analytics OFF'}</span>
            </div>
            <div style={{ width: '100%', margin: '10px 0px 30px' }}>
              <span>Configure whether this account uses Customer Analytics</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', margin: '20px 0' }}>
              <Switch
                checked={form.wifi}
                onChange={(change) => this.onSwitchToggled({ wifi: change })}
                onColor="#fc8384"
                onHandleColor="#002366"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <span style={{ margin: '0 10px' }}>{form.wifi ? 'Wi-Fi ON' : 'Wi-Fi OFF'}</span>
            </div>
            <div style={{ width: '100%', margin: '10px 0px 30px' }}>
              <span>Configure whether this account uses Wi-Fi</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', margin: '20px 0' }}>
              <Switch
                checked={form.socialMedia}
                onChange={(change) => this.onSwitchToggled({ socialMedia: change })}
                onColor="#fc8384"
                onHandleColor="#002366"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <span style={{ margin: '0 10px' }}>{form.socialMedia ? 'Social Media ON' : 'Social Media OFF'}</span>
            </div>
            <div style={{ width: '100%', margin: '10px 0px 30px' }}>
              <span>Configure whether this account uses social media feeds</span>
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ActionButton type="submit" icon="update" className="primary" text="Update" onClick={this.onSubmit} disabled={isUpdatingConfiguration} loading={isUpdatingConfiguration} large style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </Formsy>
      </div>
    );
  }
}
