/* eslint-disable react/no-array-index-key, no-nested-ternary, no-shadow */

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
import * as homeFeedActions from 'Modules/shopping/containers/Home/flux/actions';
import * as collaboratorsActions from 'Modules/shopping/containers/Settings/Collaborators/flux/actions';

import ActivityHandler from 'Utils/ActivityHandler';

import './header.css';
import mSurveyLogo from 'Images/white-logo.svg';

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
    if (this.props.user) {
      // this.fetchCollaborators();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user && nextProps.user) {
      // this.fetchCollaborators();
    }
  }

  async fetchCollaborators() {
    this.setState({ isFetchingCollaborators: true });

    try {
      const fetchCollaboratorsResult = await this.props.collaboratorsActions.fetchCollaborators();
      this.props.collaboratorsActions.addCollaborators(fetchCollaboratorsResult.data.data);
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingCollaborators: false });
    }
  }

  render() {
    if (this.props.user) {
      const activeAccount = this.props.user.accounts.find((account) => account.id === this.props.user['x-account-id']);
      const account = activeAccount.profilename;
      const firstInitial = this.props.user.user.firstName.length ? this.props.user.user.firstName[0].toUpperCase() : '';
      const lastInitial = this.props.user.user.lastName.length ? this.props.user.user.lastName[0].toUpperCase() : '';
      // const displayName = Case.capital(this.props.user.firstName || this.props.user.email.substring(0, this.props.user.email.lastIndexOf('@')));
      const displayName = `${this.props.user.user.firstName} ${this.props.user.user.lastName}`;
      return (
        <div className="top-navigation-bar" style={{ height: 60, backgroundColor: '#33597f', position: 'sticky', top: 0, width: '100%', zIndex: 9999999 }}>
          <Container fluid>
            <Row>
              <div className="container" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Link to="/" onClick={() => this.props.onLinkClicked('/')}>
                  <img src={logo} height={40} style={{ margin: '10px 10px 10px 20px' }} alt="logo" />
                </Link>
                <div></div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                    {
                      menu.map((item, i) => {
                        if (!item.hasMenu) {
                          return (
                            <Link className="white-on-hover" to={item.path} key={i} onClick={() => this.props.onLinkClicked(item.path)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', margin: '10px 0px 0px', padding: '0 20px', position: 'relative', color: isCurrentRoute(this.context.router.route.location.pathname, item.path) ? '#fff' : '#d9d9d9' }}>
                              <i className="material-icons" style={{ }}>{item.icon}</i>
                              <span style={{ fontSize: 10, maxWidth: 50, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                              {
                                isCurrentRoute(this.context.router.route.location.pathname, item.path) ? (
                                  <div style={{ width: '100%', height: 4, backgroundColor: '#fff', position: 'absolute', bottom: -3, borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }} />
                                ) : null
                              }
                            </Link>
                          );
                        }

                        return (
                          <Dropdown
                            className="menu-item-with-dropdown-menu"
                            pointing
                            icon={null}
                            trigger={(
                              <div className="white-on-hover" to={item.path} key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', margin: '10px 0px 0px', padding: '0 20px', position: 'relative', color: isCurrentRoute(this.context.router.route.location.pathname, item.path) ? '#fff' : '#d9d9d9' }}>
                                <i className="material-icons" style={{ }}>{item.icon}</i>
                                <span style={{ fontSize: 10, maxWidth: 50, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                                {
                                  isCurrentRoute(this.context.router.route.location.pathname, item.path) ? (
                                    <div style={{ width: '100%', height: 4, backgroundColor: '#fff', position: 'absolute', bottom: -3, borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }} />
                                  ) : null
                                }
                              </div>
                            )}
                          >
                            <Dropdown.Menu style={{ width: 220 }}>
                              <Dropdown.Header style={{ padding: '0 10px' }}><span style={{ textTransform: 'capitalize', fontSize: 14, color: '#3d4553', padding: 10 }}>Notifications</span></Dropdown.Header>
                              <Dropdown.Divider style={{ margin: 0 }} />
                              {
                                this.state.isFetchingNotifications ? (
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                                    <Spinner spinnerColor="#487db3" spinnerWidth={3} size={40} />
                                  </div>
                                ) : !this.props.notifications.filter((item) => item.payload.length > 8).length ? (
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                                    <span>You have no notifications in your account</span>
                                  </div>
                                ) : this.props.notifications.reverse().filter((item) => item.payload.length > 8).slice(0, 5).map((notification, i) => {
                                  const actor = this.props.collaborators.find((collaborator) => collaborator.id === notification.userId);
                                  return (
                                    <div key={notification.id} style={{ maxWidth: 220 }}>
                                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: '0 15px', width: '100%' }}>
                                        <div style={{ height: 40, width: 40, minWidth: 40, minHeight: 40, borderRadius: 20, backgroundColor: '#d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0px 10px 0 0' }}>
                                          <span style={{ textTransform: 'uppercase', fontSize: 15, color: '#fff' }}>{actor ? `${actor.firstName[0]}${actor.lastName[0]}` : 'AC'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column', margin: '10px 0', width: 'calc(100% - 40)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'no-wrap' }}>
                                          <b style={{ textTransform: 'capitalize', margin: '-2px 0', fontSize: 12, color: '#3d4553', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'no-wrap', width: '100%' }}>{actor ? `${actor.firstName} ${actor.lastName}` : 'Account Collaborator'}</b>
                                          <span style={{ margin: '-2px 0', fontSize: 11, fontWeight: 'lighter', color: '#3d4553', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'no-wrap', width: '100%' }}>{notification.uiSortDate.format('MMM. Do, YYYY | hh:mm a')}</span>
                                          <b style={{ margin: '-2px 0', fontSize: 11, textTransform: 'normal', color: '#3d4553', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'no-wrap', width: '100%' }}>{JSON.parse(notification.payload).details}</b>
                                        </div>
                                      </div>
                                      {
                                        (this.props.notifications.reverse().filter((item) => item.payload.length > 8).slice(0, 5).length - 1) !== i ? (
                                          <Divider style={{ margin: 0 }} />
                                        ) : null
                                      }
                                    </div>
                                  );
                                })
                              }
                              <Dropdown.Divider style={{ margin: 0 }} />
                              <Dropdown.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => this.context.router.history.push('/notifications')}>See all activity</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        );
                      })
                    }
                  </div>
                  <div style={{ height: '100%', width: 10, borderRight: 'solid 1px #487db3' }}>&nbsp;</div>
                  <div style={{ marginLeft: 20, maxWidth: 120, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: '#fff' }}><span style={{ color: '#fff', fontWeight: 'bold' }}>{activeAccount.profilename.toUpperCase()}</span></div>
                  <div className="top-bar-profile-actions-dropdown-menu" style={{ margin: '0px 20px' }}>
                    <ProfileActions
                      user={displayName}
                      account={account}
                      trigger={(
                        <span style={{ fontWeight: 'bold', fontSize: 15, color: '#fff', backgroundColor: '#487db3', padding: 10, borderRadius: '50%', position: 'relative', bottom: -5 }}>{`${firstInitial}${lastInitial}`}</span>
                      )}
                      onLinkClicked={this.props.onLinkClicked}
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
      <IncognitoHeader onLinkClicked={this.props.onLinkClicked} />
    );
  }
}
AppHeader.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
  collaborators: PropTypes.array,
  onLinkClicked: PropTypes.func,
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
