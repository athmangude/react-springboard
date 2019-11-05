import * as CustomerAnalyticsActionTypes from './constants';

const initialState = {
  segments: {
    items: [],
  },
  filters: [],
  appliedFilters: {
    analyticsMetadataView: [],
  },
};

const actionsMap = {
  [CustomerAnalyticsActionTypes.SET_SEGMENTS](state, action) {
    return { ...state, segments: action.segments };
  },
  [CustomerAnalyticsActionTypes.SET_FILTERS](state, action) {
    return { ...state, filters: action.filters };
  },
  [CustomerAnalyticsActionTypes.SET_APPLIED_FILTERS](state, action) {
    return { ...state, appliedFilters: action.appliedFilters };
  },
  [CustomerAnalyticsActionTypes.CLEAR_APPLIED_FILTERS](state) {
    return { ...state, appliedFilters: [] };
  },
};

export default function customers(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
