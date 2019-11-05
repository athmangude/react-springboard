import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import 'react-day-picker/lib/style.css';
import '../../Conversations/components/survey/segments/schedule/SendLater';

import ActionButton from 'SharedComponents/action-button';
import MwambaSelect from 'SharedComponents/mwamba-dropdown-select';
import './SurveyReinvitePanel.css';

const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map((time) => ({ label: time, value: `${time}:00` }));

export default class SurveyReminderPanel extends Component {
  static propTypes = {
    conversation: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    surveyReinvitesActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onTriggerReinvite = this.onTriggerReinvite.bind(this);
    this.onTimeChanged = this.onTimeChanged.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
  }

  state = {
    isTriggeringReinvite: false,
    reminderTime: this.props.conversation.reinviteTime ? this.props.conversation.reinviteTime : times[10].value,
    reminderDate: moment().format('YYYY-MM-DD'),
  }

  onTimeChanged(change) {
    this.setState({ reminderTime: change.value });
  }

  async onTriggerReinvite() {
    this.setState({ isTriggeringReinvite: true });

    try {
      await this.props.surveyReinvitesActions.triggerSurveyReinvite(this.props.conversation.id, { reminderTime: `${moment(`${this.state.reminderDate} ${this.state.reminderTime}`).utc().format()}`, surveyId: this.props.conversation.id });
      this.props.alertActions.addAlert({ type: 'success', message: 'The reminder was updated successfully' });
      this.props.EventHandler.trackEvent({ category: 'Surveys', action: 'update reminder', value: true });
      this.props.fetchActiveConversations();
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.handleException(exception);
      this.props.EventHandler.trackEvent({ category: 'Surveys', action: 'trigger reinvite', value: false });
    } finally {
      this.setState({ isTriggeringReinvite: false });
    }
  }

  onSelectDate(date) {
    this.setState({ reminderDate: moment(date).format('YYYY-MM-DD') });
  }

  render() {
    return (
      <div className="reinvite-panel" style={{ width: '100%' }}>
        {
          this.props.conversation.reminderText !== null ? (
            <div style={{ backgroundColor: '#46b39d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '-10px -10px 0 -10px', borderTopRightRadius: 8, borderTopLeftRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="material-icons" style={{ color: '#FFF', marginRight: 10, alignSelf: 'flex-start', margin: '5px 5px' }}>notifications</i>
                <span style={{ color: '#fff' }}>{this.props.conversation.reminderText}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: 10, alignSelf: 'baseline' }}>
                <i className="material-icons" style={{ color: '#FFF', marginRight: 10, alignSelf: 'flex-start' }}>access_time</i>
                <span style={{ color: '#fff' }}>{this.props.conversation.reminderTime}hrs</span>
              </div>
            </div>
          ) : null
        }
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {this.props.conversation.title}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
            <DayPickerInput
              placeholder={this.state.reminderDate}
              value={this.state.reminderDate}
              onDayChange={this.onSelectDate}
              dayPickerProps={{
                disabledDays: {
                  before: moment().toDate(),
                },
              }}
              style={{ margin: 10, width: 137, height: 33, border: 'solid 1px #d9d9d9' }}
            />
            <MwambaSelect options={times} value={this.state.reminderTime} onChange={this.onTimeChanged} style={{ width: 100, menu: { height: 200, overflowY: 'auto', display: '' }, container: { width: 70 } }} />
            <ActionButton text="Trigger&nbsp;Reinvite" icon="announcement" onClick={this.onTriggerReinvite} disabled={this.state.isTriggeringReinvite} loading={this.state.isTriggeringReinvite} style={{ margin: '0 10px' }} />
          </div>
        </div>
      </div>
    );
  }
}
