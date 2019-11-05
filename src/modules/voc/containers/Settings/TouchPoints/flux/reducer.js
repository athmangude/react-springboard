import * as TouchPointActionTypes from './constants';

const initialState = {
  items: [],
  totalCount: null,
  currentPage: null,
};

const actionsMap = {
  [TouchPointActionTypes.SET_TOUCH_POINTS](state, action) {
    return { ...state, items: action.touchpoints, currentPage: action.currentPage, totalCount: action.totalCount };
  },
};

export default function touchpoints(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
