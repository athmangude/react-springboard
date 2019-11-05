/* eslint-disable no-return-assign, radix */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Formsy from 'formsy-react';
import { Label } from 'semantic-ui-react';

import IconButton from 'SharedComponents/icon-button';
import Input from 'SharedComponents/mwamba-input';
import ActionButton from 'SharedComponents/action-button';

import * as accountsActions from '../../flux/actions';

@connect((state) => ({
  adminAuthentication: state.adminAuthentication,
}), (dispatch) => ({
  accountsActions: bindActionCreators(accountsActions, dispatch),
  dispatch,
}))
export default class EditUSSD extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    accountId: PropTypes.object.isRequired,
    survey: PropTypes.object,
    onCloseSidePanel: PropTypes.func.isRequired,
    adminAuthentication: PropTypes.object.isRequired,
    accountsActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const { survey } = props;
    const ussd = survey.surveyMetadata.find((metadata) => metadata.name === 'ussd') || {};
    this.state = {
      form: {
        ussd: ussd.value,
      },
      formValid: false,
      isUpdatingUSSD: false,
    };

    this.onInputChanged = this.onInputChanged.bind(this);
    this.onUpdateUSSD = this.onUpdateUSSD.bind(this);
    this.onFormValid = this.onFormValid.bind(this);
    this.onFormInvalid = this.onFormInvalid.bind(this);
    this.onInvalidSubmit = this.onInvalidSubmit.bind(this);
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

  async onUpdateUSSD() {
    this.setState({ isUpdatingUSSD: true });

    try {
      const { accountId, survey } = this.props;
      const { form } = this.state;
      const data = {
        name: 'ussd',
        value: form.ussd,
      };
      await this.props.accountsActions.createUSSD(accountId, survey.id, data);
      this.props.alertActions.addAlert({ type: 'success', message: 'The USSD was successfully updated' });
      this.props.fetchUSSDSurveys();
      this.props.onCloseSidePanel();
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isUpdatingUSSD: false });
    }
  }

  onInvalidSubmit() {
    this.setState({ formValid: false });
  }

  render() {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Update USSD</h2>
          <IconButton icon="close" onClick={this.props.onCloseSidePanel} />
        </div>
        <div style={{ padding: 10, height: 'calc(100% - 63px)', overflowY: 'auto' }}>
          <Formsy ref={(form) => this.form = form} action="#" onValid={this.onFormValid} onInvalid={this.onFormInvalid} onValidSubmit={this.onUpdateUSSD} onInvalidSubmit={this.onInvalidSubmit}>
            <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Survey USSD Details</h2>
            <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '20px 3px' }}>
              <small>SURVEY</small>
              <div>{this.props.survey.title}</div>
            </div>
            <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '20px 3px' }}>
              <small>USSD</small>
              <Input
                name="ussd"
                type="number"
                value={this.state.form.ussd}
                onChange={this.onInputChanged}
                placeholder="USSD"
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
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ActionButton type="submit" className="primary" text="Update" disabled={!this.state.formValid || this.state.isUpdatingUSSD || !this.props.survey.id} loading={this.state.isUpdatingUSSD} large style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          </Formsy>
        </div>
      </div>
    );
  }
}
