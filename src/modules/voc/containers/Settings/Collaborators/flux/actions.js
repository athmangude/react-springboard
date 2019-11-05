import axios from 'axios';

import * as CollaboratorActionTypes from './constants';
import config from 'Config';

export function addCollaborators(collaborators) {
  return {
    type: CollaboratorActionTypes.ADD_COLLABORATORS,
    collaborators,
  };
}

export function updateCollaboratorInStore(collaborator) {
  return {
    type: CollaboratorActionTypes.UPDATE_COLLABORATOR,
    collaborator,
  };
}

export function removeCollaborator(collaborator) {
  return {
    type: CollaboratorActionTypes.REMOVE_COLLABORATOR,
    collaborator,
  };
}

export function removeCollaborators() {
  return {
    type: CollaboratorActionTypes.REMOVE_COLLABORATORS,
  };
}

export function createCollaborator(collaborator) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'POST',
      url: `${config.api.url}/accounts/${user['x-account-id']}/users`,
      withCredentials: false,
      data: collaborator,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchCollaborators() {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/accounts/${user['x-account-id']}/users`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function toggleCollaboratorStatus(collaborator) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/accounts/${user['x-account-id']}/users/${collaborator.id}/roles/${collaborator.roleId}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function updateCollaborator(collaboratorId, roleId) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/accounts/${user['x-account-id']}/users/${collaboratorId}`,
      withCredentials: false,
      data: {
        roleId,
      },
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
