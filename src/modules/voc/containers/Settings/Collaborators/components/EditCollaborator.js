/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class EditCollaborator extends Component {
  static propTypes = {
    collaborator: PropTypes.object,
    roles: PropTypes.array,
    alertActions: PropTypes.object,
    collaboratorsActions: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
    EventHandler: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const { collaborator } = props;
    this.state = {
      isUpdatingUser: false,
      isTogglingStatus: false,
      roleId: collaborator.roleId,
    };

    this.onRoleChanged = this.onRoleChanged.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onToggleStatus = this.onToggleStatus.bind(this);
  }

  onRoleChanged(e, { name, value }) {
    const { EventHandler } = this.props;
    this.setState({ [name]: value });
    EventHandler.trackEvent({ category: 'Collaborators', action: 'changed role', value });
  }

  async onUpdate() {
    this.setState({ isUpdatingUser: true });
    const { collaborator, collaboratorsActions, alertActions, EventHandler, onCloseSidePanel } = this.props;
    const { roleId } = this.state;
    const updatedCollaborator = { ...JSON.parse(JSON.stringify(collaborator)), roleId };
    try {
      await collaboratorsActions.updateCollaborator(collaborator.id, roleId);
      collaboratorsActions.updateCollaboratorInStore(updatedCollaborator);
      alertActions.addAlert({ type: 'success', message: `Successfully updated ${collaborator.firstName}'s role...` });
      EventHandler.trackEvent({ category: 'Collaborators', action: 'update collaborator', value: true });
      onCloseSidePanel();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'Collaborators', action: 'update collaborator', value: false });
    } finally {
      this.setState({ isUpdatingUser: false });
      EventHandler.trackEvent({ category: 'Collaborators', action: 'updated role' });
    }
  }

  async onToggleStatus() {
    const { collaborator, collaboratorsActions, alertActions, EventHandler, onCloseSidePanel } = this.props;
    this.setState({ isTogglingStatus: true });
    const updatedCollaborator = { ...JSON.parse(JSON.stringify(collaborator)), active: !collaborator.active };

    try {
      await collaboratorsActions.toggleCollaboratorStatus(collaborator);
      collaboratorsActions.removeCollaborator(updatedCollaborator);
      alertActions.addAlert({ type: 'success', message: collaborator.active ? `Successfully deactivated ${collaborator.firstName}...` : `Successfully activated ${collaborator.firstName}` });
      EventHandler.trackEvent({ category: 'Collaborators', action: 'toggle active status', value: true });
      onCloseSidePanel();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'Collaborators', action: 'toggle active status', value: false });
    } finally {
      this.setState({ isTogglingStatus: false });
    }
  }

  render() {
    const { collaborator, roles, onCloseSidePanel } = this.props;
    const { isUpdatingUser, isTogglingStatus, roleId } = this.state;
    const colorMix = stringToHexColor(`${collaborator.firstName} ${collaborator.lastName}`);

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Edit Collaborator</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(`${collaborator.firstName} ${collaborator.lastName}`)}</div>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>
                {collaborator.firstName}
                &nbsp;{collaborator.lastName}
              </span>
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%' }}>
              <Dropdown
                placeholder="Select Role"
                search
                selection
                value={roleId}
                name="roleId"
                onChange={this.onRoleChanged}
                options={roles.filter((role) => (['ADMIN', 'COLLABORATOR'].includes(role.name))).map((role) => ({
                  key: role.id,
                  value: role.id,
                  text: role.name,
                }))}
                style={{ width: 440, maxWidth: '100%', marginRight: 5, backgroundColor: '#fafbfc' }}
              />
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
            <ActionButton className="primary" type="submit" large icon="edit" text="Update Role" disabled={isUpdatingUser} loading={isUpdatingUser} onClick={this.onUpdate} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>

        <div style={{ padding: '0 10px 0 10px', position: 'absolute', bottom: 80, width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
            <ActionButton className="primary" type="submit" large text={collaborator.active ? 'Deactivate' : 'Activate'} disabled={isTogglingStatus} loading={isTogglingStatus} onClick={this.onToggleStatus} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>
      </div>
    );
  }
}
