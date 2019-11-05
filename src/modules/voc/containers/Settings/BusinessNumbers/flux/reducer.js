import * as BusinessNumberActionTypes from './constants';

const initialState = {
  items: [],
  totalCount: null,
  currentPage: null,
};

const actionsMap = {
  [BusinessNumberActionTypes.SET_BUSINESS_NUMBERS](state, action) {
    return { ...state, items: action.businessNumbers, currentPage: action.currentPage, totalCount: action.totalCount };
  },
};

export default function businessNumbers(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
