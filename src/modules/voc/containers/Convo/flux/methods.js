import axios from 'axios';
import config from 'Config';

export async function fetchConversations(user, page = 1, limit = 10, perPage = 10) {
  return axios({
    method: 'GET',
    url: `${config.api.url}/convo?limit=${perPage}&offset=${perPage * (page - 1)}`,
    withCredentials: false,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}

export async function fetchConversation(participantId, user, page = 1, limit = 10, perPage = 10) {
  return axios({
    method: 'GET',
    url: `${config.api.url}/convo/${participantId}/chats?limit=${perPage}&offset=${perPage * (page - 1)}`,
    withCredentials: false,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}

export async function sendMessage({ message, participantId }, user) {
  return axios({
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
    },
  });
}

export async function newConversation({ message, commId }, user) {
  return axios({
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
    },
  });
}


export async function createIssue({ messageId, participantId }, user) {
  return axios({
    method: 'POST',
    url: `${config.api.url}/convo/${participantId}/issues`,
    data: {
      startChatActivityId: messageId,
    },
    withCredentials: false,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}

export async function resolveIssue({ issueId, messageId, participantId }, user) {
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
}

export async function unLoadConversations() {
  return {};
}

export async function unLoadConversation() {
  return {};
}
