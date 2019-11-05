/* eslint-disable no-unused-vars */

import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, RoundShape } from 'react-placeholder/lib/placeholders';

import 'react-placeholder/lib/reactPlaceholder.css';

const ActivityLogPreloader = (props) => {
  const groupsCount = new Array(3).fill(0);
  return (
    <ReactPlaceholder
      ready={false}
      showLoadingAnimation
      customPlaceholder={(
        <div style={{ width: '100%' }}>
          {
            groupsCount.map((group) => (
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'auto', flexDirection: 'column' }}>
                <RectShape color="#efefef" style={{ width: '100%', height: 50, borderRadius: 0, margin: 0 }} />
                <div style={{ backgroundColor: '#fff', margin: 0, borderRadius: 0, border: 'none', width: '100%' }}>
                  {
                    new Array(Math.floor(Math.random() * 10) + 1).fill(0).map((notification) => (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                          <div>
                            <RoundShape style={{ height: 30, width: 30, backgroundColor: '#d9d9d9', border: 'solid 2px #c4c4c4', margin: '0 10px 0 0' }} />
                          </div>
                          <div style={{ fontSize: 11, color: '#808285', fontWeight: 'bold', width: 'calc(100% - 40px)', display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                            <div style={{ width: '100%' }}>
                              <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
                            </div>
                          </div>
                        </div>
                        <div style={{ width: '100%', margin: 10 }}>
                          <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
                        </div>
                        <div style={{ width: 60, justifyContent: 'flex-end', alignItems: 'flex-start', alignSelf: 'flex-start', textAlign: 'right' }}>
                          <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )
          )}
        </div>
      )}
    >
    </ReactPlaceholder>
  );
};

export default ActivityLogPreloader;
