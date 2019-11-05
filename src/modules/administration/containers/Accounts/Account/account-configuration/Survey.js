/* eslint-disable radix, no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import { Label } from 'semantic-ui-react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import Switch from 'react-switch';
import Spinner from 'react-spinner-material';

import Input from 'SharedComponents/mwamba-input';
import Textarea from 'SharedComponents/mwamba-textarea';
import ActionButton from 'SharedComponents/action-button';

export default class Surveys extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    alertActions: PropTypes.object.isRequired,
    isFetchingSettings: PropTypes.bool.isRequired,
    accountDetails: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    const { accountFeatures } = props.accountDetails;

    this.state = {
      isUpdatingConfiguration: false,
      formValid: false,
      form: {
        msurveyEndMessage: accountFeatures.msurveyEndMessage,
        customEndMessage: accountFeatures.customEndMessage,
        surveyIncentives: accountFeatures.surveyIncentives,
        surveyReinvite: accountFeatures.surveyReinvite,
        reinviteLimit: accountFeatures.reinviteLimit,
        surveyReminder: accountFeatures.surveyReminder,
        reminderLimit: accountFeatures.reminderLimit,
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSwitchToggled = this.onSwitchToggled.bind(this);
    this.onInvalidSubmit = this.onInvalidSubmit.bind(this);
    this.onUpdateAccount = this.onUpdateAccount.bind(this);
    this.onFormInvalid = this.onFormInvalid.bind(this);
    this.onFormValid = this.onFormValid.bind(this);
    this.isButtonActive = this.isButtonActive.bind(this);
  }

  onFormValid() {
    this.setState({ formValid: true });
  }

  onFormInvalid() {
    this.setState({ formValid: false });
  }

  async onUpdateAccount() {
    const { id } = this.context.router.route.match.params;
    this.setState({ isUpdatingConfiguration: true });

    try {
      const accountDetails = { ...this.state.form };
      await this.props.accountsActions.updateAccountFeatures(id, accountDetails);
      this.props.alertActions.addAlert({ type: 'success', message: 'The account have been created successfully' });
      this.props.onfetchAccountDetails(id);
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isUpdatingConfiguration: false });
    }
  }

  onInvalidSubmit() {
    this.setState({ formValid: false });
  }

  onSwitchToggled(change) {
    this.setState({ form: { ...this.state.form, ...change } });
    this.form.validateForm();
    this.forceUpdate();
  }

  handleChange(event) {
    this.setState({ form: { ...this.state.form, [event.target.name]: event.target.value } });
    this.form.validateForm();
    this.forceUpdate();
  }

  isButtonActive() {
    if (this.state.isUpdatingConfiguration) {
      return false;
    }

    return true; // TODO Find better way to do this

    const { accountFeatures } = this.props.accountDetails;

    if (this.state.form.surveyReinvite !== accountFeatures.surveyReinvite || this.state.form.surveyReminder !== accountFeatures.surveyReminder || this.state.form.msurveyEndMessage !== accountFeatures.msurveyEndMessage || this.state.form.customEndMessage !== accountFeatures.customEndMessage) {
      if (this.form) {
        return this.form.state.isValid;
      }
    }

    return true;
  }

  render() {
    return (
      <div style={{ width: '100%', maxWidth: 400 }}>
        {
          this.props.isFetchingSettings ? (
            <div style={{ height: 200, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <Spinner spinnerColor="#002366" size={50} spinnerWidth={4} />
              <span style={{ margin: 20 }}>Fetching Settings</span>
            </div>
          ) : (
            <Formsy ref={(form) => this.form = form} action="#" onValid={this.onFormValid} onInvalid={this.onFormInvalid} onValidSubmit={this.onUpdateAccount} onInvalidSubmit={this.onInvalidSubmit}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                  <Switch
                    checked={this.state.form.surveyReinvite}
                    onChange={(change) => this.onSwitchToggled({ surveyReinvite: change })}
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
                  <span style={{ margin: '0 10px' }}>{this.state.form.surveyReinvite ? 'Customer can trigger reinvites' : 'Customer cannot trigger reinvites'}</span>
                </div>
                <div style={{ width: '100%', margin: '10px 0px 30px' }}>
                  <span>Configure whether the customer can trigger reinvites for surveys on their account</span>
                </div>
              </div>
              {
                this.state.form.surveyReinvite ? (
                  <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '10px 3px' }}>
                    <small>Reinvites Limit</small>
                    <Input
                      name="reinviteLimit"
                      type="number"
                      value={this.state.form.reinviteLimit}
                      onChange={this.handleChange}
                      placeholder="Reinvite Limit"
                      required
                      validations={{ isExisty: true, isNumeric: true }}
                      validationErrors={{ isExisty: 'This field is required', isNumeric: 'Only numeric characters are allowed' }}
                      style={{ width: '100%', padding: '10px 5px', margin: '10px 0 0', position: 'relative' }}
                      className="input"
                      errorLabel={(
                        <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                      )}
                    />
                    <div style={{ width: '100%', margin: '10px 0px 30px' }}>
                      <span>The maximum number of reinvites that a customer can trigger for surveys</span>
                    </div>
                  </div>
                ) : null
              }
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                  <Switch
                    checked={this.state.form.surveyReminder}
                    onChange={(change) => this.onSwitchToggled({ surveyReminder: change })}
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
                  <span style={{ margin: '0 10px' }}>{this.state.form.surveyReminder ? 'Customer can trigger survey reminders' : 'Customer cannot trigger survey reminders'}</span>
                </div>
                <div style={{ width: '100%', margin: '10px 0px 30px' }}>
                  <span>Configure whether the customer can trigger reminders for surveys on their account</span>
                </div>
              </div>
              {
                this.state.form.surveyReminder ? (
                  <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '10px 3px' }}>
                    <small>Reminder Limit</small>
                    <Input
                      name="reminderLimit"
                      type="number"
                      value={this.state.form.reminderLimit}
                      onChange={this.handleChange}
                      placeholder="Reminder Limit"
                      required
                      validations={{ isExisty: true, isNumeric: true }}
                      validationErrors={{ isExisty: 'This field is required', isNumeric: 'Only numeric characters are allowed' }}
                      style={{ width: '100%', padding: '10px 5px', margin: '10px 0 0', position: 'relative' }}
                      className="input"
                      errorLabel={(
                        <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                      )}
                    />
                    <div style={{ width: '100%', margin: '10px 0px 30px' }}>
                      <span>The maximum number of reminders that a customer can trigger for surveys</span>
                    </div>
                  </div>
                ) : null
              }
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                  <Switch
                    checked={this.state.form.msurveyEndMessage}
                    onChange={(change) => this.onSwitchToggled({ msurveyEndMessage: change })}
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
                  <span style={{ margin: '0 10px' }}>{this.state.form.msurveyEndMessage ? 'Powered by mSurvey ON' : 'Powered by mSurvey OFF'}</span>
                </div>
                <div style={{ width: '100%', margin: '10px 0px 30px' }}>
                  <span>Configure whether the <code><b>Powered by mSurvey</b></code> message will be sent at the end of the survey</span>
                </div>
              </div>
              {
                !this.state.form.msurveyEndMessage ? (
                  <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '10px 3px' }}>
                    <small>Custom End Message</small>
                    <Textarea
                      name="customEndMessage"
                      type="text"
                      value={this.state.form.customEndMessage}
                      onChange={this.handleChange}
                      placeholder="Custom End Message"
                      required
                      validations={{ isExisty: true, maxLength: 160 }}
                      validationErrors={{ isExisty: 'This field is required', isNumeric: 'Only numeric characters are allowed', maxLength: 'too long' }}
                      style={{ width: '100%', padding: '10px 5px', margin: '10px 0 0', position: 'relative' }}
                      className="input"
                      errorLabel={(
                        <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                      )}
                    />
                    <div style={{ width: '100%', margin: '10px 0px 30px' }}>
                      <span>Customize the end message if the customer opts to remove the <code><b>Powered by mSurvey</b></code> message</span>
                    </div>
                  </div>
                ) : null
              }
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                  <Switch
                    checked={this.state.form.surveyIncentives}
                    onChange={(change) => this.onSwitchToggled({ surveyIncentives: change })}
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
                  <span style={{ margin: '0 10px' }}>{this.state.form.surveyIncentives ? 'Customer can send incentives to audience' : 'Customer cannot send incentives to audience'}</span>
                </div>
                <div style={{ width: '100%', margin: '10px 0px 30px' }}>
                  <span>Configure whether the customer can send incentives to audience once they have completed their surveys</span>
                </div>
              </div>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ActionButton
                  icon="update"
                  large
                  type="Update"
                  className="primary"
                  text="Submit"
                  disabled={!this.isButtonActive()}
                  loading={this.state.isUpdatingConfiguration}
                  style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }}
                />
              </div>
            </Formsy>
          )
        }
      </div>
    );
  }
}
