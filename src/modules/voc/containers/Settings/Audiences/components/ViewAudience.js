/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import moment from 'moment';

import Download from './Download';
import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

const ViewAudience = ({ audience, onCloseSidePanel, selectedTab, EventHandler, alertActions, audiencesActions }) => {
  const colorMix = stringToHexColor(audience.panelName);
  return (
    <div style={{ width: '100%', backgroundColor: '#fff' }}>
      <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
        <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Audience Details</h2>
        <IconButton icon="close" onClick={onCloseSidePanel} />
      </div>
      <div style={{ padding: '0 10px 0 10px' }}>
        <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottom: '1px solid #6d6e71' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
            <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(audience.panelName)}</div>
            <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{audience.panelName}</span>
          </div>
        </div>
        <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ margin: '0 10px' }}>Number of Participants</div>
          <div>{audience.numParticipants > 999 ? numeral(audience.numParticipants).format('0.0 a') : numeral(audience.numParticipants).format('0 a')}</div>
        </div>
        <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ margin: '0 10px' }}>Uploaded</div>
          <div>{moment.utc(audience.createDate, 'YYYYMMDDHHmm').local().fromNow()}</div>
        </div>
      </div>
      {/* {
        selectedTab === 'Owned' ? (
          <Download onCloseSidePanel={onCloseSidePanel} audience={audience} EventHandler={EventHandler} alertActions={alertActions} audiencesActions={audiencesActions} />
        ) : null
      } */}
    </div>
  );
};

ViewAudience.propTypes = {
  audience: PropTypes.object,
  onCloseSidePanel: PropTypes.func,
  selectedTab: PropTypes.string,
  EventHandler: PropTypes.object,
  alertActions: PropTypes.object,
  audiencesActions: PropTypes.object,
};

export default ViewAudience;
