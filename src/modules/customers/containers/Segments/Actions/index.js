import React, { Component } from 'react';

import SendSMS from './SendSMS';
import SendEmail from './SendEmail';
import DownloadSegmentMembers from './DownloadSegmentMembers';

export default class Actions extends Component {
  state = {};

  render() {
    return (
      <div style={{ margin: '0 0 15px 0', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderTop: 'solid 1px #d9d9d9', paddingTop: 10 }}>
        <SendSMS />
        {/* <SendEmail /> */}
        {/* <DownloadSegmentMembers /> */}
      </div>
    );
  }
}
