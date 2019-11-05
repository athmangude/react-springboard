import * as CSReportActionTypes from './constants';

const initialState = {};

const actionsMap = {
  [CSReportActionTypes.SET_AOD_DATA](state, action) {
    const survey = state[action.id];
    if (survey) {
      const { responseStats, npsMetaDataFilters } = survey;
      const updatedSurvey = action.data;
      updatedSurvey.responseStats = responseStats;
      updatedSurvey.npsMetaDataFilters = npsMetaDataFilters;
    }

    return {
      ...state, [action.id]: action.data,
    };
  },

  [CSReportActionTypes.SET_SURVEY_DATA_TABLE](state, action) {
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

  [CSReportActionTypes.SET_NPS_METADATA_FILTERS](state, action) {
    const survey = state[action.id];
    if (survey) {
      survey.npsMetaDataFilters = action.npsMetaDataFilters;
      const newState = {
        ...state, [action.id]: survey,
      };
      return newState;
    }

    return {
      ...state, [action.id]: { npsMetaDataFilters: action.npsMetaDataFilters },
    };
  },

  [CSReportActionTypes.SET_SURVEY_QUESTIONS](state, action) {

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

  [CSReportActionTypes.CLEAR_CS_REPORTS]() {
    return {};
  },
};

export default function aodReport(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
