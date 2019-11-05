/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class ViewConversation extends Component {
  static propTypes = {
    conversation: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  state = {
    mouseOver: null,
  }

  onMouseEnter(row) {
    this.setState({ mouseOver: row });
  }

  onMouseLeave() {
    this.setState({ mouseOver: null });
  }

  render() {
    const { mouseOver } = this.state;
    const { conversation, onCloseSidePanel } = this.props;
    const colorMix = stringToHexColor(conversation.title);
    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Survey Reminder Details</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottom: '1px solid #6d6e71' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(conversation.title)}</div>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{conversation.title}</span>
            </div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('text')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'text' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Reminder Text</div>
            <div>{conversation.reminderSettings.text}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('time')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'time' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Reminder Time</div>
            {
              conversation.reminderSettings.recurring ? (
                <div>
                  {moment(conversation.reminderSettings.time[0]).format('dddd, MMMM Do YYYY')}
                  &nbsp;-&nbsp;
                  {moment(conversation.reminderSettings.time[conversation.reminderSettings.time.length - 1]).format('dddd, MMMM Do YYYY')}
                  &nbsp;at&nbsp;
                  {`${moment.utc(conversation.reminderSettings.time[0]).local().format('HH')}:00`}
                </div>
              ) : (
                <div>
                  {conversation.reminderSettings.time ? moment(conversation.reminderSettings.time[0]).format('dddd, MMMM Do YYYY') : null}
                  {conversation.reminderSettings.time ? ' at '.concat(moment.utc(conversation.reminderSettings.time[0]).local().format('HH')).concat(':00') : null}
                </div>
              )
            }
          </div>
          <div onMouseEnter={() => this.onMouseEnter('scheduleType')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'scheduleType' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Schedule Type</div>
            <div>{conversation.reminderSettings.sendNow ? 'IMMEDIATELY' : 'RECURRING'}</div>
          </div>
          {
            conversation.reminderSettings.recurring ? (
              <div onMouseEnter={() => this.onMouseEnter('interval')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'interval' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                <div style={{ margin: '0 10px' }}>Reminder Interval</div>
                <div style={{ textTransform: 'capitalize' }}>{conversation.reminderSettings.interval}</div>
              </div>
            ) : null
          }
        </div>
      </div>
    );
  }
}
