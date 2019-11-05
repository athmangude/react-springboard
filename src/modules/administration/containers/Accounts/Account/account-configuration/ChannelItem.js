/* eslint-disable no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';
import { Label } from 'semantic-ui-react';

import Select from 'SharedComponents/mwamba-dropdown-select';
import ActionButton from 'SharedComponents/action-button';
import IconButton from 'SharedComponents/icon-button';

export default class ChannelItem extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    channel: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    const { channel } = this.props;

    this.state = {
      isFetchingConfiguration: false,
      isUpdatingConfiguration: false,
      showChannels: true,
      isUpdatingChannel: false,
      expanded: false,
      isFetchingSmsNumbers: false,
      smsNumbers: [],
      form: {
        id: channel.id,
        commDomain: channel.commDomain,
        convoNumber: channel.convoNumber,
        smsNumber: channel.smsNumber,
        active: channel.active,
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSwitchToggled = this.onSwitchToggled.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onToggleExpanded = this.onToggleExpanded.bind(this);
    this.handleChangeDropDownConvoNumber = this.handleChangeDropDownConvoNumber.bind(this);
    this.handleChangeDropDownSmsNumber = this.handleChangeDropDownSmsNumber.bind(this);
    this.fetchSmsNumbers = this.fetchSmsNumbers.bind(this);
  }

  componentDidMount() {
    this.fetchSmsNumbers();
  }

  onSwitchToggled(change) {
    this.setState({ form: { ...this.state.form, ...change } });
  }

  async onUpdate() {
    const { id } = this.context.router.route.match.params;
    this.setState({ isUpdatingChannel: true });

    try {
      const channel = { ...this.state.form };
      await this.props.accountsActions.updateAccountChannel(id, channel);
      this.props.alertActions.addAlert({ type: 'success', message: 'The channel was successfully updated' });
      this.props.onfetchAccountDetails();
      this.onToggleChannels();
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isUpdatingChannel: false });
    }
  }

  onToggleExpanded() {
    this.setState({ expanded: !this.state.expanded });
  }

  handleChangeDropDownConvoNumber(option) {
    this.setState({ form: { ...this.state.form, convoNumber: option.value, commDomain: option.commDomain } });
  }

  handleChangeDropDownSmsNumber(option) {
    this.setState({ form: { ...this.state.form, smsNumber: option.value, commDomain: option.commDomain } });
  }

  handleChange(event) {
    this.setState({ form: { ...this.state.form, [event.target.name]: event.target.value } });
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
    if (!this.state.expanded) {
      return (
        <div style={{ width: 300, borderRadius: 8, margin: 10, border: 'solid 1px #d9d9d9' }}>
          <div style={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ textTransform: 'capitalize', fontSize: 20 }}>{this.state.form.commDomain}</span>
            <IconButton onClick={this.onToggleExpanded} icon="keyboard_arrow_down" style={{ margin: 0, color: '#3d4553' }} />
          </div>
          <div style={{ minHeight: 100, position: 'relative' }}>
            {
              Object.keys(this.state.form).filter((key) => this.state.form[key] !== null && this.state.form[key] !== '' && key !== 'id' && key !== 'commDomain' && key !== 'active').map((property) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: 'solid 1px #d9d9d9', padding: 10 }}>
                  <span style={{ textTransform: 'capitalize' }}>{property.replace(/([a-z])([A-Z])/, '$1 $2')}</span>
                  <span>{this.state.form[property]}</span>
                </div>
              ))
            }
            <div style={{ width: '100%', height: 10, backgroundColor: this.state.form.active ? '#80c582' : '#f26b50', position: 'absolute', bottom: 0, margin: 0, borderBottomRightRadius: 8, borderBottomLeftRadius: 8 }}></div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', width: 300, borderRadius: 8, margin: 10, padding: 10, position: 'relative', boxShadow: '0 0 3px rgba(0, 0, 0, 0.3)' }}>
        <IconButton onClick={this.onToggleExpanded} icon="keyboard_arrow_up" style={{ margin: 0, color: '#3d4553', position: 'absolute', top: 10, right: 10, zIndex: 1 }} />
        <form>
          <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '10px 3px' }}>
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
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ActionButton icon="update" type="Update" className="primary" text="Update" onClick={this.onUpdate} disabled={this.state.isUpdatingChannel} loading={this.state.isUpdatingChannel} large style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </form>
      </div>
    );
  }
}
