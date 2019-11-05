/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable object-curly-newline */
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react/dist/commonjs';
import ActionButton from 'SharedComponents/action-button';
import IconButton from 'SharedComponents/icon-button';


export default class SurveyMetadataPanel extends Component {
  static propTypes = {
    conversation: PropTypes.object.isRequired,
    daysList: PropTypes.array,
    hoursList: PropTypes.array,
    minutesList: PropTypes.array,
    secondsList: PropTypes.array,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    surveyMetadataActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    const { surveyMetadata } = props.conversation;
    const transactionalSurveyDelay = surveyMetadata.find((metadata) => metadata.name === 'transactionalSurveyDelay');

    if (transactionalSurveyDelay) {
      const milliseconds = parseInt(transactionalSurveyDelay.value, 10);
      seconds = Math.floor(milliseconds / 1000);
      minutes = Math.floor(seconds / 60);
      seconds %= 60;
      hours = Math.floor(minutes / 60);
      minutes %= 60;
      days = Math.floor(hours / 24);
      hours %= 24;
    }

    this.state = {
      days,
      hours,
      minutes,
      seconds,
      isAddingDelay: false,
      isUpdatingDelay: false,
      isExpanded: false,
    };

    this.onDaysChanged = this.onDaysChanged.bind(this);
    this.onHoursChanged = this.onHoursChanged.bind(this);
    this.onMinutesChanged = this.onMinutesChanged.bind(this);
    this.onSecondsChanged = this.onSecondsChanged.bind(this);
    this.onToggleExpanded = this.onToggleExpanded.bind(this);
    this.onAddDelay = this.onAddDelay.bind(this);
    this.onUpdateDelay = this.onUpdateDelay.bind(this);
  }

  onDaysChanged(e, { value }) {
    const { EventHandler } = this.props;
    this.setState({ days: value });
    EventHandler.trackEvent({ category: 'Delays', action: 'changed days', value });
  }

  onHoursChanged(e, { value }) {
    const { EventHandler } = this.props;
    this.setState({ hours: value });
    EventHandler.trackEvent({ category: 'Delays', action: 'changed hours', value });
  }

  onMinutesChanged(e, { value }) {
    const { EventHandler } = this.props;
    this.setState({ minutes: value });
    EventHandler.trackEvent({ category: 'Delays', action: 'changed minutes', value });
  }

  onSecondsChanged(e, { value }) {
    const { EventHandler } = this.props;
    this.setState({ seconds: value });
    EventHandler.trackEvent({ category: 'Delays', action: 'changed seconds', value });
  }

  async onAddDelay() {
    this.setState({ isAddingDelay: true });
    const { conversation } = this.props;
    const surveyId = conversation.id;
    const {
      days, hours, minutes, seconds,
    } = this.state;
    const transactionalSurveyDelay = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);

    try {
      const {
        surveyMetadataActions, alertActions, EventHandler, fetchActiveConversations,
      } = this.props;
      await surveyMetadataActions.addSurveyMetadata(surveyId, { name: 'transactionalSurveyDelay', value: transactionalSurveyDelay });
      alertActions.addAlert({ type: 'success', message: 'The delay was added successfully' });
      EventHandler.trackEvent({ category: 'Delays', action: 'add delay', value: true });
      fetchActiveConversations();
    } catch (exception) {
      const { alertActions, EventHandler } = this.props;
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
      EventHandler.trackEvent({ category: 'Delays', action: 'add delay', value: false });
    } finally {
      this.setState({ isAddingDelay: false });
    }
  }

  async onUpdateDelay() {
    this.setState({ isUpdatingDelay: true });
    const { conversation } = this.props;
    const surveyId = conversation.id;
    const {
      days, hours, minutes, seconds,
    } = this.state;
    const transactionalSurveyDelay = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);

    try {
      const {
        surveyMetadataActions, alertActions, EventHandler, fetchActiveConversations,
      } = this.props;
      await surveyMetadataActions.updateSurveyMetadata(surveyId, { metadata: { transactionalSurveyDelay }, surveyId });
      alertActions.addAlert({ type: 'success', message: 'The delay was updated successfully' });
      EventHandler.trackEvent({ category: 'Delays', action: 'update delay', value: true });
      fetchActiveConversations();
    } catch (exception) {
      const { alertActions, EventHandler } = this.props;
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
      EventHandler.trackEvent({ category: 'Delays', action: 'update delay', value: false });
    } finally {
      this.setState({ isUpdatingDelay: false });
    }
  }

  onToggleExpanded() {
    const { isExpanded } = this.state;
    this.setState({
      isExpanded: !isExpanded,
    });
  }

  render() {
    const { conversation } = this.props;
    const { surveyMetadata, title } = conversation;
    const { daysList, hoursList, minutesList, secondsList } = this.props;
    const transactionalSurveyDelay = surveyMetadata.find((metadata) => metadata.name === 'transactionalSurveyDelay') || null;
    const { isAddingDelay, isUpdatingDelay, isExpanded, days, hours, minutes, seconds } = this.state;
    const Div = styled.div`
    width: 120px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 10px;
    align-self: baseline;
    `;

    return (
      <div style={{ width: '100%' }}>
        {
          transactionalSurveyDelay ? (
            <div style={{ backgroundColor: '#46b39d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '-10px -10px 0 -10px', borderTopRightRadius: 8, borderTopLeftRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="material-icons" style={{ color: '#FFF', marginRight: 10, alignSelf: 'flex-start', margin: '5px 5px' }}>
                timer
                </i>
                <span style={{ color: '#fff' }}>Delay</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: 10, alignSelf: 'baseline' }}>
                <i className="material-icons" style={{ color: '#FFF', marginRight: 10, alignSelf: 'flex-start' }}>timer</i>
                <span style={{ color: '#fff' }}>{`${days}D ${hours}H ${minutes}M ${seconds}S`}</span>
              </div>
            </div>
          ) : null
        }
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {title}
          {
            isExpanded ? (
              <IconButton icon="keyboard_arrow_up" onClick={this.onToggleExpanded} style={{ marginTop: 3 }} />
            ) : (
              <IconButton icon="keyboard_arrow_down" onClick={this.onToggleExpanded} style={{ marginTop: 3 }} />
            )
          }
        </div>
        {
          isExpanded ? (
            <div style={{ width: '100%' }}>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', flexWrap: 'wrap' }}>
                <div style={{ width: '100%', padding: 3 }}>
                  <span style={{ color: '#808285' }}>The delay text will be used to delay the time the client receives the survey from the moment it is triggered at a touchpoint</span>
                </div>
                <Div>
                  <Dropdown inline options={daysList} scrolling value={days} onChange={this.onDaysChanged} />
                  {' '}
                  days
                </Div>
                <Div>
                  <Dropdown inline options={hoursList} scrolling value={hours} onChange={this.onHoursChanged} />
                  {' '}
                  hours
                </Div>
                <Div>
                  <Dropdown inline options={minutesList} scrolling value={minutes} onChange={this.onMinutesChanged} />
                  {' '}
                  minutes
                </Div>
                <Div>
                  <Dropdown inline options={secondsList} scrolling value={seconds} onChange={this.onSecondsChanged} />
                  {' '}
                  seconds
                </Div>
              </div>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                {
                  transactionalSurveyDelay === null ? (
                    <ActionButton onClick={this.onAddDelay} text="Add&nbsp;delay" icon="timer" disabled={isAddingDelay} loading={isAddingDelay} />
                  ) : (
                    <ActionButton onClick={this.onUpdateDelay} text="Update&nbsp;delay" icon="timer" disabled={isUpdatingDelay} loading={isUpdatingDelay} />
                  )
                }
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}
