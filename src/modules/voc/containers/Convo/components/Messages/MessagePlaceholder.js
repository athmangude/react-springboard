import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { TextRow, RoundShape } from 'react-placeholder/lib/placeholders';
import 'react-placeholder/lib/reactPlaceholder.css';
import PropTypes from 'prop-types';

const MessagePlaceholder = ({ isLoading, initial, newMessage, width }) => {
  if (!isLoading) return null;
  if (initial) {
    return (
      <ReactPlaceholder
        ready={false}
        showLoadingAnimation
        customPlaceholder={(
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end', width: '100%', paddingRight: 20, marginBottom: 10, paddingTop: width > 425 ? 'calc(100vh - 300px)' : 'calc(100vh - 410px)' }}>
            <div style={{ maxWidth: 'calc(85% - 50px)', margin: '5px 10px 5px 0', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', borderRadius: '10px 0 10px 10px', backgroundColor: '#e2e2e2' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', letterSpacing: 0.6, textAlign: 'right', color: '#58595b', width: '100%' }}>
                <TextRow color="#FFFFFF" style={{ height: 8, width: 200 }} />
              </div>
              <TextRow color="#FFFFFF" style={{ height: 8, width: '100%' }} />
            </div>
            <div style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RoundShape color="#E0E0E0" style={{ width: 50, height: 50 }} />
            </div>
          </div>
        )}
      />
    );
  }

  if (newMessage) {
    return (
      <ReactPlaceholder
        ready={false}
        showLoadingAnimation
        customPlaceholder={(
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end', width: '100%', paddingRight: 20 }}>
            <div style={{ maxWidth: 'calc(85% - 50px)', margin: '5px 10px 5px 0', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', borderRadius: '10px 0 10px 10px', backgroundColor: '#e2e2e2' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', letterSpacing: 0.6, textAlign: 'right', color: '#58595b', width: '100%' }}>
                <TextRow color="#FFFFFF" style={{ height: 8, width: 200 }} />
              </div>
              <TextRow color="#FFFFFF" style={{ height: 8, width: '100%' }} />
            </div>
            <div style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RoundShape color="#E0E0E0" style={{ width: 50, height: 50 }} />
            </div>
          </div>
        )}
      />
    );
  }

  return null;
};

MessagePlaceholder.propTypes = {
  isLoading: PropTypes.bool,
  initial: PropTypes.bool,
  newMessage: PropTypes.bool,
  width: PropTypes.number,
};

export default MessagePlaceholder;
