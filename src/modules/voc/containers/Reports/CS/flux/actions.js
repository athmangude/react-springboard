/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import axios from 'axios';

import config from 'Config';
import * as CSReportActionTypes from './constants';

export function setAODData(id, data) {
  return {
    type: CSReportActionTypes.SET_AOD_DATA,
    id,
    data,
  };
}

export function setSurveyDataTable(id, datatable) {
  return {
    type: CSReportActionTypes.SET_SURVEY_DATA_TABLE,
    id,
    data: { datatable },
  };
}

export function setNpsMetaDataFilters(id, npsMetaDataFilters) {
  return {
    type: CSReportActionTypes.SET_NPS_METADATA_FILTERS,
    id,
    npsMetaDataFilters,
  };
}

export function setSurveyQuestions(id, responseStats) {
  return {
    type: CSReportActionTypes.SET_SURVEY_QUESTIONS,
    id,
    responseStats,
  };
}

export function clearCSReports() {
  return {
    type: CSReportActionTypes.CLEAR_CS_REPORTS,
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

export function fetchAODDataV2(surveyId, dates, npsFilters, clickFilters) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    let npsFiltersParams = '';
    let dateFiltersPrams = '';
    let clickFiltersPrams = '';

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    Object.keys(npsFilters).forEach((key) => {
      npsFiltersParams += npsFilters[key] ? `${key}=${npsFilters[key]}&` : '';
    });

    clickFilters.forEach((clickFilter) => {
      Object.keys(clickFilter).forEach((key) => {
        clickFiltersPrams += clickFilter[key] ? `${key}=${clickFilter[key]}&` : '';
      });
    });

    let paramFilters = dateFiltersPrams.concat(npsFiltersParams).concat(clickFiltersPrams);

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

export function fetchSurveyQuestionComments(authentication, questionId) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    if (user) {
      return axios({
        url: `${config.api.url}/surveys/${questionId}/comments`,
        method: 'GET',
        withCredentials: false,
        headers: {
          'x-account-id': user['x-account-id'],
          authorization: `Bearer ${user.token}`,
        },
      });
    }

    return axios({
      url: `${config.api.url}/surveys/shared-link/${questionId}/comments`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': 3,
      },
    });
  };
}

export function requestDownload(surveyId, participantStatFilters = {}, date, npsFilters = {}, npsGroupFilters = {}) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    const data = {
      ...participantStatFilters,
      startDate: date.startDate,
      endDate: date.endDate,
    };
    if (Object.keys(npsFilters).length) {
      data.metaDataFilters = npsFilters;
    }
    if (Object.keys(npsGroupFilters).length) {
      data.npsFilters = npsGroupFilters;
    }

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

export function downloadOnPremise(id) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      method: 'GET',
      url: `${config.api.url}/surveys/download/${id}`,
      withCredentials: false,
      responseType: 'blob',
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function pollDownloadProgress(surveyId, requestId) {
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

export function fetchSurveyQuestionResponses(surveyId, questionId, pagination, dates = {}, npsFilters = {}) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    let npsFiltersParams = '';
    let dateFiltersPrams = '';
    let paginationParams = '';

    Object.keys(pagination).forEach((key) => {
      paginationParams += pagination[key] ? `${key}=${pagination[key]}&` : '';
    });

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    Object.keys(npsFilters).forEach((key) => {
      npsFiltersParams += npsFilters[key] ? `${key}=${npsFilters[key]}&` : '';
    });

    let paramFilters = dateFiltersPrams.concat(npsFiltersParams).concat(paginationParams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    if (user && !Number.isNaN(surveyId)) {
      const url = Array.isArray(questionId) ? `${config.api.url}/surveys/${surveyId}/questions/${questionId}/multiple-questions-responses?${paramFilters}` : `${config.api.url}/surveys/${surveyId}/questions/${questionId}/responses?${paramFilters}`;
      return axios({
        url,
        method: 'GET',
        withCredentials: false,
        headers: {
          'x-account-id': user['x-account-id'],
          authorization: `Bearer ${user.token}`,
        },
      });
    }

    const url = Array.isArray(questionId) ? `${config.api.url}/surveys/shared-link/${surveyId}/questions/${questionId}/multiple-questions-responses?${paramFilters}` : `${config.api.url}/surveys/shared-link/${surveyId}/questions/${questionId}/responses?${paramFilters}`;

    return axios({
      url,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': 3,
      },
    });
  };
}

export function fetchNPSMetadataFilters(surveyId) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;

    if (user && !Number.isNaN(surveyId)) {
      return axios({
        url: `${config.api.url}/surveys/${surveyId}/nps-metadata-filters`,
        method: 'GET',
        withCredentials: false,
        headers: {
          'x-account-id': user['x-account-id'],
          authorization: `Bearer ${user.token}`,
        },
      });
    }

    return axios({
      url: `${config.api.url}/surveys/shared-link/${surveyId}/nps-metadata-filters`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': 3,
      },
    });
  };
}

export function fetchSurveyQuestions(surveyId, dates = {}, npsFilters = {}, clickFilters) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    let npsFiltersParams = '';
    let dateFiltersPrams = '';
    let clickFiltersPrams = '';

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    Object.keys(npsFilters).forEach((key) => {
      npsFiltersParams += npsFilters[key] ? `${key}=${npsFilters[key]}&` : '';
    });

    clickFilters.forEach((clickFilter) => {
      Object.keys(clickFilter).forEach((key) => {
        clickFiltersPrams += clickFilter[key] ? `${key}=${clickFilter[key]}&` : '';
      });
    });

    let paramFilters = dateFiltersPrams.concat(npsFiltersParams).concat(clickFiltersPrams);

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

export function fetchNPSTrend(surveyId, questionId, dates = {}, npsFilters = {}, interval) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    let npsFiltersParams = '';
    let dateFiltersPrams = '';
    let intervalParams = '';

    Object.keys(interval).forEach((key) => {
      intervalParams += interval[key] ? `${key}=${interval[key]}&` : '';
    });

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    Object.keys(npsFilters).forEach((key) => {
      npsFiltersParams += npsFilters[key] ? `${key}=${npsFilters[key]}&` : '';
    });

    let paramFilters = dateFiltersPrams.concat(npsFiltersParams).concat(intervalParams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    if (user && !Number.isNaN(surveyId)) {
      return axios({
        url: `${config.api.url}/surveys/${surveyId}/questions/${questionId}/trends?${paramFilters}`,
        method: 'GET',
        withCredentials: false,
        headers: {
          'x-account-id': user['x-account-id'],
          authorization: `Bearer ${user.token}`,
        },
      });
    }

    return axios({
      url: `${config.api.url}/surveys/shared-link/${surveyId}/questions/${questionId}/trends?${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': 3,
      },
    });
  };
}

export function fetchNPSDimensions(surveyId, dimensionKey, dates = {}, npsFilters = {}) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    let npsFiltersParams = '';
    let dateFiltersPrams = '';

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    Object.keys(npsFilters).forEach((key) => {
      npsFiltersParams += npsFilters[key] ? `${key}=${npsFilters[key]}&` : '';
    });

    let paramFilters = dateFiltersPrams.concat(npsFiltersParams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    if (user && !Number.isNaN(surveyId)) {
      return axios({
        url: `${config.api.url}/surveys/${surveyId}/dimensions?dimensionKey=${dimensionKey}&${paramFilters}`,
        method: 'GET',
        withCredentials: false,
        headers: {
          'x-account-id': user['x-account-id'],
          authorization: `Bearer ${user.token}`,
        },
      });
    }

    return axios({
      url: `${config.api.url}/surveys/shared-link/${surveyId}/dimensions?dimensionKey=${dimensionKey}&${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': 3,
      },
    });
  };
}

export function fetchNPSDimensionKeys(surveyId) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    if (user && !Number.isNaN(surveyId)) {
      return axios({
        url: `${config.api.url}/surveys/${surveyId}/dimension-keys`,
        method: 'GET',
        withCredentials: false,
        headers: {
          'x-account-id': user['x-account-id'],
          authorization: `Bearer ${user.token}`,
        },
      });
    }

    return axios({
      url: `${config.api.url}/surveys/shared-link/${surveyId}/dimension-keys`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': 3,
      },
    });
  };
}
