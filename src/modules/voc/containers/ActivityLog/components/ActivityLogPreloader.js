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
        <div
          style={{
            width: '100%', borderLeft: 'solid 5px #d9d9d9', position: 'relative', left: 120,
          }}
        >
          {
            groupsCount.map((group) => (
              <div
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'auto', position: 'relative', left: -117,
                }}
              >
                <RectShape
                  color="#efefef"
                  style={{
                    width: 100, height: 10, borderRadius: 0, margin: '0 20px 0 0',
                  }}
                />
                <div
                  style={{
                    width: 50, height: '100%', minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 14, height: 14, borderRadius: 7, border: 'solid 3px #4a4f57', backgroundColor: '#fafafa', position: 'relative', left: -9,
                    }}
                  />
                </div>
                <div
                  style={{
                    backgroundColor: '#fff', margin: '10px 10px', borderRadius: 8, border: 'solid 1px #d9d9d9', width: 'calc(100% - 170px)',
                  }}
                >
                  {
                    new Array(Math.floor(Math.random() * 10) + 1).fill(0).map((notification) => (
                      <div
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottom: 'solid 1px #d9d9d9', padding: 10,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: 'calc(100% - 60px)',
                          }}
                        >
                          <div>
                            <RoundShape
                              style={{
                                height: 30, width: 30, backgroundColor: '#d9d9d9', border: 'solid 2px #c4c4c4', margin: '0 10px 0 0',
                              }}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: 11, color: '#808285', fontWeight: 'bold', width: 'calc(100% - 40px)', display: 'flex', alignItems: 'center', justifyContent: 'start',
                            }}
                          >
                            <div style={{ width: 100 }}>
                              <RectShape
                                color="#efefef"
                                style={{
                                  height: 10, width: 100, borderRadius: 0, margin: '0',
                                }}
                              />
                            </div>
                            &nbsp;–&nbsp;
                            <div style={{ width: 100 }}>
                              <RectShape
                                color="#efefef"
                                style={{
                                  height: 10, width: 100, borderRadius: 0, margin: '0',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            width: 60, justifyContent: 'flex-end', alignItems: 'flex-start', alignSelf: 'flex-start', textAlign: 'right',
                          }}
                        >
                          <RectShape
                            color="#efefef"
                            style={{
                              height: 10, width: '100%', borderRadius: 0, margin: '0',
                            }}
                          />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
        </div>
      )}
    >
    </ReactPlaceholder>
  );
};

export default ActivityLogPreloader;
