import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { RoundShape, TextRow } from 'react-placeholder/lib/placeholders';
import 'react-placeholder/lib/reactPlaceholder.css';
import PropTypes from 'prop-types';

const ConversationsPlaceholder = ({ loading, array }) => (
  <div>
    <div style={{ paddingRight: 20 }}>
      <TextRow color="#d9d9d9" style={{ height: 10, width: 150, float: 'right', marginTop: 20, marginBottom: 10 }} />
    </div>
    {
      array.map((i) => (
        <ReactPlaceholder
          key={i}
          ready={false}
          showLoadingAnimation
          customPlaceholder={(
            <div>
              <div style={{ backgroundColor: 'inherit', minHeight: 50, display: 'flex', alignItems: 'center', width: '100%', padding: '0 20px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', margin: '10px 0', width: '100%' }}>
                  <div style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RoundShape color="#E0E0E0" style={{ width: 50, height: 50 }} />
                  </div>
                  <div style={{ width: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '0 20px' }}>
                    <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>
                      <TextRow color="#E0E0E0" style={{ width: 60, height: 10 }} />
                    </div>
                    <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>
                        <TextRow color="#E0E0E0" style={{ width: 120, height: 10 }} />
                      </div>
                      <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 300, fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>
                        <TextRow color="#E0E0E0" style={{ width: 60, height: 10 }} />
                      </div>
                    </div>
                    <TextRow color="#E0E0E0" style={{ width: '100%', height: 10, marginBottom: 5 }} />
                    <TextRow color="#E0E0E0" style={{ width: '100%', height: 10 }} />
                  </div>
                  <div style={{ width: 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <RoundShape color="#E0E0E0" style={{ width: 20, height: 20 }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      ))
    }

    {
      !loading ? (
        <div style={{ margin: 10, padding: 10, textAlign: 'center' }}>
          <span style={{ color: '#d9d9d9' }}>You have no conversations at the moment</span>
        </div>
      ) : (
        <div style={{ margin: 10, padding: 10, textAlign: 'center' }}>
          <span style={{ color: '#d9d9d9' }}>Loading conversations...</span>
        </div>
      )
    }
  </div>
);

ConversationsPlaceholder.propTypes = {
  loading: PropTypes.bool,
  array: PropTypes.array,
};

export default ConversationsPlaceholder;
