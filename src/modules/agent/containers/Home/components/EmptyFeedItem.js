import React from 'react';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { Button } from 'semantic-ui-react';
import { TextBlock, RectShape } from 'react-placeholder/lib/placeholders';
import 'react-placeholder/lib/reactPlaceholder.css';
import { Link } from 'react-router-dom';
import ActionButton from 'SharedComponents/action-button-styled';

import backgroundImage from './empty_list_background.png';

const EmptyConversationsList = (props) => {
  const items = new Array(props.items).fill(0);

  if (props.loading) {
    return (
      <div>
        {
          items.map(() => (
            <div
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', width: '100%', marginTop: 10,
              }}
            >
              <ReactPlaceholder
                showLoadingAnimation={props.loading}
                customPlaceholder={(
                  <div
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection: 'row', width: '100%', padding: 10, backgroundColor: '#fff', borderRadius: 8,
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: '#FFF', padding: 10, width: '100%', margin: '50px 5px 30px',
                        }}
                      >
                        <RectShape
                          color="#efefef"
                          style={{
                            height: 35, width: '100%', borderRadius: 0, margin: '0',
                          }}
                        />
                        <RectShape
                          color="#efefef"
                          style={{
                            height: 35, width: '100%', borderRadius: 0, margin: '10px 0 0',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          ))
        }
        {
          !props.loading ? (
            <div
              style={{
                margin: 10, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{ color: '#808285' }}>You have no items in your feed</span>
            </div>
          ) : null
        }
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', width: '100%', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', height: '60vh',
      }}
    >
      <ReactPlaceholder
        customPlaceholder={(
          <div
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            }}
          >
            {
              (!props.conversations.active || !props.conversations.active.items.length) ? (
                <h3 style={{ fontSize: 20, fontWeight: 'lighter' }}>You have not created any survey</h3>
              ) : (
                <h3 style={{ fontSize: 20, fontWeight: 'lighter' }}>No feedback yet</h3>
              )
            }
            <div
              style={{
                display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection: 'row', width: '100%', border: 'solid 2px #d9d9d9', padding: 10, backgroundColor: '#fafafa', borderRadius: 8,
              }}
            >
              <div
                style={{
                  width: 70, margin: 10, position: 'relative', top: 0, height: '100%',
                }}
              >
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
              {
                (!props.conversations.active || !props.conversations.active.items.length) ? (
                  <Link to="/surveys/new">
                    <ActionButton icon="add" text="Create Survey" primary large />
                  </Link>
                ) : (
                  <ActionButton text="Refresh" primary large icon="history" loading={props.isRefreshingFeed} disabled={props.isRefreshingFeed} onClick={() => props.fetchNPSComments({ })} />
                )
              }
            </div>
          </div>
        )}
      />
    </div>
  );
};

EmptyConversationsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.number.isRequired,
  isRefreshingFeed: PropTypes.bool.isRequired,
  conversations: PropTypes.object.isRequired,
  fetchNPSComments: PropTypes.func.isRequired,
};

export default EmptyConversationsList;
