import axios from 'axios';
import config from 'Config';

export async function fetchAODData(user, id) {
  return axios({
    url: `${config.api.url}/surveys/${id}/responses`,
    method: 'GET',
    withCredentials: false,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}

export async function fetchAODDataV2(user, id, date) {
  return axios({
    url: `${config.api.url}/surveys/${id}/metrics?startDate=${date.startDate}&endDate=${date.endDate}`,
    method: 'GET',
    withCredentials: false,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}

export async function fetchSurveyDataTable(user, id, page = 1, perPage = 10, date) {
  return axios({
    method: 'GET',
    url: `${config.api.url}/surveys/${id}/data-table?limit=${perPage}&offset=${perPage * (page - 1)}&startDate=${date.startDate}&endDate=${date.endDate}`,
    withCredentials: false,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}

export async function fetchSurveyQuestionComments(user, questionId) {
  return axios({
    url: `${config.api.url}/surveys/${questionId}/comments`,
    method: 'GET',
    withCredentials: false,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}

export async function requestDownload(user, surveyId) {
  return axios({
    method: 'POST',
    url: `${config.api.url}/surveys/${surveyId}/data-download`,
    data: {
      complete: true,
      inProgress: true,
      kickedout: true,
      optedout: true,
      pending: true,
      timedout: true,
    },
    withCredentials: false,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}

export async function pollDownloadProgress(user, surveyId, requestId) {
  return axios({
    url: `${config.api.url}/surveys/${surveyId}/requests/${requestId}/data-download`,
    method: 'GET',
    withCredentials: false,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}
