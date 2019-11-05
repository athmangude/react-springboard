/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SendLater from 'Modules/voc/containers/Conversations/components/survey/segments/schedule/SendLater';
import Recurring from 'Modules/voc/containers/Conversations/components/survey/segments/schedule/Recurring';
import MwambaDropDownSelect from 'SharedComponents/mwamba-dropdown-select';
import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

const reminderTexts = [
  { label: 'We notice that you have not yet completed your survey. Your feedback is important to us. Please reply to the message below to proceed with the survey.', value: 1 },
  { label: 'Add custom reminder text.', value: 2 },
];
const scheduleTypes = [
  { scheduleType: 'IMMEDIATELY', text: 'Send Now', description: '' },
  { scheduleType: 'LATER', text: 'Send Later', description: '' },
  { scheduleType: 'RECURRING', text: 'Recurring', description: '' },
];

export default class AddConversation extends Component {
  static propTypes = {
    conversation: PropTypes.object,
    currentPage: PropTypes.number,
    alertActions: PropTypes.object,
    conversationActions: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      isAdding: false,
      payload: {
        reminder: {
          time: [],
          text: '',
          recurring: false,
          sendNow: true,
          interval: null,
        },
      },
      selectedReminderTextValue: null,
      activeScheduleType: 'IMMEDIATELY',
      selectedDates: [],
      mouseOver: null,
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onScheduleTypeChanged = this.onScheduleTypeChanged.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeCustomReminder = this.onChangeCustomReminder.bind(this);
    this.onReminderTextChanged = this.onReminderTextChanged.bind(this);
  }

  onMouseEnter(column) {
    this.setState({ mouseOver: column });
  }

  onMouseLeave() {
    this.setState({ mouseOver: null });
  }

  onScheduleTypeChanged(selectScheduleType) {
    const { payload } = this.state;
    const recurring = selectScheduleType === 'RECURRING';
    const sendNow = selectScheduleType === 'IMMEDIATELY';
    this.setState({ activeScheduleType: selectScheduleType, payload: { reminder: { ...payload.reminder, recurring, sendNow } } });
  }

  onChange(event, { value, interval }) {
    const { payload } = this.state;
    this.setState({ payload: { reminder: { ...payload.reminder, time: value, interval } } });
  }

  onChangeCustomReminder(e) {
    const { payload } = this.state;
    this.setState({ payload: { reminder: { ...payload.reminder, [e.target.name]: e.target.value } } });
  }

  onReminderTextChanged(selectedReminder) {
    const { payload } = this.state;
    const showCustomReminderTextInput = selectedReminder.value === 2;
    const text = selectedReminder.value === 2 ? '' : selectedReminder.label;
    this.setState({ selectedReminderTextValue: selectedReminder.value, showCustomReminderTextInput, payload: { reminder: { ...payload.reminder, text } } });
  }

  async onAdd() {
    this.setState({ isAdding: true });
    const { payload } = this.state;
    const { conversationActions, surveyReminderActions, currentPage, conversation, alertActions, onCloseSidePanel } = this.props;

    try {
      await surveyReminderActions.addSurveyReminder(conversation.id, payload);
      alertActions.addAlert({ type: 'success', message: 'Successfully updated survey reminder' });
      const fetchConversationsResult = await conversationActions.fetchConversations(currentPage, 'active');
      conversationActions.setConversations({
        items: fetchConversationsResult.data.Data.objects,
        page: currentPage,
        totalCount: fetchConversationsResult.data.Data.meta.totalCount,
      }, 'active');
      onCloseSidePanel();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isAdding: false });      
    }  
  }

  render() {
    const { conversation, onCloseSidePanel } = this.props;
    const { isAdding, payload, selectedReminderTextValue, showCustomReminderTextInput, mouseOver, activeScheduleType, selectedDates } = this.state;
    const colorMix = stringToHexColor(conversation.title);

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Add Survey Reminder</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(conversation.title)}</div>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{conversation.title}</span>
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <p>Reminder Text</p>
              <MwambaDropDownSelect style={{ width: '100%' }} value={selectedReminderTextValue} options={reminderTexts} onChange={this.onReminderTextChanged} placeholder="Select a reminder text" />
              {
                showCustomReminderTextInput ? (
                  <input type="text" name="text" className="hide-active-border" placeholder="Type the reminder text" value={payload.reminder.text} onChange={this.onChangeCustomReminder} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid rgba(191, 42, 43, 100)', padding: '10px 5px', width: '100%' }} />
                ) : null
              }
              {
                payload.reminder.text.length > 139 ? (
                  <small style={{ color: payload.reminder.text.length > 160 ? 'red' : 'orange' }}>
                    { 160 - payload.reminder.text.length }
                    &nbsp;characters left
                  </small>
                ) : null
              }
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <p>Reminder Time</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {
                  scheduleTypes.map((option) => (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: option.scheduleType === activeScheduleType ? '#487db3' : '#d9d9d9', color: option.scheduleType === activeScheduleType ? '#fff' : '#808285', flexGrow: 1, padding: 20, margin: '0px 0px', borderRadius: 0, border: 'solid 1px #fff', cursor: 'pointer' }} onClick={() => this.onScheduleTypeChanged(option.scheduleType)} className={option.scheduleType === activeScheduleType ? 'active' : ''}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <div>{option.text}</div>
                        <div style={{ fontSize: 10, fontWeight: 'lighter' }}>{ option.description }</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <p>Schedule Options</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', margin: '10px 0 30px' }}>
                {
                  activeScheduleType === 'LATER' ? (
                    <SendLater onChange={this.onChange} form={{ runTime: (selectedDates) || null }} />
                  ) : activeScheduleType === 'RECURRING' ? (
                    <Recurring onChange={this.onChange} form={{ runTime: (selectedDates) || null, mode: null }} />
                  ) : 'The reminder will be sent immediately.'
                }
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: 10, top: 'calc(100% - 10px)', width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
            <ActionButton className="primary" type="submit" large icon="add" text="Update" disabled={isAdding} loading={isAdding} onClick={this.onAdd} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>
      </div>
    );
  }
}
