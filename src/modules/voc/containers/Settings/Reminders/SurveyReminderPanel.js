/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable object-curly-newline */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import Textarea from 'react-expanding-textarea';
import { Form } from 'formsy-semantic-ui-react';
import moment from 'moment';
import ActionButton from 'SharedComponents/action-button';
import IconButton from 'SharedComponents/icon-button';
import MwambaDropDownSelect from 'SharedComponents/mwamba-dropdown-select';
import SendLater from '../../Conversations/components/survey/segments/schedule/SendLater';
import Recurring from '../../Conversations/components/survey/segments/schedule/Recurring';

const reminderTexts = [
  { label: 'We notice that you have not yet completed your survey. Your feedback is important to us. Please reply to the message below to proceed with the survey.', value: '0' },
  { label: 'Add custom reminder text.', value: '1' },
];

export default class SurveyReminderPanel extends Component {
  static propTypes = {
    conversation: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    surveyReminderActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    const { conversation } = this.props;
    this.onTimeChanged = this.onTimeChanged.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onToggleExpanded = this.onToggleExpanded.bind(this);
    this.onAddReminder = this.onAddReminder.bind(this);
    this.onUpdateReminder = this.onUpdateReminder.bind(this);
    this.onDeleteReminder = this.onDeleteReminder.bind(this);
    this.onReminderTextChanged = this.onReminderTextChanged.bind(this);
    this.onScheduleTypeChanged = this.onScheduleTypeChanged.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleReminder = this.toggleReminder.bind(this);
    this.state = {
      timeOfDay: conversation.reminderTime ? conversation.reminderTime : null,
      reminderText: conversation.reminderSettings.text ? conversation.reminderSettings.text : '',
      isAddingReminder: false,
      isUpdatingReminder: false,
      isDeletingReminder: false,
      isExpanded: false,
      selectedReminderTextValue: '',
      showCustomReminderTextInput: false,
      activeScheduleType: 'IMMEDIATELY',
      scheduleTypes: [
        { scheduleType: 'IMMEDIATELY', text: 'Send Now', description: '' },
        { scheduleType: 'LATER', text: 'Send Later', description: '' },
        { scheduleType: 'RECURRING', text: 'Recurring', description: '' },
      ],
      selectedDates: null,
      interval: null,
      reminderSet: false,
    };
  }

  componentDidMount() {
    this.reminders();
  }

  onTimeChanged(e, { value }) {
    this.setState({ timeOfDay: value });
  }

  onTextChange(event) {
    this.setState({ reminderText: event.target.value });
  }

  async onAddReminder() {
    // TODO: format the time to UTC newLaterDate.utc().format()
    this.setState({ isAddingReminder: true });

    const {
      surveyReminderActions,
      alertActions,
      EventHandler,
      conversation,
      fetchActiveConversations,
    } = this.props;
    const { reminderText, timeOfDay, activeScheduleType, interval } = this.state;

    try {
      await surveyReminderActions.addSurveyReminder(conversation.id, { reminder: { text: reminderText, time: timeOfDay, recurring: (activeScheduleType === 'RECURRING'), sendNow: (activeScheduleType === 'IMMEDIATELY'), interval } });
      this.createDatesArray(timeOfDay || moment.now());
      this.setState({ selectedReminderTextValue: '', showCustomReminderTextInput: false });
      alertActions.addAlert({ type: 'success', message: 'The reminder was added successfully' });
      EventHandler.trackEvent({ category: 'Reminders', action: 'add reminder', value: true });
      fetchActiveConversations();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
      EventHandler.trackEvent({ category: 'Reminders', action: 'add reminder', value: false });
    } finally {
      this.setState({ isAddingReminder: false });
    }
  }

  async onUpdateReminder() {
    // TODO: format the time to UTC newLaterDate.utc().format()
    this.setState({ isUpdatingReminder: true });

    const {
      surveyReminderActions,
      alertActions,
      EventHandler,
      conversation,
      fetchActiveConversations,
    } = this.props;
    const { reminderText, timeOfDay, activeScheduleType, interval } = this.state;

    try {
      await surveyReminderActions.updateSurveyReminder(conversation.id, { reminder: { text: reminderText, time: timeOfDay, recurring: (activeScheduleType === 'RECURRING'), sendNow: (activeScheduleType === 'IMMEDIATELY'), interval } });
      this.createDatesArray(timeOfDay || moment.now());
      this.setState({ selectedReminderTextValue: '', showCustomReminderTextInput: false });
      alertActions.addAlert({ type: 'success', message: 'The reminder was updated successfully' });
      EventHandler.trackEvent({ category: 'Reminders', action: 'update reminder', value: true });
      fetchActiveConversations();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
      EventHandler.trackEvent({ category: 'Reminders', action: 'update reminder', value: false });
    } finally {
      this.setState({ isUpdatingReminder: false });
    }
  }

  async onDeleteReminder() {
    this.setState({ isDeletingReminder: true });

    const {
      surveyReminderActions,
      alertActions,
      EventHandler,
      conversation,
      fetchActiveConversations,
    } = this.props;
    try {
      await surveyReminderActions.deleteSurveyReminder(conversation.id);
      this.setState({ reminderText: '', selectedReminderTextValue: null, showCustomReminderTextInput: false });
      alertActions.addAlert({ type: 'success', message: 'The reminder was deleted successfully' });
      EventHandler.trackEvent({ category: 'Reminders', action: 'delete reminder', value: true });
      fetchActiveConversations();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
      EventHandler.trackEvent({ category: 'Reminders', action: 'delete reminder', value: false });
    } finally {
      this.setState({ isDeletingReminder: false });
    }
  }

  onToggleExpanded() {
    const { isExpanded } = this.state;

    this.setState({
      isExpanded: !isExpanded,
    });
  }

  onReminderTextChanged(selectedReminder) {
    this.setState({ selectedReminderTextValue: selectedReminder.value });
    // eslint-disable-next-line no-unused-expressions
    selectedReminder.label === 'Add custom reminder text.' ? this.setState({ showCustomReminderTextInput: true, reminderText: '' }) : this.setState({ showCustomReminderTextInput: false, reminderText: selectedReminder.label });
  }

  onScheduleTypeChanged(selectScheduleType) {
    this.setState({ activeScheduleType: selectScheduleType });
  }

  onChange(event, { value, interval }) {
    this.setState({ timeOfDay: value, interval });
  }

  toggleReminder() {
    const { reminderSet } = this.state;

    this.setState({ reminderSet: !reminderSet });
  }

  reminders() {
    const { conversation } = this.props;

    if (conversation.reminderSettings.text != null) {
      const selectedReminder = reminderTexts.find((reminder) => reminder.label === conversation.reminderSettings.text);

      if (selectedReminder) {
        this.setState({ selectedReminderTextValue: selectedReminder.value });
      } else {
        this.setState({ showCustomReminderTextInput: true });
      }
    }

    if (conversation.reminderSettings.sendNow && conversation.reminderSettings.text != null) this.setState({ activeScheduleType: 'IMMEDIATELY', reminderSet: true });

    if (conversation.reminderSettings.recurring && conversation.reminderSettings.text != null) this.setState({ activeScheduleType: 'RECURRING', reminderSet: true });

    if (!conversation.reminderSettings.recurring && !conversation.reminderSettings.sendNow && conversation.reminderSettings.text != null) this.setState({ activeScheduleType: 'LATER', reminderSet: true });

    if (conversation.reminderSettings.time) {
      this.createDatesArray(conversation.reminderSettings.time);
    }
  }

  createDatesArray(selectedDates) {
    const dates = [];

    for (let i = 0; i < selectedDates.length; i += 1) {
      dates.push(moment(selectedDates[i]));
    }

    this.setState({ selectedDates: dates });
  }

  createReminder() {
    const { selectedReminderTextValue, reminderText, isDeletingReminder, isAddingReminder, isUpdatingReminder, showCustomReminderTextInput, scheduleTypes, activeScheduleType, selectedDates } = this.state;
    const { conversation } = this.props;

    return (
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', flexWrap: 'wrap' }}>
        <div style={{ width: '100%', padding: 3 }}>
          <span style={{ color: '#808285' }}>Set reminder text that will go out</span>
        </div>
        <div style={{ width: '100%' }}>

          <MwambaDropDownSelect style={{ width: '100%' }} value={selectedReminderTextValue} options={reminderTexts} onChange={this.onReminderTextChanged} placeholder="Select a reminder text" />
          {
            showCustomReminderTextInput ? (
              <Textarea
                value={reminderText}
                name="text"
                onChange={this.onTextChange}
                // style={{ border: 'solid 1px #d9d9dd9', borderRadius: 0, padding: '15px 15px', margin: 0, backgroundColor: !this.props.isCommenting ? '#fff' : '#fafafa', overflow: 'hidden', resize: 'none', minHeight: 30, width: 'calc(100% - 10px)', color: '#6d6e71' }}
                className="hide-scrollbars"
                style={{ border: 'solid 2px #d9d9dd9', padding: 15, resize: 'none', boxShadow: '0 0 0 2px #d9d9d9', width: '100%', borderRadius: 3, outline: 'none' }}
                placeholder="type the reminder text"
                rows={3}
              >
              </Textarea>
            ) : null
          }
          {
            reminderText.length > 139 ? (
              <small style={{ color: reminderText.length > 160 ? 'red' : 'orange' }}>
                { 160 - reminderText.length }
                characters left
              </small>
            ) : null
          }
        </div>

        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', flexWrap: 'wrap' }}>
          <div style={{ width: '100%', padding: '3px 0px 10px' }}>
            <span style={{ color: '#808285' }}>Select time when the reminder will be sent</span>
          </div>
          {
            scheduleTypes.map((option) => (
              <Button
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: option.scheduleType === activeScheduleType ? '#002366' : '#d9d9d9', color: option.scheduleType === activeScheduleType ? '#fff' : '#808285', flexGrow: 1, padding: 20, margin: '0px 0px', borderRadius: 0, border: 'solid 1px #fff' }}
                onClick={() => this.onScheduleTypeChanged(option.scheduleType)}
                className={option.scheduleType === activeScheduleType ? 'active' : ''}
              >
                {/* <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px 10px 0' }}>
                  <i className="material-icons" style={{ margin: 'auto 10px auto 0', fontSize: 40 }}>{option.icon}</i>
                </div> */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <b>{ option.text}</b>
                  <span style={{ fontSize: 10, fontWeight: 'lighter' }}>{ option.description }</span>
                </div>
              </Button>
            ))
          }
        </div>

        <div className="scheduleType-options" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0 30px' }}>
          <Form>
            {(activeScheduleType === 'LATER') ? <SendLater onChange={this.onChange} form={{ runTime: (selectedDates) || null }} /> : (activeScheduleType === 'RECURRING') ? <Recurring onChange={this.onChange} form={{ runTime: (selectedDates) || null, mode: (conversation.reminderSettings.interval) ? conversation.reminderSettings.interval : null }} /> : 'The reminder will be sent immediately.'}
          </Form>
        </div>

        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {
            conversation.reminderSettings.text ? (
              <ActionButton onClick={this.onDeleteReminder} text="Delete&nbsp;reminder" icon="delete" disabled={isDeletingReminder} loading={isDeletingReminder} />
            ) : null
          }
          {
            !conversation.reminderSettings.text ? (
              <ActionButton onClick={this.onAddReminder} text="Add&nbsp;reminder" icon="add_alert" disabled={!reminderText.length || isAddingReminder} loading={isAddingReminder} />
            ) : (
              <ActionButton onClick={this.onUpdateReminder} text="Update&nbsp;reminder" icon="add_alert" disabled={!reminderText.length || isUpdatingReminder} loading={isUpdatingReminder} />
            )
          }
        </div>
      </div>
    );
  }

  showSetReminder() {
    const { activeScheduleType, selectedDates } = this.state;
    const { conversation } = this.props;

    let message = null;
    let buttonText = null;
    const time = (activeScheduleType !== 'IMMEDIATELY') ? `${moment.utc(selectedDates[0]).local().format('HH')}:00` : null;

    if (activeScheduleType === 'IMMEDIATELY') {
      message = 'The reminder has been sent out';

      buttonText = 'New reminder';
    }

    if (activeScheduleType === 'LATER') {
      if (moment.now() > selectedDates[0]) {
        const last = moment(selectedDates[0]).format('dddd, MMMM Do YYYY');

        message = `The reminder was sent on ${last} at ${time}, click new reminder to set a new one`;
        buttonText = 'New reminder';
      } else {
        message = `The reminder has been scheduled to run on ${moment(selectedDates[0]).format('dddd, MMMM Do YYYY')} at ${time}`;
        buttonText = 'Update reminder';
      }
    }

    if (activeScheduleType === 'RECURRING') {
      const arrayLength = selectedDates.length;

      if (moment.now() > selectedDates[arrayLength - 1]) {
        buttonText = 'New reminder';
      } else {
        buttonText = 'Update reminder';
      }

      if (moment.now() > selectedDates[arrayLength - 1]) {
        const last = moment(selectedDates[arrayLength - 1]).format('dddd, MMMM Do YYYY');

        message = `The last reminder was sent on ${last} at ${time}, click new reminder to set a new one`;
      } else if (conversation.reminderSettings.interval === 'daily') {
        const from = moment(selectedDates[0]).format('dddd, MMMM Do YYYY');

        if (selectedDates.length > 1) {
          const to = moment(selectedDates[arrayLength - 1]).format('dddd, MMMM Do YYYY');

          message = `The reminder has been scheduled to run daily from ${from} to ${to} at ${time}`;
        } else {
          message = `The reminder has been scheduled to run on ${from} at ${time}`;
        }
      } else if (conversation.reminderSettings.interval === 'weekly') {
        const from = moment(selectedDates[0]).format('MMMM Do YYYY');

        if (selectedDates.length > 1) {
          const to = moment(selectedDates[arrayLength - 1]).format('MMMM Do YYYY');

          message = `The reminder has been scheduled to run weekly every ${moment(selectedDates[0]).format('dddd')} from ${from} to ${to} at ${time}`;
        } else {
          message = `The reminder has been scheduled to run on ${from} at ${time}`;
        }
      } else if (conversation.reminderSettings.interval === 'monthly') {
        const from = moment(selectedDates[0]).format('MMMM Do YYYY');

        if (selectedDates.length > 1) {
          const to = moment(selectedDates[arrayLength - 1]).format('MMMM Do YYYY');
          message = `The reminder has been scheduled to run monthly every ${moment(selectedDates[0]).format('Do')}  of the month from ${from} to ${to} at ${time}`;
        } else {
          message = `The reminder has been scheduled to run on ${from} at ${time}`;
        }
      }
    }

    return (
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', flexWrap: 'wrap' }}>
        <div style={{ width: '100%', padding: 3, textAlign: 'center' }}>
          <span style={{ color: '#808285' }}>{ message }</span>
        </div>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ActionButton onClick={this.toggleReminder} text={buttonText} icon="add_alert" />
        </div>
      </div>
    );
  }

  render() {
    const { isExpanded, reminderSet } = this.state;
    const { conversation } = this.props;

    return (
      <div style={{ width: '100%' }}>
        {
          conversation.reminderSettings.text !== null ? (
            <div style={{ backgroundColor: '#46b39d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '-10px -10px 0 -10px', borderTopRightRadius: 8, borderTopLeftRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="material-icons" style={{ color: '#FFF', marginRight: 10, alignSelf: 'flex-start', margin: '5px 5px' }}>notifications</i>
                <span style={{ color: '#fff' }}>{conversation.reminderSettings.text}</span>
              </div>
            </div>
          ) : null
        }
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {conversation.title}
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
                { (reminderSet) ? this.showSetReminder() : this.createReminder() }
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}
