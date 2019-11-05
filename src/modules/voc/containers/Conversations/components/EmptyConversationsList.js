/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { TextBlock, RectShape } from 'react-placeholder/lib/placeholders';

import backgroundImage from './empty_list_background.png';

const EmptyConversationsList = () => (
  <div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', width: '100%', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', height: '60vh' }}>
      <ReactPlaceholder
        customPlaceholder={(
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection: 'row', width: '50%', border: 'solid 2px #d9d9d9', padding: 10, backgroundColor: '#fafafa' }}>
              <div style={{ width: 70, margin: 10, position: 'relative', top: 0, height: '100%' }}>
                <RectShape style={{ width: 70, height: 70, borderRadius: '50%' }} color="#efefef" />
              </div>
              <div
                style={{
                  display: 'flex', alignItems: 'center', flexDirection: 'column', width: 'calc(100% - 70px)', padding: 5,
                }}
              >
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexDirection: 'row',
                  }}
                >
                  <div
                    style={{
                      display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', flexDirection: 'row', width: '50%',
                      }}
                    >
                      <i className="material-icons" style={{ color: '#efefef', fontSize: 25, marginTop: -5 }}>flag</i>
                      <div style={{ height: 20, width: 'calc(100% - 25px)' }}>
                        <div style={{ width: '100%' }}>
                          <TextBlock rows={1} color="#efefef" style={{ margin: '0 0 1px 0', height: 20 }} />
                        </div>
                        <div style={{ width: '80%' }}>
                          <TextBlock rows={1} color="#efefef" style={{ margin: '0', height: 5 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: '10%', display: 'flex', alignItems: 'end' }}>
                    <TextBlock rows={1} color="#efefef" style={{ height: 8 }} />
                  </div>
                </div>
                <div style={{ width: '100%', margin: '20px 0' }}>
                  <div style={{ width: '100%', marginBottom: 3 }}>
                    <TextBlock rows={1} color="#efefef" />
                  </div>
                  <div style={{ width: '80%' }}>
                    <TextBlock rows={1} color="#efefef" style={{ height: 10 }} />
                  </div>
                </div>
                <div
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'start', flexDirection: 'row',
                  }}
                >
                  <RectShape
                    color="transparent"
                    style={{
                      height: 10, width: '7%', border: 'solid 1px #d9d9d9', borderRadius: 7,
                    }}
                  />
                  <RectShape
                    color="transparent"
                    style={{
                      height: 10, width: '7%', border: 'solid 1px #d9d9d9', borderRadius: 7,
                    }}
                  />
                  <RectShape
                    color="transparent"
                    style={{
                      height: 10, width: '7%', border: 'solid 1px #d9d9d9', borderRadius: 7,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row',
                  }}
                >
                  <RectShape
                    color="transparent"
                    style={{
                      height: 15, width: '15%', border: 'solid 1px #d9d9d9', borderRadius: 7,
                    }}
                  />
                  <RectShape
                    color="transparent"
                    style={{
                      height: 15, width: '15%', border: 'solid 1px #d9d9d9', borderRadius: 7,
                    }}
                  />
                  <RectShape
                    color="transparent"
                    style={{
                      height: 15, width: '15%', border: 'solid 1px #d9d9d9', borderRadius: 7,
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                margin: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 'lighter' }}>You have not created any surveys</h3>
              <Link to="/surveys/new">
                <Button
                  className="new-survey-button"
                  style={{
                    display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 25, margin: '0 5px', padding: '3px 50px', backgroundColor: '#b31e20', color: '#FFF',
                  }}
                >
                  <i className="material-icons" style={{ fontSize: 20 }}>add</i>
                  <span style={{ margin: '0 5px' }}>New Survey</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      />
    </div>
  </div>
);

export default EmptyConversationsList;
