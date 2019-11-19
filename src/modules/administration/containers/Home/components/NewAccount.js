/* eslint-disable no-return-assign, radix */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Formsy from 'formsy-react';
import { Label } from 'semantic-ui-react';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';
import Switch from 'react-switch';
import styled from 'styled-components';

import IconButton from 'SharedComponents/icon-button';
import Input from 'SharedComponents/mwamba-input';
import CountryPicker from 'SharedComponents/mwamba-country-picker';
import DropDownSelect from 'SharedComponents/mwamba-dropdown-select';
import ActionButton from 'SharedComponents/action-button';

import * as accountsActions from '../flux/actions';

import calendarStyles from './calendar.css';

const DateRangePickerWrapper = styled(DateRangePicker)`${calendarStyles}`

@connect((state) => ({
  adminAuthentication: state.adminAuthentication,
  accounts: state.accounts,
}), (dispatch) => ({
  accountsActions: bindActionCreators(accountsActions, dispatch),
  dispatch,
}))
export default class NewAccount extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    accounts: PropTypes.object.isRequired,
    onCloseSidePanel: PropTypes.func.isRequired,
    adminAuthentication: PropTypes.object.isRequired,
    accountsActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onCountryChange = this.onCountryChange.bind(this);
    this.onIndustryChanged = this.onIndustryChanged.bind(this);
    this.onInputChanged = this.onInputChanged.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onCreateAccount = this.onCreateAccount.bind(this);
    this.onFormValid = this.onFormValid.bind(this);
    this.onFormInvalid = this.onFormInvalid.bind(this);
    this.onInvalidSubmit = this.onInvalidSubmit.bind(this);
    this.onActiveChanged = this.onActiveChanged.bind(this);
  }

  state = {
    form: {
      profilename: '',
      startDate: moment(),
      endDate: moment().add(1, 'year'),
      country: this.props.adminAuthentication.admin.data.countries[0].code,
      messageCredits: 100,
      incentivesBalance: 100,
      quota: 100,
      active: false,
      surveyEmail: '',
      industryId: null,
    },
    formValid: false,
    isCreatingAccount: false,
  }

  onActiveChanged(active) {
    this.setState({ form: { ...this.state.form, active } });
  }

  onCountryChange(change) {
    this.setState({ form: { ...this.state.form, country: change.code } });
  }

  onIndustryChanged(change) {
    this.setState({ form: { ...this.state.form, industryId: change.value } });
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({ form: { ...this.state.form, startDate, endDate } });
  }

  onInputChanged(event) {
    this.setState({ form: { ...this.state.form, [event.target.name]: event.target.value } });
  }

  onFormValid() {
    this.setState({ formValid: true });
  }

  onFormInvalid() {
    this.setState({ formValid: false });
  }

  async onCreateAccount() {
    this.setState({ isCreatingAccount: true });

    try {
      const accountDetails = { ...this.state.form };
      await this.props.accountsActions.createAccount(accountDetails);
      this.props.alertActions.addAlert({ type: 'success', message: 'The account was created successfully' });
      this.props.fetchAccounts();
      this.context.router.history.push('/accounts');
      this.props.onCloseSidePanel();
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isCreatingAccount: false });
    }
  }

  onInvalidSubmit() {
    this.setState({ formValid: false });
  }

  render() {
    const industryOptions = !this.props.accounts.industries ? [] : this.props.accounts.industries.map((industry) => ({ ...industry, label: industry.name, value: industry.id }));
    const { countries } = this.props.adminAuthentication.admin.data;

    return (
      <div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Create Account</h2>
          <IconButton icon="close" onClick={this.props.onCloseSidePanel} />
        </div>
        <div style={{ padding: 10, height: 'calc(100% - 63px)', overflowY: 'auto' }}>
          <Formsy ref={(form) => this.form = form} action="#" onValid={this.onFormValid} onInvalid={this.onFormInvalid} onValidSubmit={this.onCreateAccount} onInvalidSubmit={this.onInvalidSubmit}>
            <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Account Details</h2>
            <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '20px 3px' }}>
              <small>Profile Name</small>
              <Input
                name="profilename"
                value={this.state.form.profilename}
                onChange={this.onInputChanged}
                placeholder="Profile Name"
                required
                validations={{ isExisty: true }}
                validationErrors={{ isExisty: 'This field is required' }}
                style={{ width: '100%', padding: '10px 5px', margin: '10px 0 0', position: 'relative' }}
                className="input"
                errorLabel={(
                  <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                )}
              />
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', margin: '20px 3px' }}>
              <small>Subscription Duration</small>
              <DateRangePickerWrapper
                startDate={this.state.form.startDate} // momentPropTypes.momentObj or null,
                startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                endDate={this.state.form.endDate} // momentPropTypes.momentObj or null,
                endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                onDatesChange={this.onDatesChange}
                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={(focusedInput) => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                numberOfMonths={1}
                hideKeyboardShortcutsPanel
                noBorder
              />
            </div>
            <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '20px 3px' }}>
              <small>Country</small>
              <CountryPicker options={countries} value={this.state.form.country} onChange={this.onCountryChange} style={{ width: '100%' }} />
            </div>
            <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '20px 3px' }}>
              <small>Industry</small>
              <DropDownSelect placeholder="Select an industry" options={industryOptions} value={this.state.form.industryId} onChange={this.onIndustryChanged} style={{ width: '100%' }} />
            </div>
            <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '20px 3px' }}>
              <small>SurveyEmail</small>
              <Input
                name="surveyEmail"
                type="email"
                value={this.state.form.surveyEmail}
                onChange={this.onInputChanged}
                placeholder="Survey Email"
                required
                validations={{ isExisty: true, isEmail: true }}
                validationErrors={{ isEmail: 'invalid email', isExisty: 'This field is required' }}
                style={{ width: '100%', padding: '10px 5px', margin: '10px 0 0', position: 'relative' }}
                className="input"
                errorLabel={(
                  <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                )}
              />
            </div>
            <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '20px 3px' }}>
              <small>Message Credits</small>
              <Input
                name="messageCredits"
                type="number"
                value={this.state.form.messageCredits}
                onChange={this.onInputChanged}
                placeholder="Message Credits"
                required
                validations={{ isExisty: true, isNumeric: true }}
                validationErrors={{ isNumeric: 'only numeric characters are allowed', isExisty: 'This field is required' }}
                style={{ width: '100%', padding: '10px 5px', margin: '10px 0 0', position: 'relative' }}
                className="input"
                errorLabel={(
                  <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                )}
              />
            </div>
            <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '20px 3px' }}>
              <small>Quota</small>
              <Input
                name="quota"
                type="number"
                value={this.state.form.quota}
                onChange={this.onInputChanged}
                placeholder="Quota"
                required
                validations={{ isExisty: true, isNumeric: true }}
                validationErrors={{ isNumeric: 'only numeric characters are allowed', isExisty: 'This field is required' }}
                style={{ width: '100%', padding: '10px 5px', margin: '10px 0 0', position: 'relative' }}
                className="input"
                errorLabel={(
                  <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                )}
              />
            </div>
            <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '20px 3px' }}>
              <small>Incentives Balance</small>
              <Input
                name="incentivesBalance"
                type="number"
                value={this.state.form.incentivesBalance}
                onChange={this.onInputChanged}
                placeholder="Incentives Balance"
                required
                validations={{ isExisty: true, isNumeric: true }}
                validationErrors={{ isNumeric: 'only numeric characters are allowed', isExisty: 'This field is required' }}
                style={{ width: '100%', padding: '10px 5px', margin: '10px 0 0', position: 'relative' }}
                className="input"
                errorLabel={(
                  <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                )}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', margin: '20px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', flexGrow: 1 }}>
                <Switch
                  checked={this.state.form.active}
                  onChange={this.onActiveChanged}
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
                <span style={{ margin: '0 10px' }}>{this.state.active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ActionButton type="submit" className="primary" text="Submit" disabled={!this.state.formValid || this.state.isCreatingAccount} loading={this.state.isCreatingAccount} large style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          </Formsy>
        </div>
      </div>
    );
  }
}
