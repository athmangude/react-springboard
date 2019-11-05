import * as DNDListActionTypes from './constants';

const initialState = {
  items: [],
  totalCount: null,
  currentPage: null,
};

const actionsMap = {
  [DNDListActionTypes.SET_DND_LISTS](state, action) {
    return { ...state, items: action.dndlists, currentPage: action.currentPage, totalCount: action.totalCount };
  },
};

export default function dndlists(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
