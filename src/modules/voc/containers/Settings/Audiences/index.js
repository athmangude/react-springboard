/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline, no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Container, Row } from 'react-grid-system';
import { connect } from 'react-redux';
import Spinner from 'react-spinner-material';

import CircularButton from 'SharedComponents/circular-button';
import AudienceUpload from './AudienceUpload';
import ViewAudience from './components/ViewAudience';
import ShareAudience from './components/ShareAudience';
import EditAudience from './EditAudience';
import RemoveAudience from './components/RemoveAudience';
import ActionButton from 'SharedComponents/action-button-styled';
import ActivityHandler from 'Utils/ActivityHandler';
import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../components/SettingsNavigationContainer';
import TabMenu from 'SharedComponents/tab';

import * as audiencesActions from './flux/actions';

import Audience from './components/Audience';

const tabs = [{ label: 'Owned' }, { label: 'Shared' }, { label: 'Shared With You' }];

@connect((state) => ({
  user: state.authentication.user,
  audiences: state.audiences,
  loggedInUserRole: state.roles.loggedInUserRole,
  account: state.account,
}),
(dispatch) => ({
  audiencesActions: bindActionCreators(audiencesActions, dispatch),
  dispatch,
}))
class Audiences extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loggedInUserRole: PropTypes.object,
    audiences: PropTypes.object.isRequired,
    audiencesActions: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
    account: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onAddAudience = this.onAddAudience.bind(this);
    this.onView = this.onView.bind(this);
    this.onAddMembers = this.onAddMembers.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onShare = this.onShare.bind(this);
    this.onUnshare = this.onUnshare.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.fetchAudiences = this.fetchAudiences.bind(this);
    this.onTabSelected = this.onTabSelected.bind(this);

    this.state = {
      isFetchingAudiences: false,
      selectedTab: 'Owned',
      sidePanel: null,
      showSidePanel: false,
    }
  }

  componentDidMount() {
    this.fetchAudiences();
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  onAddAudience() {
    const { EventHandler, alertActions, audiencesActions, user } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<AudienceUpload onCloseSidePanel={this.onCloseSidePanel} user={user} audiencesActions={audiencesActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onView(audience) {
    const { EventHandler, alertActions, audiencesActions } = this.props;
    const { selectedTab } = this.state;
    this.setState({ showSidePanel: true, sidePanel: (<ViewAudience onCloseSidePanel={this.onCloseSidePanel} audience={audience} selectedTab={selectedTab} audiencesActions={audiencesActions} alertActions={alertActions} EventHandler={EventHandler} />) });
  }

  onAddMembers(audience) {
    const { EventHandler, alertActions, audiencesActions, user } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<AudienceUpload onCloseSidePanel={this.onCloseSidePanel} audience={audience} user={user} audiencesActions={audiencesActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onEdit(audience) {
    const { EventHandler, alertActions, audiencesActions, user } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<EditAudience onCloseSidePanel={this.onCloseSidePanel} audience={audience} user={user} audiencesActions={audiencesActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onShare(audience) {
    const { EventHandler, alertActions, audiencesActions, user } = this.props;
    const { selectedTab } = this.state;
    this.setState({ showSidePanel: true, sidePanel: (<ShareAudience onCloseSidePanel={this.onCloseSidePanel} audience={audience} selectedTab={selectedTab} user={user} audiencesActions={audiencesActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onUnshare(audience) {
    const { EventHandler, alertActions, audiencesActions, user } = this.props;
    const { selectedTab } = this.state;
    this.setState({ showSidePanel: true, sidePanel: (<ShareAudience onCloseSidePanel={this.onCloseSidePanel} audience={audience} selectedTab={selectedTab} user={user} audiencesActions={audiencesActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onDelete(audience) {
    const { EventHandler, alertActions, audiencesActions } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<RemoveAudience onCloseSidePanel={this.onCloseSidePanel} audience={audience} audiencesActions={audiencesActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false, sidePanel: null });
  }

  async fetchAudiences() {
    const { audiencesActions, EventHandler } = this.props;
    try {
      this.setState({ isFetchingAudiences: true });
      const fetchAudiencesResult = await audiencesActions.fetchSelectableAudiences();
      const fetchAudiencesResultLength = fetchAudiencesResult.data.Data.panelsOwned.length + fetchAudiencesResult.data.Data.panelsSharedWithAccount.length;
      audiencesActions.setAudiences(fetchAudiencesResult.data.Data, fetchAudiencesResultLength, 1);
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingAudiences: false });
    }
  }

  render() {
    const { audiences, loggedInUserRole, account } = this.props;
    const { selectedTab, isFetchingAudiences, showSidePanel, sidePanel, EventHandler } = this.state;
    const sharedPanels = audiences.items.panelsOwned.filter((panel) => panel.sharedWith.length);
    let panelsToDisplay = audiences.items.panelsOwned;
    if (selectedTab === 'Shared') {
      panelsToDisplay = sharedPanels;
    }
    if (selectedTab === 'Shared With You') {
      panelsToDisplay = audiences.items.panelsSharedWithAccount;
    }
    return (
      <SettingsNavigationContainer
        topRightComponent={(<TabMenu tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} style={{ backgroundColor: 'inherit', borderBottom: 'none' }} />)}
        sidePanel={showSidePanel ? sidePanel : null}
        EventHandler={EventHandler}
      >
        {
          account.active ? (
            <CircularButton className="primary cta" style={{ position: 'fixed', top: 83, right: 20, zIndex: 1 }} icon="add" color="#002366" onClick={this.onAddAudience} />
          ) : null
        }
        {
          isFetchingAudiences ? (
            <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={2} />
              <span style={{ margin: 20 }}>Loading audiences</span>
            </div>
          ) : selectedTab === 'Owned' && !panelsToDisplay.length ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
              <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>You do not own any audiences</h2>
              <ActionButton className="primary" large icon="add" text="Add Audience" onClick={this.onAddAudience} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          ) : selectedTab === 'Shared' && !panelsToDisplay.length ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
              <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>You have not shared audiences</h2>
              <ActionButton className="primary" large icon="add" text="Share Audience" onClick={() => this.onTabSelected('Owned')} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          ) : selectedTab === 'Shared With You' && !panelsToDisplay.length ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
              <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>You do not have any audience that have been shared with you by other accounts</h2>
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <Container fluid style={{ margin: 0, padding: 0 }}>
                <Row style={{ margin: 0, padding: 0 }}>
                  {
                    panelsToDisplay.map((audience) => (
                      <Audience key={audience.panelId} audience={audience} loggedInUserRole={loggedInUserRole} selectedTab={selectedTab} onView={this.onView} onAddMembers={this.onAddMembers} onEdit={this.onEdit} onShare={this.onShare} onUnshare={this.onUnshare} onDelete={this.onDelete} audiencesActions={audiencesActions} />
                    ))
                  }
                </Row>
              </Container>
            </div>
          )
        }
      </SettingsNavigationContainer>
    );
  }
}

export default withAuthentication(Audiences);
