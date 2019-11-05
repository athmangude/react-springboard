/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import axios from 'axios';

import config from 'Config';
import * as AODReportActionsTypes from './constants';

export function setAODData(id, data) {
  return {
    type: AODReportActionsTypes.SET_AOD_DATA,
    id,
    data,
  };
}

export function setSurveyDataTable(id, datatable) {
  return {
    type: AODReportActionsTypes.SET_SURVEY_DATA_TABLE,
    id,
    data: { datatable },
  };
}

export function setSurveyQuestions(id, responseStats) {
  return {
    type: AODReportActionsTypes.SET_SURVEY_QUESTIONS,
    id,
    responseStats,
  };
}

export function clearAODReports() {
  return {
    type: AODReportActionsTypes.CLEAR_AOD_REPORTS,
  };
}

export function fetchAODData(authentication, id) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      url: `${config.api.url}/surveys/${id}/responses`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchAODDataV2(surveyId, dates, clickFilters = {}) {  
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    let dateFiltersPrams = '';
    let clickFiltersPrams = '';

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    if(Object.keys(clickFilters).length) {
      clickFilters.forEach((clickFilter) => {
        Object.keys(clickFilter).forEach((key) => {
          clickFiltersPrams += clickFilter[key] ? `${key}=${clickFilter[key]}&` : '';
        });
      });
    }

    let paramFilters = dateFiltersPrams.concat(clickFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    if (user && !Number.isNaN(surveyId)) {
      return axios({
        url: `${config.api.url}/surveys/${surveyId}/metrics?${paramFilters}`,
        method: 'GET',
        withCredentials: false,
        headers: {
          'x-account-id': user['x-account-id'],
          authorization: `Bearer ${user.token}`,
        },
      });
    }

    return axios({
      url: `${config.api.url}/surveys/shared-link/${surveyId}/metrics?${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': 3,
      },
    });
  };
}

export function fetchSurveyDataTable(authentication, id, page = 1, perPage = 10, date) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      method: 'GET',
      url: `${config.api.url}/surveys/${id}/data-table?limit=${perPage}&offset=${perPage * (page - 1)}&startDate=${date.startDate}&endDate=${date.endDate}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchSurveyQuestionComments(questionId, dates) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    // Remove the trailing &
    dateFiltersPrams = dateFiltersPrams.substring(0, dateFiltersPrams.length - 1);

    if (user) {
      return axios({
        url: `${config.api.url}/surveys/${questionId}/comments?${dateFiltersPrams}`,
        method: 'GET',
        withCredentials: false,
        headers: {
          'x-account-id': user['x-account-id'],
          authorization: `Bearer ${user.token}`,
        },
      });
    }

    return axios({
      url: `${config.api.url}/surveys/shared-link/${questionId}/comments?${dateFiltersPrams}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': 3,
        // authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function requestDownload(authentication, surveyId, participantStatFilters = {}, date) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    const data = {
      ...participantStatFilters,
      startDate: date.startDate,
      endDate: date.endDate,
    };

    return axios({
      method: 'POST',
      url: `${config.api.url}/surveys/${surveyId}/data-download`,
      data,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function pollDownloadProgress(authentication, surveyId, requestId) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      url: `${config.api.url}/surveys/${surveyId}/requests/${requestId}/data-download`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchSurveyQuestionResponses(surveyId, questionId, pagination, dates = {}) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    let dateFiltersPrams = '';
    let paginationParams = '';

    Object.keys(pagination).forEach((key) => {
      paginationParams += pagination[key] ? `${key}=${pagination[key]}&` : '';
    });

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    let paramFilters = dateFiltersPrams.concat(paginationParams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    if (user && !Number.isNaN(surveyId)) {
      return axios({
        url: `${config.api.url}/surveys/${surveyId}/questions/${questionId}/responses?${paramFilters}`,
        method: 'GET',
        withCredentials: false,
        headers: {
          'x-account-id': user['x-account-id'],
          authorization: `Bearer ${user.token}`,
        },
      });
    }

    return axios({
      url: `${config.api.url}/surveys/shared-link/${surveyId}/questions/${questionId}/responses?${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': 3,
      },
    });
  };
}

export function fetchSurveyQuestions(surveyId, dates = {}, clickFilters) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    let dateFiltersPrams = '';
    let clickFiltersPrams = '';

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    clickFilters.forEach((clickFilter) => {
      Object.keys(clickFilter).forEach((key) => {
        clickFiltersPrams += clickFilter[key] ? `${key}=${clickFilter[key]}&` : '';
      });
    });

    let paramFilters = dateFiltersPrams.concat(clickFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    if (user && !Number.isNaN(surveyId)) {
      return axios({
        url: `${config.api.url}/surveys/${surveyId}/questions?${paramFilters}`,
        method: 'GET',
        withCredentials: false,
        headers: {
          'x-account-id': user['x-account-id'],
          authorization: `Bearer ${user.token}`,
        },
      });
    }

    return axios({
      url: `${config.api.url}/surveys/shared-link/${surveyId}/questions?${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': 3,
      },
    });
  };
}
