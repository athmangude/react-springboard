import axios from 'axios';
import config from 'Config';

export async function replyToComment(commentId, comment) {
  return axios({
    url: `${config.api.url}/surveys/${commentId}/respond-to-survey-response`,
    method: 'POST',
    withCredentials: false,
    data: comment,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}

export async function commentOnChart(chartId, comment) {
  return axios({
    url: `${config.api.url}/surveys/${chartId}/comments`,
    method: 'POST',
    withCredentials: false,
    data: comment,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}

export async function fetchSurveyResponseComments(surveyResponseId) {
  return axios({
    url: `${config.api.url}/surveys/survey-responses/${surveyResponseId}/responses`,
    method: 'GET',
    withCredentials: false,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}

export async function fetchSurveyQuestionComments(questionId) {
  return axios({
    url: `${config.api.url}/surveys/${questionId}/comments`,
    method: 'GET',
    withCredentials: false,
    headers: {
      'x-account-id': user['x-account-id'],
    },
  });
}
