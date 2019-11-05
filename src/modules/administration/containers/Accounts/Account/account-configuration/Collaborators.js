/* eslint-disable radix, no-return-assign, no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import Spinner from 'react-spinner-material';

import TabMenu from '../TabMenu';
import Input from 'SharedComponents/mwamba-input';
import Select from 'SharedComponents/mwamba-dropdown-select';
import ActionButton from 'SharedComponents/action-button';
import CircularButton from 'SharedComponents/circular-button';
import CollaboratorListItem from './CollaboratorListItem';

const callBackUrl = window.location.origin.concat('/complete-registration/');

const tabs = [{ label: 'Active' }, { label: 'Disabled' }];

export default class Collaborators extends Component {
  static propTypes = {
    adminAuthentication: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onCreateAccount = this.onCreateAccount.bind(this);
    this.onFormValid = this.onFormValid.bind(this);
    this.onFormInvalid = this.onFormInvalid.bind(this);
    this.onInvalidSubmit = this.onInvalidSubmit.bind(this);
    this.onActiveChanged = this.onActiveChanged.bind(this);
    this.onLNMChanged = this.onLNMChanged.bind(this);
    this.onRoleChanged = this.onRoleChanged.bind(this);
    this.onFetchCollaborators = this.onFetchCollaborators.bind(this);
    this.onToggleCollaborators = this.onToggleCollaborators.bind(this);
    this.onTabSelected = this.onTabSelected.bind(this);
  }

  state = {
    isCreatingAccount: false,
    isFetchingConfiguration: false,
    isUpdatingConfiguration: false,
    showCollaborators: true,
    collaborators: [],
    isFetchingCollaborators: false,
    selectedTab: 'Active',
    isCollaboratorActive: true,
    form: {
      country: 'KE',
      email: '',
      roleId: 2,
      callBackUrl,
    },
    roles: [],
  }

  async componentDidMount() {
    await this.fetchRoles();
    this.onFetchCollaborators(true);
  }

  onUpdateSettings() {

  }

  onActiveChanged(active) {
    this.setState({ form: { ...this.state.form, active } });
  }

  onLNMChanged(lnm) {
    this.setState({ form: { ...this.state.form, lnm } });
  }

  onRoleChanged(change) {
    this.setState({ form: { ...this.state.form, roleId: change.value } });
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({ form: { ...this.state.form, startDate, endDate } });
  }

  onFormValid() {
    this.setState({ formValid: true });
  }

  onFormInvalid() {
    this.setState({ formValid: false });
  }

  async onFetchCollaborators(showLoading) {
    this.setState({ isFetchingCollaborators: showLoading });
    try {
      const fetchCollaboratorsResult = await this.props.accountsActions.fetchCollaborators(this.props.accountDetails.id);
      this.setState({ collaborators: fetchCollaboratorsResult.data.Data });
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingCollaborators: false });
    }
  }

  async onCreateAccount() {
    this.setState({ isCreatingAccount: true });

    try {
      const accountDetails = { ...this.state.form };
      accountDetails.accountId = this.props.accountDetails.id;
      accountDetails.country = this.props.accountDetails.country;
      const createCollaboratorResult = await this.props.accountsActions.createCollaborator(this.props.accountDetails.id, accountDetails);
      this.props.alertActions.addAlert({ type: 'success', message: createCollaboratorResult.data.Data || 'The collaborator was created successfully' });
      this.onToggleCollaborators();
      this.onFetchCollaborators(true);
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isCreatingAccount: false });
    }
  }

  onInvalidSubmit() {
    this.setState({ formValid: false });
  }

  onToggleCollaborators() {
    this.setState({ showCollaborators: !this.state.showCollaborators });
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab }, () => {
      selectedTab === 'Active' ? this.setState ({ isCollaboratorActive : true }) : this.setState ({ isCollaboratorActive: false });
    });
  }

  handleChange(event) {
    this.setState({ form: { ...this.state.form, [event.target.name]: event.target.value } });
  }

  async fetchRoles() {
    const { accountsActions, EventHandler, accountDetails } = this.props;
    try {
      const fetchRolesResult = await accountsActions.fetchRoles(accountDetails.id);
      const roles = fetchRolesResult.data.data.Data;
      this.setState({ roles });
    } catch (exception) {
      EventHandler.handleException(exception);
    }
  }

  render() {
    const { countries } = this.props.adminAuthentication.admin;
    const { selectedTab, isCollaboratorActive, collaborators, showCollaborators, isFetchingCollaborators, roles } = this.state;

    return (
      <div style={{ width: '100%' }}>
        <TabMenu tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} />
        {
          showCollaborators ? (
            <CircularButton className="primary cta" style={{ position: 'fixed', top: 83, right: 20, zIndex: 1 }} icon="add" color="#002366" onClick={this.onToggleCollaborators} />
          ) : (
            <CircularButton className="primary cta" style={{ position: 'fixed', top: 83, right: 20, zIndex: 1 }} icon="close" color="#002366" onClick={this.onToggleCollaborators} />
          )
        }
        {
          isFetchingCollaborators ? (
            <div style={{ height: 200, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <Spinner spinnerColor="#002366" size={50} spinnerWidth={4} />
              <span style={{ margin: 20 }}>Fetching Collaborators</span>
            </div>
          ) : showCollaborators && collaborators.length ? (
            <div style={{ width: '100%', position: 'relative' }}>
              <div className="account-list-item" style={{ width: '100%', borderBottom: 'solid 1px #d9d9d9', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: this.state.isMouseOver ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                  <span>Name</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                  <span>Username</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                  <span>E-mail</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                  <span>Last Login</span>
                </div>
              </div>
              {
                collaborators.filter((collaborator) => collaborator.active === isCollaboratorActive).map((collaborator) => (
                  <CollaboratorListItem collaborator={collaborator} roles={roles} accountsActions={this.props.accountsActions} onFetchCollaborators={this.onFetchCollaborators} onToggleCollaborators={this.onToggleCollaborators} alertActions={this.props.alertActions} EventHandler={this.props.EventHandler} accountDetails={this.props.accountDetails} />
                ))
              }
            </div>
          ) : showCollaborators && !collaborators.length ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
              <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>You have not added collaborators</h2>
              <p style={{ textAlign: 'center' }}>Add collaborators to enable customers to access their account</p>
              <ActionButton className="primary" large icon="add" text="Add Collaborator" onClick={this.onToggleCollaborators} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          ) : (
            <Formsy ref={(form) => this.form = form} action="#" onValid={this.onFormValid} onInvalid={this.onFormInvalid} onValidSubmit={this.onCreateAccount} onInvalidSubmit={this.onInvalidSubmit}>
              <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '10px 3px' }}>
                <small>Role</small>
                <Select
                  options={[{ label: 'Collaborator', value: 1 }, { label: 'Admin', value: 2 }]}
                  value={this.state.form.roleId}
                  onChange={this.onRoleChanged}
                />
              </div>
              <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '10px 3px' }}>
                <small>Email</small>
                <Input
                  name="email"
                  type="email"
                  value={this.state.form.email}
                  onChange={this.handleChange}
                  placeholder="Email"
                  required
                  validations={{ isExisty: true, isEmail: true }}
                  validationErrors={{ isExisty: 'This field is required', isEmail: 'invalid email', isDefaultRequiredValue: 'required' }}
                  style={{ width: '100%', padding: '10px 5px', margin: '10px 0 0', position: 'relative' }}
                  className="input"
                />
              </div>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ActionButton type="submit" className="primary" text="Submit" disabled={!this.state.formValid || this.state.isCreatingAccount} loading={this.state.isCreatingAccount} large style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
              </div>
            </Formsy>
          )
        }
      </div>
    );
  }
}
