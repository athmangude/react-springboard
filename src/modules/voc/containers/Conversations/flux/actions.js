/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, no-unneeded-ternary */
import axios from 'axios';

import config from 'Config';
import * as ConversationActionTypes from './constants';

export function setConversations(conversations, conversationType) {
  return {
    type: ConversationActionTypes.SET_CONVERSATIONS,
    conversations,
    conversationType,
  };
}

export function removeConversations() {
  return {
    type: ConversationActionTypes.REMOVE_CONVERSATIONS,
  };
}

export function removeConversation(conversationId, listType) {
  return {
    type: ConversationActionTypes.REMOVE_CONVERSATION,
    conversationId,
    listType,
  };
}

export function fetchConversations(page = 1, type = 'ACTIVE', limit = 10, perPage = 12, segment = false) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;

    let url = `${config.api.url}/surveys?type=${type}&limit=${perPage}&offset=${perPage * (page - 1)}`;

    if(segment) {
      url = `${config.api.url}/surveys?type=${type}&limit=${perPage}&offset=${perPage * (page - 1)}&segment=${segment}`
    }
    
    return axios({
      method: 'GET',
      url,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function searchSurveys(searchTerm, accountId = null, type = 'ACTIVE', page = 1, limit = 10, perPage = 12) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/surveys?type=${type}&limit=${perPage}&offset=${perPage * (page - 1)}&search=${searchTerm}`,
      withCredentials: false,
      headers: {
        'x-account-id': accountId ? accountId : user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function createConversation(conversation /* , logAction = false */) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'POST',
      url: `${config.api.url}/surveys`,
      data: conversation,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchConversation(conversationId) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'GET',
      url: `${config.api.url}/surveys/${conversationId}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function activateConversation(id, sendNow = false) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/surveys/${id}/activate?sendNow=${sendNow}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function toggleConversation(conversationId, status) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/surveys/${conversationId}/toggle?status=${status}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function deleteConversation(id) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'DELETE',
      url: `${config.api.url}/surveys/${id}/delete`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function duplicateConversation(id) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'POST',
      url: `${config.api.url}/surveys/${id}/duplicate`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function updateConversation(conversation, id, logAction = false) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'PUT',
      url: `${config.api.url}/surveys/${id}`,
      data: { ...conversation, logAction },
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function sendToAudience(panelId, filters = {}, conversationId) { // TODO: fix this problem eslint-disable-line no-unused-vars
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'POST',
      url: `${config.api.url}/surveys/${conversationId}/push-to-panel`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function sendToPanel(conversationId, data) { // TODO: fix this problem eslint-disable-line no-unused-vars
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      method: 'POST',
      url: `${config.api.url}/surveys/${conversationId}/send-to-panel`,
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
