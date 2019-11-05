/* eslint-disable jsx-a11y/href-no-hash */
import axios from 'axios';

import config from 'Config';
import * as CustomerAnalyticsActionTypes from './constants';

export function setSegments(segments) {
  return {
    type: CustomerAnalyticsActionTypes.SET_SEGMENTS,
    segments,
  };
}

export function setFilters(filters) {
  return {
    type: CustomerAnalyticsActionTypes.SET_FILTERS,
    filters,
  };
}

export function setAppliedFilters(appliedFilters) {
  return {
    type: CustomerAnalyticsActionTypes.SET_APPLIED_FILTERS,
    appliedFilters,
  };
}

export function clearAppliedFilters() {
  return {
    type: CustomerAnalyticsActionTypes.CLEAR_APPLIED_FILTERS,
  };
}

export function fetchCustomers(limit = 15, offset = 0, segmentId = null, data, search = '', startTime, endTime, sortBy, sortOrder) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    let paramFilters = `limit=${limit}&offset=${offset}&startTime=${startTime}&endTime=${endTime}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    if (segmentId !== null && search === '') {
      paramFilters += `&segmentId=${segmentId}`;
    }

    if (search !== '') {
      paramFilters += `&participantName=${search}`;
    }

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/customers?${paramFilters}`,
      method: 'POST',
      data,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchSegmentActivities(limit = 10, offset = 0, dates, segmentId = null) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = `limit=${limit}&offset=${offset}`;

    if (segmentId !== null) {
      paramFilters += `&segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/segment/activity?${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  }
}

export function fetchSegmentCustomers(segmentId) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    const paramFilters = `segmentId=${segmentId}`;

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/participants?${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchSegmentDetails(segmentId) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      method: 'GET',
      url: `${config.api.url}/analytics/accounts/segments/${segmentId}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchCustomerDetails(customerId) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      method: 'GET',
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/customers/${customerId}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function createSegment(segment) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      method: 'POST',
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/segments`,
      data: segment,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function updateSegment(segmentId, data) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      method: 'PUT',
      url: `${config.api.url}/analytics/accounts/segments/${segmentId}`,
      data,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function toggleSegmentStatus(segmentId, status) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    let paramFilters = '';

    paramFilters += `toggleStatus=${status}`;

    return axios({
      method: 'PUT',
      url: `${config.api.url}/analytics/accounts/segments/${segmentId}/toggle?${paramFilters}`,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchSegments(limit = 15, offset = 0) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/segments?limit=${limit}&offset=${offset}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchSpendOverview(dates, interval, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams).concat(`interval=${interval}&`);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/spend/overview?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchSpendSummary(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);


    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/spend/summary?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchSpendLocations(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);


    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/spend/locations?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchBehaviourOverview(dates, interval, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams).concat(`interval=${interval}&`);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/behaviour/overview?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchBehaviourSummary(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/behaviour/summary?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchBehaviourLocations(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/behaviour/locations?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchBehaviourCustomerSpotlight(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/behaviour/participant?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchBehaviourSegments(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);


    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/behaviour/segments?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchDemographics(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId != null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/demographics?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchFilters() {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/filters`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function sendBulkSMS({ message, participantIds }) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      method: 'POST',
      url: `${config.api.url}/convo/sendmessage`,
      data: {
        chatType: 'CONVO',
        from: user.id,
        to: participantIds,
        message,
      },
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchThemes(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/themes?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchNPSTrend(dates, interval, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams).concat(`interval=${interval}&`);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/npsTrend?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
      data,
    });
  };
}

export function fetchMentions(dates, interval, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams).concat(`interval=${interval}&`);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/loyalty/mentions?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchImpact(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/loyalty/impact?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchKeyDriverAnalysis(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/loyalty/key-driver-analysis?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchRewardsAndPenalties(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/loyalty/rewards-and-penalties?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchNpsLocations(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);


    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/loyalty/locations?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchNpsSegments(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);


    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/loyalty/segments?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchCustomerSpend(participantId, dates) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/spend/participants/${participantId}/trend?${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchSpendCustomerSpotlight(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/spend/participant?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchSpendSegments(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);


    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/spend/segments?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchCustomerNpsTrend(participantId, dates) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/participants/${participantId}/npsTrend?${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchNPSSummary(dates, segmentId = null, data = []) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/nps/summary?${paramFilters}`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function sendSurveyToSegment(segmentId, data = {}) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      url: `${config.api.url}/analytics/accounts/segments/${segmentId}/campaign`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchCustomerTransactions(customerId, dates = {}, filters = {}) {

  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let locationFilters = '';
    let paramFilters = '';

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });

    paramFilters = paramFilters.concat(dateFiltersPrams);

    Object.keys(filters).forEach((key) => {
      locationFilters += filters[key] ? `${key}=${filters[key]}&` : '';
    });

    paramFilters = paramFilters.concat(locationFilters);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/customers/${customerId}/transactions?${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function searchSegments(name) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;
    let paramFilters = `name=${name}`;

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/analytics/accounts/${user['x-account-id']}/segments/search?${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function sendCampaignToParticipants(data = {}) {
  return async (dispatch, getState) => {
    const { user } = getState().authentication;

    return axios({
      url: `${config.api.url}/analytics/accounts/participants/campaign`,
      method: 'POST',
      withCredentials: false,
      data,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function downloadCustomers(data = {}, dates = {}, segmentId = null) {
  return (dispatch, getState) => {
    const { user } = getState().authentication;
    let dateFiltersPrams = '';
    let paramFilters = '';

    if (segmentId !== null) {
      paramFilters += `&segmentId=${segmentId}&`;
    }

    Object.keys(dates).forEach((key) => {
      dateFiltersPrams += dates[key] ? `${key}=${dates[key]}&` : '';
    });
    
    paramFilters = paramFilters.concat(dateFiltersPrams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      method: 'POST',
      url: `${config.api.url}/analytics/accounts/download?${paramFilters}`,
      data,
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}
