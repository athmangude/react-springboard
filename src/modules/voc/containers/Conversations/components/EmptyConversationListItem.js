/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, RoundShape } from 'react-placeholder/lib/placeholders';
import 'react-placeholder/lib/reactPlaceholder.css';
import ContainerDimensions from 'react-container-dimensions';

const EmptyConversationListItem = (props) => {
  const items = new Array(props.items).fill(0);

  return (
    <div style={{ width: '100%' }}>
      <ContainerDimensions>
        {
          ({ width }) => (
            <div>
              {
                (width > 500) ? (
                  <div>
                    {
                      items.map((item, i) => (
                        <ReactPlaceholder
                          showLoadingAnimation
                          customPlaceholder={(
                            <div className="wide-conversation-list-item" style={{ width: '100%', backgroundColor: '#fff', border: 'solid 1px #d9d9d9', margin: '3px 0', padding: 0, borderRadius: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', position: 'relative' }}>
                              <div style={{ width: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', margin: 20 }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: 'solid 1px #d9d9d9', height: '100%', width: 90, paddingRight: 20 }}>
                                    <RoundShape color="#efefef" style={{ height: 50, width: 50, marginBottom: 10 }} />
                                    <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection: 'column', padding: '0px 20px', width: 'calc(100% - 90px)' }}>
                                    <RectShape color="#efefef" style={{ height: 10, width: 300, borderRadius: 0, margin: '0' }} />
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%', marginTop: 10 }}>
                                      <div style={{ width: 100 }}>
                                        <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
                                      </div>
                                      <div>
                                        <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0px 10px', position: 'relative' }}>
                                          <i className="material-icons" style={{ fontSize: 40, color: '#efefef' }}>my_location</i>
                                          <span style={{ color: '#efefef', fontSize: 11 }}>
                                            <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
                                          </span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0px 10px', position: 'relative' }}>
                                          <i className="material-icons" style={{ fontSize: 40, color: '#efefef' }}>message</i>
                                          <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        />
                      ))
                    }
                  </div>
                ) : (
                  <div>
                    {
                      items.map((item, i) => (
                        <ReactPlaceholder
                          showLoadingAnimation
                          customPlaceholder={(
                            <div className="wide-conversation-list-item" style={{ width: '100%', backgroundColor: '#fff', border: 'solid 1px #d9d9d9', margin: '3px 0', padding: 0, borderRadius: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', position: 'relative' }}>
                              <div style={{ width: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', margin: 20 }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: 'solid 1px #d9d9d9', height: '100%', width: 90, paddingRight: 20 }}>
                                    <RoundShape color="#efefef" style={{ height: 50, width: 50, marginBottom: 10 }} />
                                    <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', padding: '0px 20px', width: 'calc(100% - 90px)' }}>
                                    <RectShape color="#efefef" style={{ height: 10, width: 200, borderRadius: 0, margin: '0' }} />
                                    <div style={{ display: 'flex', alignItems: 'flext-start', justifyContent: 'flex-start', flexDirection: 'column', width: '100%', marginTop: 10 }}>
                                      <div style={{ width: 100 }}>
                                        <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0px 10px', position: 'relative' }}>
                                          <i className="material-icons" style={{ fontSize: 40, color: '#efefef' }}>my_location</i>
                                          <span style={{ color: '#efefef', fontSize: 11 }}>
                                            <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
                                          </span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0px 10px', position: 'relative' }}>
                                          <i className="material-icons" style={{ fontSize: 40, color: '#efefef' }}>message</i>
                                          <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        />
                      ))
                    }
                  </div>
                )
              }
            </div>
          )
        }
      </ContainerDimensions>
    </div>
  );
};

EmptyConversationListItem.propTypes = {
  items: PropTypes.number.isRequired,
};

export default EmptyConversationListItem;

{/* <div key={i} style={{ width: '100%' }}>
  <ReactPlaceholder
    showLoadingAnimation
    customPlaceholder={(
      <div className="wide-conversation-list-item" style={{ width: '100%', border: 'solid 1px #d9d9d9', margin: '10px 0', padding: 20, borderRadius: 8, backgroundColor: '#fff', display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: 'solid 1px #d9d9d9' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <i className="material-icons" style={{ color: '#d9d9d9', margin: 'auto 10px auto 0' }}>chat</i>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
              <RectShape color="#efefef" style={{ height: 5, width: '100%', borderRadius: 0, margin: '4px 0' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderRight: 'solid 1px #d9d9d9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justtifyContent: 'center', flexDirection: 'row' }}>
            <i className="material-icons" style={{ margin: '0px 15px 0 0', color: '#d9d9d9' }}>access_time</i>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 100 }}>
              <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
              <RectShape color="#efefef" style={{ height: 5, width: '100%', borderRadius: 0, margin: '4px 0' }} />
              <RectShape color="#efefef" style={{ height: 25, width: '100%', borderRadius: 0, margin: '4px 0' }} />
              <RectShape color="#efefef" style={{ height: 5, width: '100%', borderRadius: 0, margin: '4px 0' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', borderRight: 'solid 1px #d9d9d9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justtifyContent: 'center', flexDirection: 'row', width: '100%' }}>
            <i className="material-icons" style={{ margin: '0px 15px 0 0', color: '#d9d9d9' }}>timelapse</i>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '0' }} />
              <RectShape color="#efefef" style={{ height: 25, width: '100%', borderRadius: 0, margin: '4px 0' }} />
              <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '4px 0' }} />
              <RectShape color="#efefef" style={{ height: 10, width: '100%', borderRadius: 0, margin: '4px 0' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: '#FFF', borderRadius: 20, height: 40, width: '100%' }}>
            <i className="material-icons" style={{ margin: '0px 10px 0 0', color: '#d9d9d9' }}>access_time</i>
            <RectShape color="#efefef" style={{ height: 15, width: '100%', borderRadius: 0, margin: '4px 0' }} />
          </div>
        </div>
      </div>
    )}
  />
</div> */}
