/* eslint-disable radix, no-return-assign, no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import Switch from 'react-switch';

import Select from 'SharedComponents/mwamba-dropdown-select';
import ActionButton from 'SharedComponents/action-button';
import CircularButton from 'SharedComponents/circular-button';
import ChannelItem from './ChannelItem';

export default class Convo extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    alertActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    accountDetails: PropTypes.object.isRequired,
    accountsActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onAddChannel = this.onAddChannel.bind(this);
    this.onActiveChanged = this.onActiveChanged.bind(this);
    this.onToggleChannels = this.onToggleChannels.bind(this);
    this.onSwitchToggled = this.onSwitchToggled.bind(this);
    this.handleChangeDropDownConvoNumber = this.handleChangeDropDownConvoNumber.bind(this);
    this.handleChangeDropDownSmsNumber = this.handleChangeDropDownSmsNumber.bind(this);
    this.fetchSmsNumbers = this.fetchSmsNumbers.bind(this);
  }

  state = {
    isFetchingConfiguration: false,
    isUpdatingConfiguration: false,
    showChannels: true,
    isCreatingChannel: false,
    isFetchingSmsNumbers: false,
    smsNumbers: [],
    form: {
      commDomain: '',
      convoNumber: '',
      smsNumber: '',
      active: false,
    },
  }

  componentDidMount() {
    this.fetchSmsNumbers();
  }

  onUpdateSettings() {

  }

  onActiveChanged(active) {
    this.setState({ form: { ...this.state.form, active } });
  }

  onToggleChannels() {
    this.setState({ showChannels: !this.state.showChannels });
  }

  onSwitchToggled(change) {
    this.setState({ form: { ...this.state.form, ...change } });
  }

  async onAddChannel() {
    const { id } = this.context.router.route.match.params;
    this.setState({ isCreatingChannel: true });

    try {
      const channel = { ...this.state.form };
      await this.props.accountsActions.addAccountChannel(id, channel);
      this.props.alertActions.addAlert({ type: 'success', message: 'The channel was successfully added' });
      this.props.onfetchAccountDetails();
      this.onToggleChannels();
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isCreatingChannel: false });
    }
  }

  onInvalidSubmit() {
    this.setState({ formValid: false });
  }

  handleChangeDropDownConvoNumber(option) {
    this.setState({ form: { ...this.state.form, convoNumber: option.value, commDomain: option.commDomain } });
  }

  handleChangeDropDownSmsNumber(option) {
    this.setState({ form: { ...this.state.form, smsNumber: option.value, commDomain: option.commDomain } });
  }

  async fetchSmsNumbers() {
    const { id } = this.context.router.route.match.params;
    this.setState({ isFetchingSmsNumbers: true });

    try {
      const fetchSmsNumbersResult = await this.props.accountsActions.fetchSmsNumbers(id);
      this.setState({ smsNumbers: fetchSmsNumbersResult.data.Data.filter((number) => number.active).map((number) => ({ key: number.id, commDomain: number.comm_domain, label: `${number.msurvey_sms_number} (${number.comm_domain} - ${number.countryCode})`, value: number.msurvey_sms_number })) });
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingSmsNumbers: false });
    }
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        {
          this.state.showChannels ? (
            <CircularButton className="primary cta" style={{ position: 'fixed', top: 83, right: 20, zIndex: 1 }} icon="add" color="#002366" onClick={this.onToggleChannels} />
          ) : (
            <CircularButton className="primary cta" style={{ position: 'fixed', top: 83, right: 20, zIndex: 1 }} icon="close" color="#002366" disable={this.state.isCreatingChannel} onClick={this.onToggleChannels} />
          )
        }
        {
          this.state.showChannels && this.props.accountDetails.channels.length ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'flex-start' }}>
              {
                this.props.accountDetails.channels.map((channel) => (
                  <ChannelItem EventHandler={this.props.EventHandler} alertActions={this.props.alertActions} accountsActions={this.props.accountsActions} channel={channel} />
                ))
              }
            </div>
          ) : this.state.showChannels && !this.props.accountDetails.channels.length ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
              <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>You have not added any channels</h2>
              <p style={{ textAlign: 'center' }}>Channels define the MSISDNS that we use to communicate to through different Telcos</p>
              <ActionButton className="primary" large icon="add" text="Add Channel" onClick={this.onToggleChannels} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          ) : (
            <form>
              <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '10px 3px'}}>
                <small>Convo Number</small>
                <Select
                  name="convoNumber"
                  options={this.state.smsNumbers}
                  value={this.state.form.convoNumber}
                  onChange={this.handleChangeDropDownConvoNumber}
                  placeholder="Convo Number"
                  className="input"
                  style={{ width: '100%', padding: '10px 5px', margin: '10px 0 0', position: 'relative'}}
                  errorLabel={(
                    <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                  )}
                />
                <div style={{ width: '100%', margin: '10px 0px 30px' }}>
                  <span>Configure the phone number that will be used for conversations through Convo for this channel</span>
                </div>
              </div>
              <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '10px 3px' }}>
                <small>SMS Number</small>
                <Select
                  name="smsNumber"
                  options={this.state.smsNumbers}
                  value={this.state.form.smsNumber}
                  onChange={this.handleChangeDropDownSmsNumber}
                  placeholder="SMS Number"
                  className="input"
                  style={{ width: '100%', padding: '10px 5px', margin: '10px 0 0', position: 'relative'}}
                  errorLabel={(
                    <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                  )}
                />
                <div style={{ width: '100%', margin: '10px 0px 30px' }}>
                  <span>Configure the phone number that will be used for sending SMS through this channel</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', margin: '20px 0' }}>
                  <Switch
                    checked={this.state.form.active}
                    onChange={(change) => this.onSwitchToggled({ active: change })}
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
                  <span style={{ margin: '0 10px' }}>{this.state.form.active ? 'Active' : 'Inactive'}</span>
                </div>
                <div style={{ width: '100%', margin: '-10px 0px 30px' }}>
                  <span>Configure whether this channel is active</span>
                </div>
              </div>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 10px' }}>
                <ActionButton icon="playlist_add" type="submit" className="primary" text="Submit" onClick={this.onAddChannel} disabled={this.state.isCreatingChannel} loading={this.state.isCreatingChannel} large style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
              </div>
            </form>
          )
        }
      </div>
    );
  }
}
