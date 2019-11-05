import axios from 'axios';
import socketIOClient from 'socket.io-client/lib';
import moment from 'moment';

import config from 'Config';
import * as ConversationActionTypes from './constants';

export function unMount() {
  return {
    type: ConversationActionTypes.UNMOUNT_CONVERSATIONS,
  };
}

export function setConversations(conversations) {
  return {
    type: ConversationActionTypes.SET_CONVERSATIONS,
    conversations,
  };
}

export function addNewConversation(conversation) {
  return {
    type: ConversationActionTypes.ADD_NEW_CONVERSATION,
    conversation,
  };
}

export function setMoreConversations(conversations) {
  return {
    type: ConversationActionTypes.SET_MORE_CONVERSATIONS,
    conversations,
  };
}

export function resetUnreadMessagesCount(conversationIdx) {
  return {
    type: ConversationActionTypes.RESET_UNREAD_MESSAGES_COUNT,
    conversationIdx,
  };
}

export function fetchConversations(platformId = 1, limit = 10, offset = 0, searchTerm = '') {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    const url = searchTerm ? `${config.api.url}/convo?limit=${limit}&offset=${offset}&search=${searchTerm}` : `${config.api.url}/convo?limit=${limit}&offset=${offset}`;

    return axios({
      url,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchConversation(participantId, limit = 15, offset = 0) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    return axios({
      method: 'GET',
      url: `${
        config.api.url
      }/convo/${participantId}/chats?limit=${limit}&offset=${offset}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function sendMessage({ message, participantId }) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    const response = await axios({
      method: 'POST',
      url: `${config.api.url}/convo/sendmessage`,
      data: {
        chatType: 'CONVO',
        from: user.id,
        to: participantId,
        message,
      },
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });

    if (response.data.data.Data) {
      const payload = {
        body: message,
        participantId,
        createDate: moment().format(),
        id: response.data.data.Data.id,
        originatedFrom: 'USER',
      };
      const socket = socketIOClient(config.socket.url);
      socket.emit('newConvoMessageSent', payload);
    }

    return response;
  };
}

export function newConversation({ message, commId }) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    const response = await axios({
      method: 'POST',
      url: `${config.api.url}/convo/newconversation`,
      data: {
        chatType: 'CONVO',
        from: user.id,
        to: commId,
        message,
      },
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });

    if (response.data.data.Data.id) {
      const participantId = response.data.data.Data.id;
      const createDate = moment().format();
      const payload = {
        message: {
          id: 1,
          body: message,
          createDate,
        },
        npsScore: null,
        unreadMessagesCount: 0,
        participant: {
          id: participantId,
          commId,
          name: '',
        },
        messages: [{
          body: message,
          participantId,
          createDate,
          id: participantId,
          originatedFrom: 'USER',
        }],
      };
      const socket = socketIOClient(config.socket.url);
      socket.emit('newConvoConversationSent', payload);
    }
    return response;
  };
}

export function createIssue({ messageId, participantId }) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    return axios({
      method: 'POST',
      url: `${config.api.url}/convo/${participantId}/issues`,
      data: {
        startChatActivityId: messageId,
      },
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function resolveIssue({ issueId, messageId, participantId }) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    return axios({
      method: 'PUT',
      url: `${config.api.url}/convo/${participantId}/issues/${issueId}`,
      data: {
        status: 'RESOLVED',
        endChatActivityId: messageId,
      },
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
      },
    });
  };
}
