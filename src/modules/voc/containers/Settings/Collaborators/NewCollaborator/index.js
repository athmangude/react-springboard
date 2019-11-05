/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input } from 'formsy-semantic-ui-react';
import Formsy from 'formsy-react';

import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';

import * as collaboratorsActions from '../flux/actions';
import * as rolesActions from '../../Roles/flux/actions';

import MwambaFormError from 'SharedComponents/mwamba-form-error';

import './index.css';

const callBackUrl = window.location.origin.concat('/complete-registration/');

@connect((state) => ({
  user: state.authentication.user,
  roles: state.roles.items,
}),
(dispatch) => ({
  collaboratorsActions: bindActionCreators(collaboratorsActions, dispatch),
  rolesActions: bindActionCreators(rolesActions, dispatch),
  dispatch,
}))
export default class Collaborators extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    roles: PropTypes.array,
    user: PropTypes.object,
    EventHandler: PropTypes.object,
    collaboratorsActions: PropTypes.object,
    alertActions: PropTypes.object,
    rolesActions: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      user: {
        accountId: props.user['x-account-id'],
        callBackUrl,
        country: null,
        email: null,
        roleId: null,
      },
      isFormValid: false,
      isCreatingCollaborator: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onCreateCollaborator = this.onCreateCollaborator.bind(this);
    this.onFormValid = this.onFormValid.bind(this);
    this.onFormInvalid = this.onFormInvalid.bind(this);
    this.fetchRoles = this.fetchRoles.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
  }

  componentDidMount() {
    this.fetchRoles();
  }

  onFormValid() {
    this.setState({ isFormValid: true });
  }

  onFormInvalid() {
    this.setState({ isFormValid: false });
  }

  async onCreateCollaborator() {
    this.setState({ isCreatingCollaborator: true });
    const { EventHandler, collaboratorsActions, alertActions } = this.props;
    const { onCloseSidePanel, user } = this.props;
    const account = user.accounts.find((account) => account.id === user['x-account-id']);
    const country = user.countries.find((country) => country.id === account.countryId);

    const aUser = { ...this.state.user, country: country.id };

    try {
      const addCollaboratorResult = await collaboratorsActions.createCollaborator(aUser);
      this.form.reset();
      alertActions.addAlert({ type: 'success', message: addCollaboratorResult.data.Data });
      EventHandler.trackEvent({ category: 'Collaborators', action: 'add collaborator', value: true });
      onCloseSidePanel();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'Collaborators', action: 'add collaboratos', value: false });
    } finally {
      this.setState({ isCreatingCollaborator: false });
    }
  }

  async fetchRoles() {
    const { rolesActions, EventHandler } = this.props;
    try {
      const fetchRolesResult = await rolesActions.fetchRoles();
      rolesActions.addRoles(fetchRolesResult.data.data.Data);
    } catch (exception) {
      EventHandler.handleException(exception);
    }
  }

  handleChange(e) {
    const { user } = this.state;
    this.setState({
      user: { ...user, [e.target.name]: e.target.value },
    });
  }

  handleRoleChange(e, { name, value }) {
    const { user } = this.state;
    this.setState({
      user: { ...user, [name]: value },
    });
  }

  render() {
    const { roles, onCloseSidePanel } = this.props;
    const { user, isCreatingCollaborator, isFormValid } = this.state;
    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Add Collaborator</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div>
          <Formsy ref={(form) => { this.form = form; }} action="#" onValid={this.onFormValid} onInvalid={this.onFormInvalid} onValidSubmit={this.onCreateCollaborator}>
            <div>
              <div style={{ width: '100%', position: 'relative' }}>
                <Input
                  name="email"
                  value={user.email}
                  onChange={this.handleChange}
                  placeholder="email"
                  required
                  validations={{ isExisty: true, isEmail: true }}
                  validationErrors={{ isAlpha: 'only alphabetic characters are allowed', isExisty: 'This field is required', isEmail: 'not a valid email' }}
                  style={{ width: '100%', border: 'none', padding: '10px 5px', margin: '10px 0 0', position: 'relative' }}
                  className="input"
                  errorLabel={(
                    <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                  )}
                />
              </div>
              <div style={{ margin: '20px 5px 0 5px' }}>
                <Dropdown
                  placeholder="Select Role"
                  fluid
                  search
                  selection
                  name="roleId"
                  value={user.roleId}
                  onChange={this.handleRoleChange}
                  options={roles.filter((role) => ['ADMIN', 'COLLABORATOR'].includes(role.name)).map((role) => ({
                    key: role.id,
                    value: role.id,
                    text: role.name,
                  }))}
                />
              </div>
              <MwambaFormError name="roleId" value={user.roleId} rules={['required']} updateFormState={this.updateFormState} />
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
              <ActionButton className="primary" type="submit" large icon="person_add" text="Add Collaborator" loading={isCreatingCollaborator} disabled={!isFormValid || isCreatingCollaborator} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          </Formsy>
        </div>
      </div>
    );
  }
}
