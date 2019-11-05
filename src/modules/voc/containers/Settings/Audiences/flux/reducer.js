/* eslint-disable jsx-a11y/href-no-hash */
import * as AudienceActionTypes from './constants';

const initialState = {
  items: {
    panelsOwned: [],
    panelsSharedWithAccount: [],
  },
  totalCount: null,
  currentPage: null,
};

const actionsMap = {
  [AudienceActionTypes.SET_AUDIENCES](state, action) {
    return { ...state, items: action.audiences, currentPage: action.currentPage, totalCount: action.totalCount };
  },
  [AudienceActionTypes.REMOVE_AUDIENCE](state, action) {
    return { ...state, items: { ...state.items, panelsOwned: state.items.panelsOwned.filter((panel) => panel.panelId !== action.audience.panelId), panelsSharedWithAccount: state.items.panelsSharedWithAccount.filter((panel) => panel.panelId !== action.audience.panelId) } };
  },
  [AudienceActionTypes.REMOVE_AUDIENCES](state) {
    return { ...state, items: [], currentPage: null, totalCount: null };
  },
};

export default function audiences(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
