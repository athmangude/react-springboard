import * as ItemActionTypes from './constants';

const initialState = [];

const actionsMap = {
  [ItemActionTypes.ADD_ITEMS](state, { payload }) {
    return {
      payload,
      ...state
    }
  },
  [ItemActionTypes.REMOVE_ITEMS]() {
    return []
  }
}

export default function items(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
