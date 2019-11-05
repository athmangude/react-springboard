/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Container, Row } from 'react-grid-system';
import { connect } from 'react-redux';
import Spinner from 'react-spinner-material';

import CircularButton from 'SharedComponents/circular-button';
import ActionButton from 'SharedComponents/action-button-styled';
import Collaborator from './components/Collaborator';
import ViewCollaborator from './components/ViewCollaborator';
import EditCollaborator from './components/EditCollaborator';
import NewCollaborator from './NewCollaborator';
import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../components/SettingsNavigationContainer';
import TabMenu from 'SharedComponents/tab';

import * as collaboratorsActions from './flux/actions';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';

import './index.css';

const tabs = [{ label: 'Active' }, { label: 'Disabled' }];

@connect((state) => ({
  user: state.authentication.user,
  collaborators: state.collaborators,
  loggedInUserRole: state.roles.loggedInUserRole,
  roles: state.roles.items,
}),
(dispatch) => ({
  collaboratorsActions: bindActionCreators(collaboratorsActions, dispatch),
  alertActions: bindActionCreators({ addAlert }, dispatch),
  dispatch,
}))
class Collaborators extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    collaborators: PropTypes.array.isRequired,
    collaboratorsActions: PropTypes.object.isRequired,
    loggedInUserRole: PropTypes.object,
    user: PropTypes.object.isRequired,
    roles: PropTypes.array,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onAddCollaborator = this.onAddCollaborator.bind(this);
    this.onView = this.onView.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.fetchCollaborators = this.fetchCollaborators.bind(this);
    this.onTabSelected = this.onTabSelected.bind(this);
  }

  state = {
    isFetchingCollaborators: false,
    selectedTab: 'Active',
    isCollaboratorActive: true,
    sidePanel: null,
    showSidePanel: false,
  };

  componentDidMount() {
    this.fetchCollaborators();
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab }, () => {
      selectedTab === 'Active' ? this.setState ({ isCollaboratorActive : true }) : this.setState ({ isCollaboratorActive: false });
    });
  }

  async onAddCollaborator() {
    const { EventHandler, alertActions, loggedInUserRole } = this.props;
    if (!loggedInUserRole || loggedInUserRole.name !== 'ADMIN') {
      alertActions.addAlert({ type: 'error', message: 'Your account role does not allow you to add a collaborator to this account' });
      return;
    }
    this.setState({ showSidePanel: true, sidePanel: (<NewCollaborator onCloseSidePanel={this.onCloseSidePanel} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onView(collaborator) {
    const { roles } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<ViewCollaborator onCloseSidePanel={this.onCloseSidePanel} collaborator={collaborator} roles={roles} />) });
  }

  onEdit(collaborator) {
    const { EventHandler, alertActions, roles, collaboratorsActions, loggedInUserRole } = this.props;
    if (!loggedInUserRole || loggedInUserRole.name !== 'ADMIN') {
      alertActions.addAlert({ type: 'error', message: 'Your account role does not allow you to update collaborator details in this account' });
      return;
    }
    this.setState({ showSidePanel: true, sidePanel: (<EditCollaborator onCloseSidePanel={this.onCloseSidePanel} collaborator={collaborator} loggedInUserRole={loggedInUserRole} roles={roles} collaboratorsActions={collaboratorsActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false, sidePanel: null });
  }

  async fetchCollaborators() {
    const { collaboratorsActions, EventHandler } = this.props;
    this.setState({ isFetchingCollaborators: true });
    try {
      const fetchCollaboratorsResult = await collaboratorsActions.fetchCollaborators();
      collaboratorsActions.removeCollaborators();
      collaboratorsActions.addCollaborators(fetchCollaboratorsResult.data.Data);
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingCollaborators: false });
      EventHandler.trackEvent({ category: 'Collaborators', action: 'fetch collaborators' });
    }
  }

  render() {
    const { isFetchingCollaborators, isCollaboratorActive, selectedTab, showSidePanel, sidePanel } = this.state;
    const { roles, collaborators, alertActions, user, EventHandler, collaboratorsActions, dispatch, loggedInUserRole } = this.props;
    return (
      <SettingsNavigationContainer
        topRightComponent={(<TabMenu tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} style={{ backgroundColor: 'inherit', borderBottom: 'none' }} />  )}
        sidePanel={showSidePanel ? sidePanel : null}
        EventHandler={EventHandler}
      >
        <CircularButton className="primary cta" style={{ position: 'fixed', top: 115, right: 20, zIndex: 1 }} icon="add" color="#002366" onClick={this.onAddCollaborator} />
        {
          isFetchingCollaborators ? (
            <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={2} />
              <span style={{ margin: 20 }}>Loading collaborators</span>
            </div>
          ) : !collaborators.length ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
              <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>There are no collaborators</h2>
              <ActionButton className="primary" large icon="add" text="Add Collaborator" onClick={this.onAddCollaborator} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <Container fluid style={{ margin: 0, padding: 0 }}>
                <Row style={{ margin: 0, padding: 0 }}>
                  {
                    collaborators.filter((collaborator) => collaborator.active === isCollaboratorActive).map((collaborator) => (
                      <Collaborator key={collaborator.id} collaborator={collaborator} loggedInUserRole={loggedInUserRole} onView={this.onView} onEdit={this.onEdit} collaboratorsActions={collaboratorsActions} alertActions={alertActions} dispatch={dispatch} user={user} roles={roles} EventHandler={EventHandler} />
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

export default withAuthentication(Collaborators);
