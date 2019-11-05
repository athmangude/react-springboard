/* eslint-disable no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

import IconButton from 'SharedComponents/icon-button';
import ActionButton from 'SharedComponents/action-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

const roles = [{ label: 'COLLABORATOR', value: 1 }, { label: 'ADMIN', value: 2 }];

export default class EditCollaboratorSidePanel extends Component {
  static propTypes = {
    onCloseSidePanel: PropTypes.func.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const { collaborator } = this.props;
    this.state = {
      form: {
        roleId: collaborator.roleId,
      },
      isUpdating: false,
      isToggling: false,
    };
    this.onRoleChanged = this.onRoleChanged.bind(this);
    this.updateCollaborator = this.updateCollaborator.bind(this);
    this.toggleCollaborator = this.toggleCollaborator.bind(this);
  }

  onRoleChanged(e, { name, value }) {
    this.setState({ form: { ...this.state.form, roleId: value } });
  }

  async updateCollaborator() {
    const {
      accountsActions,
      accountDetails,
      collaborator,
      alertActions,
      onFetchCollaborators,
      onCloseSidePanel,
      EventHandler,
    } = this.props;
    const { form } = this.state;

    this.setState({ isUpdating: true });

    try {
      const updateCollaboratorResult = await accountsActions.updateCollaborator(accountDetails.id, collaborator.id, form.roleId);
      alertActions.addAlert({ type: 'success', message: updateCollaboratorResult.data.data.Metadata.message || 'The collaborator was updated successfully' });
      onFetchCollaborators(false);
      onCloseSidePanel();
    } catch (exception) {
      EventHandler.handleException(exception);
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isUpdating: false });
    }
  }

  async toggleCollaborator() {
    const {
      accountsActions,
      accountDetails,
      collaborator,
      alertActions,
      onFetchCollaborators,
      onCloseSidePanel,
      EventHandler,
    } = this.props;
    const { form } = this.state;

    this.setState({ isToggling: true });

    try {
      const toggleCollaboratorResult = await accountsActions.toggleCollaborator(accountDetails.id, collaborator.id, form.roleId);
      alertActions.addAlert({ type: 'success', message: toggleCollaboratorResult.data.data.Metadata.message || 'The collaborator was updated successfully' });
      onFetchCollaborators(false);
      onCloseSidePanel();
    } catch (exception) {
      EventHandler.handleException(exception);
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isToggling: false });
    }
  }

  render() {
    const { collaborator, onCloseSidePanel } = this.props;
    const { form, isUpdating, isToggling } = this.state;
    const colorMix = stringToHexColor(`${collaborator.firstName} ${collaborator.lastName}`);
    return (
      <div style={{ height: '100%' }}>
        <div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
          <div style={{ width: '100%', height: 63, backgroundColor: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
            <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Update Collaborator</h2>
            <IconButton icon="close" onClick={onCloseSidePanel} />
          </div>
          <div style={{ padding: 10, height: 'calc(100% - 63px)', overflowY: 'auto' }}>
            <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottom: '1px solid #6d6e71' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(`${collaborator.firstName} ${collaborator.lastName}`)}</div>
                <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>
                  {collaborator.firstName}
                  &nbsp;
                  {collaborator.lastName}
                </span>
              </div>
            </div>
            <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '10px 3px' }}>
              <Dropdown
                placeholder="Select Role"
                search
                selection
                value={form.roleId}
                name="roleId"
                onChange={this.onRoleChanged}
                options={roles.filter((role) => (['ADMIN', 'COLLABORATOR'].includes(role.label))).map((role) => ({
                  key: role.value,
                  value: role.value,
                  text: role.label,
                }))}
                style={{ width: 440, maxWidth: '100%', marginRight: 5, backgroundColor: '#fafbfc' }}
              />
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ActionButton type="submit" className="primary" text="Update" disabled={isUpdating} loading={isUpdating} onClick={this.updateCollaborator} large style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          </div>
          <div style={{ padding: '0px 10px', position: 'absolute', bottom: '80px', width: '100%' }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ActionButton type="submit" className="primary" text={(collaborator.active) ? 'Deactivate' : 'Activate'} disabled={isToggling} loading={isToggling} onClick={this.toggleCollaborator} large style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
