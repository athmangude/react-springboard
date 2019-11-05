/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import MwambaSelect from 'SharedComponents/mwamba-dropdown-select';
import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map((time) => ({ label: time, value: `${time}:00` }));

export default class TriggerReinvite extends Component {
  static propTypes = {
    conversation: PropTypes.object,
    currentPage: PropTypes.number,
    alertActions: PropTypes.object,
    conversationActions: PropTypes.object,
    surveyReinviteActions: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { conversation } = props;

    const date = conversation.reinviteSettings ? moment.utc(conversation.reinviteSettings.date).local() : null;

    this.state = {
      isTriggeringReinvite: false,
      reinviteTime: date ? date.clone().format('HH:mm:ss') : times[10].value,
      reinviteDate: date ? date.clone().format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
    };

    this.onTimeChanged = this.onTimeChanged.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
    this.onTriggerReinvite = this.onTriggerReinvite.bind(this);
  }

  onTimeChanged(change) {
    this.setState({ reinviteTime: change.value });
  }

  onSelectDate(date) {
    this.setState({ reinviteDate: moment(date).format('YYYY-MM-DD') });
  }

  async onTriggerReinvite() {
    this.setState({ isTriggeringReinvite: true });
    const { reinviteTime, reinviteDate } = this.state;
    const { conversationActions, surveyReinviteActions, currentPage, conversation, alertActions, onCloseSidePanel } = this.props;
    const payload = {
      reminderTime: `${moment(`${reinviteDate} ${reinviteTime}`).utc().format('YYYY-MM-DDTHH:mm:ss')}`,
      surveyId: conversation.id
    };
    try {
      await surveyReinviteActions.triggerSurveyReinvite(conversation.id, payload);
      alertActions.addAlert({ type: 'success', message: 'Successfully updated survey reinvite' });
      const fetchConversationsResult = await conversationActions.fetchConversations(currentPage, 'active');
      conversationActions.setConversations({
        items: fetchConversationsResult.data.Data.objects,
        page: currentPage,
        totalCount: fetchConversationsResult.data.Data.meta.totalCount,
      }, 'active');
      onCloseSidePanel();
    } catch (exception) {
      onCloseSidePanel();
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isTriggeringReinvite: false });      
    }  
  }

  render() {
    const { conversation, onCloseSidePanel } = this.props;
    const { isTriggeringReinvite, reinviteTime, reinviteDate } = this.state;
    const colorMix = stringToHexColor(conversation.title);

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Add Survey Reinvite</h2>
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
              <p>Reinvite Date</p>
              <DayPickerInput
                placeholder="Select reinvite date"
                value={reinviteDate}
                onDayChange={this.onSelectDate}
                dayPickerProps={{
                  disabledDays: {
                    before: moment().toDate(),
                  },
                }}
                style={{ width: '100%', height: 33, borderBottom: '2px solid rgb(128, 130, 133)' }}
              />
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <p>Reinvite Time</p>
              <MwambaSelect options={times} value={reinviteTime} onChange={this.onTimeChanged} style={{ width: '100%', menu: { height: 200, overflowY: 'auto', display: '' }, container: { width: 70 } }} />
            </div>
          </div>
        </div>

        <div style={{ padding: 10, top: 'calc(100% - 10px)', width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
            <ActionButton className="primary" type="submit" large icon="add" text="Trigger Reinvite" disabled={isTriggeringReinvite} loading={isTriggeringReinvite} onClick={this.onTriggerReinvite} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>
      </div>
    );
  }
}
