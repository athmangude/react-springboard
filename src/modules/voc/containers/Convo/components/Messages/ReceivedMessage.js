import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import MwambaInitialsCircle from 'Utils/mwamba-initials-circle';

const ReceivedMessage = ({ message, activeParticipant, initials }) => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', paddingLeft: 20 }}>
    <MwambaInitialsCircle initials={initials} backgroundColor="#20ab9c" />
    <div style={{ maxWidth: 'calc(85% - 50px)', margin: '5px 0 5px 10px', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', borderRadius: '0 10px 10px 10px', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', fontSize: 12, fontWeight: 'bold', letterSpacing: 0.6, textAlign: 'left', color: '#58595b', width: '100%' }}>
        <div>{activeParticipant.name.trim() ? activeParticipant.name : activeParticipant.commId}</div>
        <div style={{ fontSize: 11, fontWeight: 'normal', width: 55, textAlign: 'right' }}>{moment(message.createDate).format('h:mm a')}</div>
      </div>
      <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#58595b', paddingTop: 5 }}>{unescape(message.body.replace(/(\+)/g, ' '))}</div>
    </div>
  </div>
);

ReceivedMessage.propTypes = {
  message: PropTypes.object,
  activeParticipant: PropTypes.object,
  initials: PropTypes.string,
};

export default ReceivedMessage;
