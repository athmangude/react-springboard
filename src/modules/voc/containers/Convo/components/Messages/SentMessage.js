import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import MwambaInitialsCircle from 'Utils/mwamba-initials-circle';
import { extractInitials } from 'Utils/UtilFunctions';

const SentMessage = ({ message }) => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end', width: '100%', paddingRight: 20 }}>
    <div style={{ maxWidth: 'calc(80% - 50px)', margin: '5px 10px 5px 0', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', borderRadius: '10px 0 10px 10px', backgroundColor: '#e2e2e2' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', fontSize: 12, fontWeight: 'bold', letterSpacing: 0.6, textAlign: 'right', color: '#58595b', width: '100%' }}>
        <div>{message.user.firstName} {message.user.lastName}</div>
        <div style={{ fontSize: 11, fontWeight: 'normal', width: 55 }}>{moment(message.createDate).format('h:mm a')}</div>
      </div>
      <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#58595b', paddingTop: 5 }}>{unescape(message.body.replace(/(\+)/g, ' '))}</div>
    </div>
    <MwambaInitialsCircle initials={extractInitials(`${message.user.firstName} ${message.user.lastName}`)} backgroundColor="#20ab9c" />
  </div>
  );

SentMessage.propTypes = {
  message: PropTypes.object,
};

export default SentMessage;
