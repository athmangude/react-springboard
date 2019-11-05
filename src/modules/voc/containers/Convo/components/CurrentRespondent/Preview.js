import React from 'react';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { RoundShape, TextRow } from 'react-placeholder/lib/placeholders';
import 'react-placeholder/lib/reactPlaceholder.css';

import MwambaInitialsCircle from 'Utils/mwamba-initials-circle';

const Preview = ({ activeParticipant, initials, loading, backToConversations, width }) => {
  if (!activeParticipant || loading) {
    return (
      <ReactPlaceholder
        ready={false}
        showLoadingAnimation
        customPlaceholder={(
          <div>
            <div style={{ height: 90, backgroundColor: '#CED6DF', boxShadow: '-1px 1px 1px 0 rgba(0, 0, 0, 0.1)', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <div style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RoundShape color="#E0E0E0" style={{ width: 50, height: 50 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 10 }}>
                  <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#33597f' }}>
                    <TextRow color="#E0E0E0" style={{ width: 150, height: 10 }} />
                  </div>
                  <div style={{ fontFamily: 'Lato', fontSize: 14, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#33597f' }}>
                    <TextRow color="#E0E0E0" style={{ width: 150, height: 10 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      />
    );
  }

  return (
    <div style={{ height: 90, backgroundColor: '#CED6DF', boxShadow: '-1px 1px 1px 0 rgba(0, 0, 0, 0.1)', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        {
          width <= 425 ? (
            <div role="button" tabIndex={0} onClick={backToConversations} className="back-to-conversations" style={{ cursor: 'pointer' }}>
              <i className="material-icons">chevron_left</i>
            </div>
          ) : null
        }
        <MwambaInitialsCircle initials={initials} backgroundColor="#ffac28" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 10 }}>
          <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#33597f' }}>Conversation with:</div>
          <div style={{ fontFamily: 'Lato', fontSize: 14, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#33597f' }}>{activeParticipant.name.trim() ? activeParticipant.name : activeParticipant.commId}</div>
        </div>
      </div>
    </div>
  );
};

Preview.propTypes = {
  activeParticipant: PropTypes.object,
  initials: PropTypes.string,
  loading: PropTypes.bool,
  backToConversations: PropTypes.func,
  width: PropTypes.number,
};

export default Preview;
