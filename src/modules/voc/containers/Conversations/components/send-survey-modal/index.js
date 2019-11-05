/* eslint-disable object-curly-newline */
/* eslint-disable no-shadow */
/* eslint-disable no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Header, Modal } from 'semantic-ui-react';
import { Form } from 'formsy-semantic-ui-react';

import Audience from '../survey/segments/audience';
import Target from '../survey/segments/target-alternate';
import SurveyActionButton from '../SurveyActionButton';
import ScheduleSegment from '../survey/segments/schedule';

import * as surveysActions from '../../flux/actions';
import * as audiencesActions from 'Modules/voc/containers/Settings/Audiences/flux/actions';

@connect((state) => ({
  authentication: state.authentication,
}), (dispatch) => ({
  surveysActions: bindActionCreators(surveysActions, dispatch),
  audiencesActions: bindActionCreators(audiencesActions, dispatch),
  dispatch,
}))
export default class SendSurveyModal extends Component {
  static propTypes = {
    EventHandler: PropTypes.object.isRequired,
    audiences: PropTypes.array.isRequired,
    authentication: PropTypes.object.isRequired,
    onHideSendSurveyModal: PropTypes.func.isRequired,
    audiencesActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onValidSubmit = this.onValidSubmit.bind(this);
    this.onInvalidSubmit = this.onInvalidSubmit.bind(this);
    this.onInvalid = this.onInvalid.bind(this);
    this.onShowMoreTargetOptionsChanged = this.onShowMoreTargetOptionsChanged.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeMeta = this.onChangeMeta.bind(this);
    this.onAgeChanged = this.onAgeChanged.bind(this);
    this.onGenderChanged = this.onGenderChanged.bind(this);
    this.onValid = this.onValid.bind(this);
    this.onScheduleChanged = this.onScheduleChanged.bind(this);
    this.onFilterChanged = this.onFilterChanged.bind(this);
  }

  state = {
    form: {
      audience: null,
      age: { min: 0, max: 100 },
      meta: {},
      gender: null,
      defaultIncentiveAmount: null,
      target: 100,
      objective: 'AOD',
      scheduleType: 'IMMEDIATELY',
      runTime: null,
    },
    audienceFilters: {},
    showMoreTargetOptions: true,
    open: true,
    isFetchingAudiences: false,
    isSendingSurvey: false,
    valid: true,
    serverErrorMessage: '',
  }

  onChange(event, { name, value }) {
    const { EventHandler } = this.props;
    const { form } = this.state;
    this.setState({ form: { ...form, [name]: value } });

    // track the event
    EventHandler.trackEvent({ category: 'survey-listing', action: 'audience change', value });
  }

  onChangeMeta(event, { name, value }) {
    const { form } = this.state;
    this.setState({ form: { ...form, meta: { ...form.meta, [name]: value } } });
  }

  onAgeChanged(age) {
    const { EventHandler } = this.props;
    const { form } = this.state;
    this.setState({ form: { ...form, age } });

    // track the event
    EventHandler.trackEvent({ category: 'survey-listing', action: 'age range change', value: age });
  }

  onGenderChanged(event, { value }) {
    const { form } = this.state;
    this.setState({ form: { ...form, gender: value } });
  }

  onScheduleChanged(scheduleType, runTime) {
    const { form } = this.state;
    this.setState({ form: { ...form, scheduleType, runTime } });
  }

  async onValidSubmit() {
    const { alertActions, EventHandler, onHideSendSurveyModal, conversation, surveysActions } = this.props;
    const { form, audienceFilters } = this.state;
    if (form.defaultIncentiveAmount === '' || form.defaultIncentiveAmount === null || form.defaultIncentiveAmount < 0) {
      this.setState({ serverErrorMessage: 'Incentive must be a minimum of 0' });
      return;
    }
    this.setState({ serverErrorMessage: '' });

    const { selectedAge, selectedCounty, selectedGender, selectedEducationLevel, selectedEmploymentType, selectedRegion, selectedLsm } = audienceFilters;
    this.setState({ isSendingSurvey: true, serverErrorMessage: '' });
    const { audience, meta, defaultIncentiveAmount, target, scheduleType, runTime } = form;
    const data = {
      age: selectedAge.length ? this.stringifyAge(selectedAge) : [],
      participantMetadata: meta,
      gender: selectedGender || 'ALL',
      county: selectedCounty,
      educationLevel: selectedEducationLevel,
      employmentType: selectedEmploymentType,
      lsm: selectedLsm,
      region: selectedRegion,
      compensation: defaultIncentiveAmount,
      panelId: audience,
      scheduleType,
      runTime,
      target,
    };

    try {
      const sendToPanelResponse = await surveysActions.sendToPanel(conversation.id, data);
      EventHandler.trackEvent({ category: 'survey-listing', action: 'send survey', value: true });
      this.onClose();
      onHideSendSurveyModal();
      alertActions.addAlert({ type: 'success', message: sendToPanelResponse.data.Metadata.message });
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      let errorMessage = 'Oops! Something went wrong and we could not send out the survey. Please try again later.';

      if (Object.keys(exception).includes('message')) {
        errorMessage = exception.message;
      } else if (Object.keys(exception).includes('response')) {
        if (Object.keys(exception.response).includes('data') && Object.keys(exception.response.data.message)) {
          errorMessage = exception.response.data.message || errorMessage;
        }
      }
      this.setState({ serverErrorMessage: errorMessage });
      EventHandler.handleException(exception);
      EventHandler.trackEvent({ category: 'survey-listing', action: 'send survey', value: false });
    } finally {
      this.setState({ isSendingSurvey: false });
    }
  }

  onFilterChanged(filter) {
    this.setState({ audienceFilters: filter });
  }

  onInvalidSubmit() {
    this.setState({ valid: false });
  }

  onValid() {
    this.setState({ valid: true });
  }

  onInvalid() {
    this.setState({ valid: false });
  }

  onShowMoreTargetOptionsChanged(status) {
    const { EventHandler } = this.props;
    EventHandler.trackEvent({ category: 'survey-listing', action: 'show more target options' });
    this.setState({ showMoreTargetOptions: status });
  }

  onClose() {
    const { onHideSendSurveyModal } = this.props;
    this.setState({ open: false, audienceFilters: {} });
    onHideSendSurveyModal();
  }

  stringifyAge(ages) {
    let array = [];

    array = ages.map((age) => `${parseInt(age[0], 10)}-${parseInt(age[1], 10)}`);

    return array;
  }

  render() {
    const { audiences, authentication, onHideSendSurveyModal, audiencesActions } = this.props;
    const { open, showMoreTargetOptions, isSendingSurvey, valid, serverErrorMessage, isFetchingAudiences } = this.state;
    const audiencesList = audiences.items.map((audience) => {
      const country = authentication.user.countries.find((aCountry) => aCountry.id === audience.countryId);
      return {
        key: audience.panelId,
        value: audience.panelId,
        flag: country ? country.code.toLowerCase() : '',
        text: audience.panelName,
        metadata: audience.metadata,
        respondents: audience.numParticipants,
      };
    });

    return (
      <Modal dimmer="blurring" open={open} onClose={this.onClose} centered={false} closeOnDimmerClick closeOnEscape={this.onClose} closeOnRootNodeClick style={{ borderRadius: 16, marginTop: 170, marginRight: 'auto', marginLeft: 'auto', position: 'relative' }}>
        <Modal.Content style={{ borderRadius: 16 }} scrolling>
          <Form ref={(form) => this.form = form} onSubmit={this.onValidSubmit} onInvalidSubmit={this.onInvalidSubmit} onValid={this.onValid} onInvalid={this.onInvalid}>
            <Header>Send Survey</Header>
            <div style={{ width: '100%' }}>
              <Audience form={this.state.form} audiences={audiencesList} audiencesActions={audiencesActions} onFilterChanged={this.onFilterChanged} onChange={this.onChange} onChangeMeta={this.onChangeMeta} onAgeChanged={this.onAgeChanged} onGenderChanged={this.onGenderChanged} isFetchingAudiences={isFetchingAudiences} />
              <Target form={this.state.form} onChange={this.onChange} showMoreTargetOptions={showMoreTargetOptions} onShowMoreTargetOptionsChanged={this.onShowMoreTargetOptionsChanged} showTarget showIncentive />
              <ScheduleSegment form={this.state.form} onChange={this.onScheduleChanged} />
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Button disabled={isSendingSurvey} onClick={onHideSendSurveyModal} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#6d6e71', height: 35, borderRadius: 17.5, margin: '0 5px', padding: '3px 20px', backgroundColor: '#fff' }}>
                Dismiss
              </Button>
              <SurveyActionButton type="submit" disabled={isSendingSurvey || !valid} loading={isSendingSurvey} text="Send" />
            </div>
          </Form>
          {
            !valid && isSendingSurvey ? (
              <div className="form-errors-indicator" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fd9681', color: '#FFF', margin: '10px -21px -21px', padding: 5, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                <i className="material-icons">error_outline</i>
                &nbsp;&nbsp;
                <span>Complete the highlighted fields before you can send your survey</span>
              </div>
            ) : null
          }
          {
            serverErrorMessage.length ? (
              <div className="form-errors-indicator" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fd9681', color: '#FFF', margin: '10px -21px -21px', padding: 5, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                <i className="material-icons">error_outline</i>
                &nbsp;&nbsp;
                <span>{serverErrorMessage}</span>
              </div>
            ) : null
          }
        </Modal.Content>
      </Modal>
    );
  }
}
