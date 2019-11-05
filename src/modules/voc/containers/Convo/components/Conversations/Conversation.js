import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import LinesEllipsis from 'react-lines-ellipsis';

import MwambaInitialsCircle from 'Utils/mwamba-initials-circle';


export default class Conversation extends Component {
  static propTypes = {
    conversation: PropTypes.object.isRequired,
    activeConversationId: PropTypes.string,
    clickConversationHandler: PropTypes.func,
  };

  constructor(props) {
    super(props);

    if (parseInt(props.activeConversationId, 10) === props.conversation.participant.id) {
      props.clickConversationHandler(props.conversation.participant); 
    }
  }

  render() {
    const { conversation: { participant, message, unreadMessagesCount }, activeConversationId, clickConversationHandler } = this.props;
    let backgroundColor = '#f26b50';
    if (message.npsScore > 8) {
      backgroundColor = '#20ab9c';
    } else if (message.npsScore > 6) {
      backgroundColor = '#ffac28';
    }

    const active = parseInt(activeConversationId, 10) === participant.id ? 'active' : null;
    let initials = participant.commId.substring(10, 13);
    if (participant.name.trim()) {
      const matches = participant.name.match(/\b(\w)/g);
      initials = matches.join('').toUpperCase();
    }

    let time = moment(message.createDate);
    if (moment().diff(time, 'seconds') < 60) {
      time = 'Just now';
    } else if (moment().diff(time, 'minutes') < 60) {
      time = time.fromNow();
    } else {
      time = time.format('h:hh A').toString();
    }

    return (
      <Link to={`/live-chat/${participant.id}`} onClick={() => { clickConversationHandler(participant); }}>
        <div style={{ backgroundColor: active ? '#24415A' : 'inherit', boxShadow: active ? '-1px 1px 1px 0 rgba(0, 0, 0, 0.1)' : 'none', minHeight: 50, display: 'flex', alignItems: 'center', width: '100%', padding: '0 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', margin: '10px 0', width: '100%' }}>
            <MwambaInitialsCircle initials={initials} backgroundColor={backgroundColor} />
            <div style={{ width: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '0 20px' }}>
              <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>SMS</div>
              <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>{participant.name.trim() ? participant.name : participant.commId}</div>
                <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 300, fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>{time}</div>
              </div>
              <div style={{ fontFamily: 'Lato', fontSize: 11, fontWeight: 300, fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>
                <LinesEllipsis text={unescape(message.body.replace(/(\+)/g, ' '))} maxLine="2" ellipsis="..." trimRight basedOn="words" />
              </div>
            </div>
            <div style={{ width: 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              {
                unreadMessagesCount > 0 ? (
                  <div style={{ width: 20, height: 20, backgroundColor: active ? backgroundColor : '#487db3', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', border: active ? 'none' : '1px solid #fff' }}>
                    <span style={{ height: 12, fontFamily: 'Lato', fontSize: 10, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>{unreadMessagesCount}</span>
                  </div>
                ) : (<i className="material-icons" style={{ width: 20, height: 15.3, color: '#ffffff' }}>check</i>)
              }
            </div>
          </div>
        </div>
      </Link>
    );
  }
}
