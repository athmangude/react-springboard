import * as AccountsActionTypes from './constants';

const initialState = {
  items: [],
  page: null,
  totalCount: null,
  perPage: 30,
  industries: null,
};

const actionsMap = {
  [AccountsActionTypes.ADD_ACCOUNTS](state, action) {
    return {
      ...state, ...action.accounts,
    };
  },
  [AccountsActionTypes.REMOVE_ACCOUNTS](state) {
    return {
      ...state, items: null, page: null, totalCount: null,
    };
  },
  [AccountsActionTypes.SET_INDUSTRIES](state, action) {
    return {
      ...state, industries: action.industries,
    };
  },
};

export default function accounts(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
