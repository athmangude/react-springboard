import * as AODReportActionTypes from './constants';

const initialState = {};

const actionsMap = {
  [AODReportActionTypes.SET_AOD_DATA](state, action) {
    const survey = state[action.id];
    if (survey) {
      const { responseStats, npsMetaDataFilters } = survey;
      const updatedSurvey = action.data;
      updatedSurvey.responseStats = responseStats;
      updatedSurvey.npsMetaDataFilters = npsMetaDataFilters;
      const newState = {
        ...state, [action.id]: updatedSurvey,
      };
      return newState;
    }

    return {
      ...state, [action.id]: action.data,
    };
  },

  [AODReportActionTypes.SET_SURVEY_DATA_TABLE](state, action) {
    const survey = state[action.id];
    if (survey) {
      survey.datatable = action.data.datatable;
      const newState = {
        ...state, [action.id]: survey,
      };
      return newState;
    }

    return {
      ...state, [action.id]: { datatable: action.data.datatable },
    };
  },

  [AODReportActionTypes.SET_SURVEY_QUESTIONS](state, action) {

    const survey = state[action.id];
    if (survey) {
      survey.responseStats = action.responseStats;
      const newState = {
        ...state, [action.id]: survey,
      };
      return newState;
    }

    return {
      ...state, [action.id]: { responseStats: action.responseStats },
    };
  },

  [AODReportActionTypes.CLEAR_AOD_REPORTS](state, action) {
    return {};
  },
};

export default function aodReport(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
