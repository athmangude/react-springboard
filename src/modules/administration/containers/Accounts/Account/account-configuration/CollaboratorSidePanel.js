/* eslint-disable no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditCollaborator from './EditCollaborator';
import ViewCollaborator from './ViewCollaborator';

export default class CollaboratorSidePanel extends Component {
  static propTypes = {
    showSidePanel: PropTypes.bool.isRequired,
    onCloseSidePanel: PropTypes.func.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    panel: PropTypes.string.isRequired,
    collaborator: PropTypes.object.isRequired,
    onFetchCollaborators: PropTypes.func.isRequired,
    accountsActions: PropTypes.object.isRequired,
    accountDetails: PropTypes.object.isRequired,
    roles: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.onUpdateDimensions = this.onUpdateDimensions.bind(this);
  }

  state = {
    windowWidth: window.innerWidth,
  }

  componentDidMount() {
    window.addEventListener('resize', this.onUpdateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onUpdateDimensions);
  }

  onUpdateDimensions() {
    this.setState({
      windowWidth: window.innerWidth,
    });
  }

  render() {
    const {
      showSidePanel,
      panel,
      onCloseSidePanel,
      collaborator,
      onFetchCollaborators,
      accountsActions,
      accountDetails,
      EventHandler,
      alertActions,
      roles,
    } = this.props;
    const { windowWidth } = this.state;
    return (
      <div style={{ height: '100vh', transition: 'width 0.1s', width: !showSidePanel ? 0 : windowWidth > 425 ? 425 : '100vw', overflowY: 'auto', position: 'fixed', right: 0, top: 60, backgroundColor: '#fff', boxShadow: '3px 0 10px rgba(0, 0, 0, 0.6)', zIndex: 1 }}>
        {
          panel === 'view' ? (
            <ViewCollaborator onCloseSidePanel={onCloseSidePanel} collaborator={collaborator} roles={roles} onFetchCollaborators={onFetchCollaborators} showSidePanel={showSidePanel} accountsActions={accountsActions} accountDetails={accountDetails} EventHandler={EventHandler} alertActions={alertActions} />
          ) : panel === 'edit' ? (
            <EditCollaborator onCloseSidePanel={onCloseSidePanel} collaborator={collaborator} onFetchCollaborators={onFetchCollaborators} showSidePanel={showSidePanel} accountsActions={accountsActions} accountDetails={accountDetails} EventHandler={EventHandler} alertActions={alertActions} />
          ) : null
        }
      </div>
    );
  }
}
