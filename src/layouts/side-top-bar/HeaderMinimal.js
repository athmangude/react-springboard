/* eslint-disable react/no-array-index-key, no-nested-ternary, no-shadow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row } from 'react-grid-system';
import { Link } from 'react-router-dom';
import moment from 'moment';

import ProfileActions from './ProfileActions';
import IncognitoHeaderMinimal from './IncognitoHeaderMinimal';
import * as homeFeedActions from 'Modules/shopping/containers/Home/patch/actions';
import * as collaboratorsActions from 'Modules/shopping/containers/Settings/Collaborators/flux/actions';

import ActivityHandler from 'Utils/ActivityHandler';

import './header.css';
import mSurveyLogo from 'Images/white-logo.svg';

class AppHeaderMinimal extends Component {
  constructor(props) {
    super(props);

    this.fetchHomeFeed = this.fetchHomeFeed.bind(this);
    this.fetchCollaborators = this.fetchCollaborators.bind(this);
  }

  state = {
    isFetchingNotifications: false,
  }

  componentDidMount() {
    if (this.props.user) {
      this.fetchHomeFeed();
      // this.fetchCollaborators();
    }
  }

  componentWilReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user && nextProps.user) {
      // this.fetchHomeFeed();
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

  async fetchHomeFeed() {
    this.setState({ isFetchingNotifications: true });
    try {
      const fetchHomeFeedResult = await this.props.homeFeedActions.fetchHomeFeed();
      const activityItems = fetchHomeFeedResult.data[4].data.map((item) => ({ ...item, uiSortDate: moment(item.createDate), type: 'activity' })).filter((item) => item.eventType !== 'USER_LOGIN' && item.payload.length > 8);
      this.props.homeFeedActions.addNotifications(activityItems);
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingNotifications: false });
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
        <div className="top-navigation-bar" style={{ height: 60, backgroundColor: '#33597f', position: 'fixed', top: 0, width: '100%', zIndex: 9999999, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)' }}>
          <Container fluid>
            <Row>
              <div className="container" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Link to="/" onClick={() => this.props.onLinkClicked('/')}>
                  <img src={logo} height={40} style={{ margin: '10px 10px 10px 20px' }} alt="logo" />
                </Link>
                <div></div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                  <div className="top-bar-profile-actions-dropdown-menu" style={{ margin: 0 }}>
                    <ProfileActions
                      user={displayName}
                      account={account}
                      onLinkClicked={this.props.onLinkClicked}
                      trigger={(
                        <span style={{ fontWeight: 'bold', fontSize: 15, color: '#fff', backgroundColor: '#487db3', padding: 10, borderRadius: '50%', position: 'relative', bottom: -5 }}>{`${firstInitial}${lastInitial}`}</span>
                      )}
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
      <IncognitoHeaderMinimal onLinkClicked={this.props.onLinkClicked} />
    );
  }
}
AppHeaderMinimal.propTypes = {
  user: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  onLinkClicked: PropTypes.func.isRequired,
};

AppHeaderMinimal.contextTypes = {
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
}))(AppHeaderMinimal);
