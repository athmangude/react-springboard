/* eslint-disable jsx-a11y/href-no-hash, react/no-array-index-key, no-nested-ternary, no-shadow, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row } from 'react-grid-system';
import { Link } from 'react-router-dom';
import { Dropdown, Divider } from 'semantic-ui-react/dist/commonjs';
import Spinner from 'react-spinner-material';

import ProfileActions from './ProfileActions';
import IncognitoHeader from './IncognitoHeader';
import * as homeFeedActions from 'Modules/voc/containers/Home/flux/actions';
import * as collaboratorsActions from 'Modules/voc/containers/Settings/Collaborators/flux/actions';

import ActivityHandler from 'Utils/ActivityHandler';

import './header.css';
import logo from 'Images/logo.png';

const menu = [
  {
    icon: 'home',
    label: 'Home',
    path: '/',
  },
  {
    icon: 'smartphone',
    label: 'Surveys',
    path: '/surveys',
  },
  // {
  //   icon: 'person',
  //   label: 'Customers',
  //   path: '/customers',
  // },
  // {
  //   icon: 'people',
  //   label: 'Audience',
  //   path: '/audiences',
  // },
  {
    icon: 'sms',
    label: 'Live Chat',
    path: '/live-chat',
  },
  {
    icon: 'bar_chart',
    label: 'Customer Analytics',
    path: '/analytics',
  },
  // {
  //   icon: 'notifications_active',
  //   label: 'Notifications',
  //   path: '/notifications',
  //   hasMenu: true,
  // },
];

function isCurrentRoute(pathname, actionPath) { // eslint-disable-line consistent-return
  if (actionPath.toLowerCase() === '/') {
    return pathname.toLowerCase() === actionPath.toLowerCase();
  }

  if (actionPath.toLowerCase() !== '/') {
    return pathname.toLowerCase().indexOf(actionPath.toLowerCase()) > -1;
  }
}

class AppHeader extends Component {
  constructor(props) {
    super(props);

    this.fetchCollaborators = this.fetchCollaborators.bind(this);
  }

  state = {
    isFetchingNotifications: false,
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      // this.fetchCollaborators();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user } = this.props;
    if (nextProps.user !== user && nextProps.user) {
      // this.fetchCollaborators();
    }
  }

  async fetchCollaborators() {
    const { collaboratorsActions, dispatch } = this.props;

    try {
      const fetchCollaboratorsResult = await collaboratorsActions.fetchCollaborators();
      collaboratorsActions.addCollaborators(fetchCollaboratorsResult.data.data);
    } catch (exception) {
      ActivityHandler.handleException(dispatch, exception);
    }
  }

  render() {
    const { user, onLinkClicked, notifications, collaborators } = this.props;
    const { isFetchingNotifications } = this.state;
    const { router } = this.context;
    if (user) {
      const activeAccount = user.accounts.find((account) => account.id === user['x-account-id']);
      const account = activeAccount.profilename;
      const firstInitial = user.user.firstName.length ? user.user.firstName[0].toUpperCase() : '';
      const lastInitial = user.user.lastName.length ? user.user.lastName[0].toUpperCase() : '';
      // const displayName = Case.capital(user.firstName || user.email.substring(0, user.email.lastIndexOf('@')));
      const displayName = `${user.user.firstName} ${user.user.lastName}`;
      return (
        <div
          className="top-navigation-bar"
          style={{
            height: 60, backgroundColor: '#fafafa', position: 'sticky', top: 0, width: '100%', zIndex: 9999999, boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Container>
            <Row>
              <div
                className="container"
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',
                }}
              >
                <Link to="/" onClick={() => onLinkClicked('/')}>
                  <img src={logo} height={40} style={{ margin: '10px 10px 10px 20px' }} alt="logo" />
                </Link>
                <div></div>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', height: '100%', padding: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', height: '100%', padding: 0,
                    }}
                  >
                    {
                      menu.map((item, i) => {
                        if (!item.hasMenu) {
                          return (
                            <Link
                              className={isCurrentRoute(router.route.location.pathname, item.path) ? 'white-on-hover' : 'red-on-hover'}
                              to={item.path}
                              key={i}
                              onClick={() => onLinkClicked(item.path)}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '100%', margin: 0, padding: '0 20px', position: 'relative', color: isCurrentRoute(router.route.location.pathname, item.path) ? '#fff' : '#000000de', backgroundColor: isCurrentRoute(router.route.location.pathname, item.path) ? '#4a4f57' : 'transparent',
                              }}
                            >
                              <i className="material-icons" style={{ }}>{item.icon}</i>
                              <span
                                style={{
                                  fontSize: 10, maxWidth: 50, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}
                              >
                                {item.label}
                              </span>
                            </Link>
                          );
                        }

                        return (
                          <Dropdown
                            className="menu-item-with-dropdown-menu"
                            pointing
                            icon={null}
                            trigger={(
                              <div
                                className="red-on-hover"
                                to={item.path}
                                key={i}
                                style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', margin: '10px 0px 0px', padding: '0 20px', position: 'relative', color: isCurrentRoute(router.route.location.pathname, item.path) ? '#fff' : '#d9d9d9',
                                }}
                              >
                                <i className="material-icons" style={{ }}>{item.icon}</i>
                                <span
                                  style={{
                                    fontSize: 10, maxWidth: 50, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                  }}
                                >
                                  {item.label}
                                </span>
                                {
                                  isCurrentRoute(router.route.location.pathname, item.path) ? (
                                    <div
                                      style={{
                                        width: '100%', height: 4, backgroundColor: '#fff', position: 'absolute', bottom: -3, borderBottomRightRadius: 0, borderBottomLeftRadius: 0,
                                      }}
                                    />
                                  ) : null
                                }
                              </div>
                            )}
                          >
                            <Dropdown.Menu style={{ width: 220 }}>
                              <Dropdown.Header style={{ padding: '0 10px' }}>
                                <span
                                  style={{
                                    textTransform: 'capitalize', fontSize: 14, color: '#3d4553', padding: 10,
                                  }}
                                >
Notifications
                                </span>
                              </Dropdown.Header>
                              <Dropdown.Divider style={{ margin: 0 }} />
                              {
                                isFetchingNotifications ? (
                                  <div
                                    style={{
                                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
                                    }}
                                  >
                                    <Spinner spinnerColor="#487db3" spinnerWidth={3} size={40} />
                                  </div>
                                ) : !notifications.filter((item) => item.payload.length > 8).length ? (
                                  <div
                                    style={{
                                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10,
                                    }}
                                  >
                                    <span>You have no notifications in your account</span>
                                  </div>
                                ) : notifications.reverse().filter((item) => item.payload.length > 8).slice(0, 5).map((notification, i) => {
                                  const actor = collaborators.find((collaborator) => collaborator.id === notification.userId);
                                  return (
                                    <div key={notification.id} style={{ maxWidth: 220 }}>
                                      <div
                                        style={{
                                          display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: '0 15px', width: '100%',
                                        }}
                                      >
                                        <div
                                          style={{
                                            height: 40, width: 40, minWidth: 40, minHeight: 40, borderRadius: 20, backgroundColor: '#d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0px 10px 0 0',
                                          }}
                                        >
                                          <span style={{ textTransform: 'uppercase', fontSize: 15, color: '#fff' }}>{actor ? `${actor.firstName[0]}${actor.lastName[0]}` : 'AC'}</span>
                                        </div>
                                        <div
                                          style={{
                                            display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column', margin: '10px 0', width: 'calc(100% - 40)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'no-wrap',
                                          }}
                                        >
                                          <b
                                            style={{
                                              textTransform: 'capitalize', margin: '-2px 0', fontSize: 12, color: '#3d4553', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'no-wrap', width: '100%',
                                            }}
                                          >
                                            {actor ? `${actor.firstName} ${actor.lastName}` : 'Account Collaborator'}
                                          </b>
                                          <span
                                            style={{
                                              margin: '-2px 0', fontSize: 11, fontWeight: 'lighter', color: '#3d4553', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'no-wrap', width: '100%',
                                            }}
                                          >
                                            {notification.uiSortDate.format('MMM. Do, YYYY | hh:mm a')}
                                          </span>
                                          <b
                                            style={{
                                              margin: '-2px 0', fontSize: 11, textTransform: 'normal', color: '#3d4553', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'no-wrap', width: '100%',
                                            }}
                                          >
                                            {JSON.parse(notification.payload).details}
                                          </b>
                                        </div>
                                      </div>
                                      {
                                        (notifications.reverse().filter((item) => item.payload.length > 8).slice(0, 5).length - 1) !== i ? (
                                          <Divider style={{ margin: 0 }} />
                                        ) : null
                                      }
                                    </div>
                                  );
                                })
                              }
                              <Dropdown.Divider style={{ margin: 0 }} />
                              <Dropdown.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => router.history.push('/notifications')}>See all activity</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        );
                      })
                    }
                  </div>
                  <div
                    style={{
                      marginLeft: 20, maxWidth: 120, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: '#000000de',
                    }}
                  >
                    <span style={{ color: '#000000de', fontWeight: 'bold' }}>{activeAccount.profilename.toUpperCase()}</span>
                  </div>
                  <div className="top-bar-profile-actions-dropdown-menu" style={{ margin: '0px 20px' }}>
                    <ProfileActions
                      user={displayName}
                      account={account}
                      trigger={(
                        <span
                          style={{
                            fontWeight: 'bold', fontSize: 15, color: '#fff', backgroundColor: '#4a4f57', padding: 10, borderRadius: '50%', position: 'relative', bottom: -5,
                          }}
                        >
                          {`${firstInitial}${lastInitial}`}
                        </span>
                      )}
                      onLinkClicked={onLinkClicked}
                    />
                  </div>
                </div>
              </div>
            </Row>
          </Container>
        </div>
      );
    }

    return (
      <IncognitoHeader onLinkClicked={onLinkClicked} />
    );
  }
}
AppHeader.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
  collaborators: PropTypes.array,
  onLinkClicked: PropTypes.func,
  collaboratorsActions: PropTypes.object,
};

AppHeader.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default connect((state) => ({
  user: state.authentication.user,
  notifications: state.home.notifications,
  collaborators: state.collaborators,
}),
(dispatch) => ({
  homeFeedActions: bindActionCreators(homeFeedActions, dispatch),
  collaboratorsActions: bindActionCreators(collaboratorsActions, dispatch),
  dispatch,
}))(AppHeader);
