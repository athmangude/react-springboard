import axios from 'axios';

import config from 'Config';
import * as HomeActionTypes from './constants';

export function addFeedItems(feedItems) {
  return {
    type: HomeActionTypes.ADD_FEED_ITEMS,
    feedItems,
  };
}

export function addSocialItems(socialItems, offset) {
  return {
    type: HomeActionTypes.ADD_SOCIAL_ITEMS,
    socialItems,
    offset,
  };
}

export function removeFeedItems() {
  return {
    type: HomeActionTypes.REMOVE_FEED_ITEMS,
  };
}

export function addContacted(contacted) {
  return {
    type: HomeActionTypes.ADD_CONTACTED,
    contacted,
  };
}

export function addContactedForLast30Days(contacted) {
  return {
    type: HomeActionTypes.ADD_CONTACTED_LAST_30_DAYS,
    contacted,
  };
}

export function removeContacted() {
  return {
    type: HomeActionTypes.REMOVE_CONTACTED,
  };
}

export function setNPS(nps) {
  return {
    type: HomeActionTypes.SET_NPS,
    nps,
  };
}

export function addNPSCcomments(npsComments) {
  return {
    type: HomeActionTypes.ADD_NPS_COMMENTS,
    npsComments,
  };
}

export function removeNPSComments() {
  return {
    type: HomeActionTypes.REMOVE_NPS_COMMENTS,
  };
}

export function removeNPSComment(comment) {
  return {
    type: HomeActionTypes.REMOVE_NPS_COMMENT,
    comment,
  };
}

export function clearNPSCategoryComments(category) {
  return {
    type: HomeActionTypes.CLEAR_NPS_CATEGORY_COMMENTS,
    category,
  };
}

export function clearHomeFeed() {
  return {
    type: HomeActionTypes.CLEAR_HOME_FEED,
  };
}

export function clearFeed() {
  return {
    type: HomeActionTypes.CLEAR_FEED,
  };
}

export function setTrendingThemes(themes) {
  return {
    type: HomeActionTypes.SET_TRENDING_THEMES,
    themes,
  };
}

export function fetchHomeFeed(paginationFilters, npsFilters) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    let npsFiltersParams = '';
    let paginationFilterParams = '';

    Object.keys(paginationFilters).forEach((key) => {
      paginationFilterParams += `${key}=${paginationFilters[key]}&`;
    });

    Object.keys(npsFilters).forEach((key) => {
      npsFiltersParams += npsFilters[key] ? `${key}=${npsFilters[key]}&` : '';
    });

    let paramFilters = paginationFilterParams.concat(npsFiltersParams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/home?${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function submitNewCommentTag(tag, commentId) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    return axios({
      url: `${config.api.url}/home/nps-comments/tags`,
      method: 'POST',
      data: {
        tag,
        commentId,
      },
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function removeCommentTag(tag, commentId) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    return axios({
      url: `${config.api.url}/home/nps-comments/${commentId}/tags`,
      method: 'DELETE',
      data: {
        tag,
      },
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchTrendingThemes() {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    return axios({
      url: `${config.api.url}/home/nps-comments/trending-themes`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchNPSComments(options) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    // remove properties whose values are null

    Object.keys(options).forEach((option) => {
      if (options[option] === null) {
        delete options[option];
      }
    });

    const queryString = Object.keys(options).map((key) => `${key}=${encodeURIComponent(options[key])}`).join('&');
    return axios({
      url: `${config.api.url}/home/nps-comments?${queryString}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchActivityFeed(options) {
  return async (dispatch, getState) => {
    const user = getState().authentication.user;

    // remove null keys from options object
    Object.keys(options).forEach((option) => {
      if (options[option] === null) {
        delete options[option];
      }
    });

    const queryString = Object.keys(options).map((key) => `${key}=${encodeURIComponent(options[key])}`).join('&');
    return axios({
      url: `${config.api.url}/home/activity-feed?${queryString}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchNPS(dateFilters, npsFilters) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;

    let npsFiltersParams = '';
    let dateFiltersParams = '';

    Object.keys(dateFilters).forEach((key) => {
      dateFiltersParams += dateFilters[key] ? `${key}=${dateFilters[key]}&` : '';
    });

    Object.keys(npsFilters).forEach((key) => {
      npsFiltersParams += npsFilters[key] ? `${key}=${npsFilters[key]}&` : '';
    });

    let paramFilters = dateFiltersParams.concat(npsFiltersParams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);
    
    return axios({
      url: `${config.api.url}/accounts/nps?${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchContacted(dateFilters, npsFilters) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;

    let npsFiltersParams = '';
    let dateFiltersParams = '';

    Object.keys(dateFilters).forEach((key) => {
      dateFiltersParams += dateFilters[key] ? `${key}=${dateFilters[key]}&` : '';
    });

    Object.keys(npsFilters).forEach((key) => {
      npsFiltersParams += npsFilters[key] ? `${key}=${npsFilters[key]}&` : '';
    });

    let paramFilters = dateFiltersParams.concat(npsFiltersParams);

    // Remove the trailing &
    paramFilters = paramFilters.substring(0, paramFilters.length - 1);

    return axios({
      url: `${config.api.url}/home/contacted?${paramFilters}`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function addNotifications(notifications) {
  return {
    type: HomeActionTypes.ADD_NOTIFICATIONS,
    notifications,
  };
}

export function addNotification(notification) {
  return {
    type: HomeActionTypes.ADD_NOTIFICATION,
    notification,
  };
}

export function removeNotifications() {
  return {
    type: HomeActionTypes.REMOVE_NOTIFICATIONS,
  };
}

export function bookmarkNPSComments(commentsIds, bookmarkedValue) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;

    return axios({
      url: `${config.api.url}/home/nps-comments/edit-nps-comment-attributes?bookmarked=${bookmarkedValue ? 'true' : 'false'}`,
      method: 'POST',
      withCredentials: false,
      data: commentsIds,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function markNPSCommentsAsRead(commentsIds) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;

    return axios({
      url: `${config.api.url}/home/nps-comments/edit-nps-comment-attributes?read=true`,
      method: 'POST',
      withCredentials: false,
      data: commentsIds,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function replyToComment(commentId, comment) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    return axios({
      url: `${config.api.url}/surveys/${commentId}/respond-to-survey-response`,
      method: 'POST',
      withCredentials: false,
      data: comment,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function commentOnChart(chartId, comment) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    return axios({
      url: `${config.api.url}/surveys/${chartId}/comments`,
      method: 'POST',
      withCredentials: false,
      data: comment,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchSurveyResponseComments(surveyResponseId) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    return axios({
      url: `${config.api.url}/surveys/survey-responses/${surveyResponseId}/responses`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchSurveyQuestionComments(questionId) {
  return (dispatch, getState) => {
    const user = getState().authentication.user;
    return axios({
      url: `${config.api.url}/surveys/${questionId}/comments`,
      method: 'GET',
      withCredentials: false,
      headers: {
        'x-account-id': user['x-account-id'],
        authorization: `Bearer ${user.token}`,
      },
    });
  };
}

export function fetchSocialFeed() {
  return () => {
    return axios({
      url: `https://api.airtable.com/v0/appYMO7i1H7ucDJmp/Entries`,
      method: 'GET',
      headers: {
        Authorization: `Bearer key2Vtsv9YPvoHZ3t`,
      },
    })
  }
}
