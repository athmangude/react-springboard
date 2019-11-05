/* eslint-disable object-curly-newline */
/* eslint-disable no-shadow */
/* eslint-disable no-return-assign */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Header } from "semantic-ui-react";
import { Form } from "formsy-semantic-ui-react";
// import Audience from '../survey/segments/audience';
import Target from "Modules/voc/containers/Conversations/components/survey/segments/target-alternate";
import SurveyActionButton from "Modules/voc/containers/Conversations/components/SurveyActionButton";
import ScheduleSegment from "Modules/voc/containers/Conversations/components/survey/segments/schedule";

import * as audiencesActions from "Modules/voc/containers/Settings/Audiences/flux/actions";

@connect(
  state => ({
    authentication: state.authentication
  }),
  dispatch => ({
    audiencesActions: bindActionCreators(audiencesActions, dispatch),
    dispatch
  })
)
export default class SendCampaign extends Component {
  static propTypes = {
    EventHandler: PropTypes.object.isRequired,
    customerAnalyticsActions: PropTypes.object.isRequired,
    conversation: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    onCloseSidePanel: PropTypes.func.isRequired,
    segmentId: PropTypes.number.isRequired,
    participants: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.onValidSubmit = this.onValidSubmit.bind(this);
    this.onInvalidSubmit = this.onInvalidSubmit.bind(this);
    this.onInvalid = this.onInvalid.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeMeta = this.onChangeMeta.bind(this);
    this.onValid = this.onValid.bind(this);
    this.onScheduleChanged = this.onScheduleChanged.bind(this);
  }

  state = {
    form: {
      meta: {},
      defaultIncentiveAmount: null,
      target: 100,
      objective: "AOD",
      scheduleType: "IMMEDIATELY",
      runTime: null
    },
    showMoreTargetOptions: true,
    isFetchingAudiences: false,
    isSendingSurvey: false,
    valid: true,
    serverErrorMessage: ""
  };

  onChange(event, { name, value }) {
    const { EventHandler } = this.props;
    const { form } = this.state;
    this.setState({ form: { ...form, [name]: value } });

    // track the event
    EventHandler.trackEvent({
      category: "survey-listing",
      action: "audience change",
      value
    });
  }

  onChangeMeta(event, { name, value }) {
    const { form } = this.state;
    this.setState({ form: { ...form, meta: { ...form.meta, [name]: value } } });
  }

  onScheduleChanged(event, { name, value }) {
    const { form } = this.state;
    this.setState({ form: { ...form, [name]: value } });
  }

  async onValidSubmit() {
    const {
      alertActions,
      EventHandler,
      conversation,
      customerAnalyticsActions,
      onCloseSidePanel,
      segmentId,
      participants
    } = this.props;
    const { form } = this.state;
    if (
      form.defaultIncentiveAmount === "" ||
      form.defaultIncentiveAmount === null ||
      form.defaultIncentiveAmount < 0
    ) {
      this.setState({ serverErrorMessage: "Incentive must be a minimum of 0" });
      return;
    }
    this.setState({ serverErrorMessage: "" });

    this.setState({ isSendingSurvey: true, serverErrorMessage: "" });
    const { defaultIncentiveAmount, target, scheduleType, runTime } = form;
    const data = {
      incentivesAmount: defaultIncentiveAmount,
      runTime,
      surveyId: conversation.id,
      surveyScheduleType: scheduleType,
      target
    };

    try {
      let sendSurveyResponse = null;

      if (participants && participants.length) {
        data.participantId = participants;
        sendSurveyResponse = await customerAnalyticsActions.sendCampaignToParticipants(
          data
        );
      } else {
        sendSurveyResponse = await customerAnalyticsActions.sendSurveyToSegment(
          segmentId,
          data
        );
      }
      EventHandler.trackEvent({
        category: "survey-listing",
        action: "send survey",
        value: true
      });
      alertActions.addAlert({
        type: "success",
        message: sendSurveyResponse.data.Metadata.message
      });
      onCloseSidePanel();
    } catch (exception) {
      alertActions.addAlert({
        type: "error",
        message: exception.response.data.message || exception.message
      });
      let errorMessage =
        "Oops! Something went wrong and we could not send out the survey. Please try again later.";

      if (Object.keys(exception).includes("message")) {
        errorMessage = exception.message;
      } else if (Object.keys(exception).includes("response")) {
        if (
          Object.keys(exception.response).includes("data") &&
          Object.keys(exception.response.data.message)
        ) {
          errorMessage = exception.response.data.message || errorMessage;
        }
      }
      this.setState({ serverErrorMessage: errorMessage });
      EventHandler.handleException(exception);
      EventHandler.trackEvent({
        category: "survey-listing",
        action: "send survey",
        value: false
      });
    } finally {
      this.setState({ isSendingSurvey: false });
    }
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

  render() {
    const {
      showMoreTargetOptions,
      isSendingSurvey,
      valid,
      serverErrorMessage
    } = this.state;
    return (
      <div>
        <div>
          <Form
            ref={form => (this.form = form)}
            onSubmit={this.onValidSubmit}
            onInvalidSubmit={this.onInvalidSubmit}
            onValid={this.onValid}
            onInvalid={this.onInvalid}
          >
            {/* <Header>Send Campaign</Header> */}
            <div style={{ width: "100%", padding: "10px 10px" }}>
              <Target
                form={this.state.form}
                onChange={this.onChange}
                showMoreTargetOptions={showMoreTargetOptions}
                onShowMoreTargetOptionsChanged={
                  this.onShowMoreTargetOptionsChanged
                }
                showTarget
                showIncentive
              />
              <ScheduleSegment
                form={this.state.form}
                onChange={this.onScheduleChanged}
              />
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end"
              }}
            >
              <SurveyActionButton
                type="submit"
                disabled={isSendingSurvey || !valid}
                loading={isSendingSurvey}
                text="Send"
              />
            </div>
          </Form>
          {!valid && isSendingSurvey ? (
            <div
              className="form-errors-indicator"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fd9681",
                color: "#FFF",
                margin: "10px -21px -21px",
                padding: 5,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16
              }}
            >
              <i className="material-icons">error_outline</i>
              &nbsp;&nbsp;
              <span>
                Complete the highlighted fields before you can send your survey
              </span>
            </div>
          ) : null}
          {serverErrorMessage.length ? (
            <div
              className="form-errors-indicator"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fd9681",
                color: "#FFF",
                margin: "10px -21px -21px",
                padding: 5,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16
              }}
            >
              <i className="material-icons">error_outline</i>
              &nbsp;&nbsp;
              <span>{serverErrorMessage}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
