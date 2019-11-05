/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react/dist/commonjs';
import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class EditDelay extends Component {
  static propTypes = {
    delay: PropTypes.object,
    alertActions: PropTypes.object,
    delayActions: PropTypes.object,
    EventHandler: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
    daysList: PropTypes.array,
    hoursList: PropTypes.array,
    minutesList: PropTypes.array,
    secondsList: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.onAddDelay = this.onAddDelay.bind(this);
    this.onUpdateDelay = this.onUpdateDelay.bind(this);
    this.onDaysChanged = this.onDaysChanged.bind(this);
    this.onHoursChanged = this.onHoursChanged.bind(this);
    this.onMinutesChanged = this.onMinutesChanged.bind(this);
    this.onSecondsChanged = this.onSecondsChanged.bind(this);
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    const { delay } = this.props;
    const transactionalSurveyDelay = delay.surveyMetadata.find((metadata) => metadata.name === 'transactionalSurveyDelay');

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
      isUpdating: false,
      days,
      hours,
      minutes,
      seconds,
      isAdding: false,
      transactionalSurveyDelay,
    };
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
    this.setState({ isAdding: true });
    const { delay } = this.props;
    const surveyId = delay.id;
    const {
      days, hours, minutes, seconds,
    } = this.state;
    const transactionalSurveyDelay = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);

    try {
      const {
        delayActions, alertActions, EventHandler, onCloseSidePanel, conversationActions, currentPage,
      } = this.props;
      await delayActions.addSurveyMetadata(surveyId, { name: 'transactionalSurveyDelay', value: transactionalSurveyDelay });
      EventHandler.trackEvent({ category: 'Delays', action: 'add delay', value: true });
      const fetchConversationsResult = await conversationActions.fetchConversations(currentPage, 'active');

      conversationActions.setConversations({
        items: fetchConversationsResult.data.Data.objects,
        page: currentPage,
        totalCount: fetchConversationsResult.data.Data.meta.totalCount,
      }, 'active');
      onCloseSidePanel();
      alertActions.addAlert({ type: 'success', message: 'The delay was added successfully' });
    } catch (exception) {
      const { alertActions, EventHandler } = this.props;
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
      EventHandler.trackEvent({ category: 'Delays', action: 'add delay', value: false });
    } finally {
      this.setState({ isAdding: false });
    }
  }

  async onUpdateDelay() {
    this.setState({ isUpdating: true });
    const { delay } = this.props;
    const surveyId = delay.id;
    const {
      days, hours, minutes, seconds,
    } = this.state;
    const transactionalSurveyDelay = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);

    try {
      const {
        delayActions, alertActions, EventHandler, onCloseSidePanel, conversationActions, currentPage,
      } = this.props;
      await delayActions.updateSurveyMetadata(surveyId, { metadata: { transactionalSurveyDelay }, surveyId });
      EventHandler.trackEvent({ category: 'Delays', action: 'update delay', value: true });
      const fetchConversationsResult = await conversationActions.fetchConversations(currentPage, 'active');

      conversationActions.setConversations({
        items: fetchConversationsResult.data.Data.objects,
        page: currentPage,
        totalCount: fetchConversationsResult.data.Data.meta.totalCount,
      }, 'active');
      onCloseSidePanel();
      alertActions.addAlert({ type: 'success', message: 'The delay was updated successfully' });
    } catch (exception) {
      const { alertActions, EventHandler } = this.props;
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
      EventHandler.trackEvent({ category: 'Delays', action: 'update delay', value: false });
    } finally {
      this.setState({ isUpdating: false });
    }
  }

  render() {
    const {
      delay,
      onCloseSidePanel,
      daysList,
      hoursList,
      minutesList,
      secondsList,
    } = this.props;
    const {
      isUpdating,
      isAdding,
      days,
      hours,
      minutes,
      seconds,
      transactionalSurveyDelay,
    } = this.state;
    const colorMix = stringToHexColor(delay.title);

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{ transactionalSurveyDelay ? 'Edit Delay' : 'Add Delay'}</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(delay.title)}</div>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{delay.title}</span>
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <Dropdown inline options={daysList} scrolling value={days} onChange={this.onDaysChanged} />
              {' '}
              days
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <Dropdown inline options={hoursList} scrolling value={hours} onChange={this.onHoursChanged} />
              {' '}
              hours
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <Dropdown inline options={minutesList} scrolling value={minutes} onChange={this.onMinutesChanged} />
              {' '}
              minutes
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <Dropdown inline options={secondsList} scrolling value={seconds} onChange={this.onSecondsChanged} />
              {' '}
              seconds
            </div>
          </div>

        </div>
        {
          transactionalSurveyDelay
            ? (
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
                <ActionButton className="primary" type="submit" large text="Update delay" disabled={isUpdating} loading={isUpdating} onClick={this.onUpdateDelay} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
              </div>
            ) : (
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
                <ActionButton className="primary" type="submit" large text="Add delay" disabled={isAdding} loading={isAdding} onClick={this.onAddDelay} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
              </div>
            )}
      </div>
    );
  }
}
