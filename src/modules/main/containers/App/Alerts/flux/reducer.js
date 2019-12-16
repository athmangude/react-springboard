import * as AlertActionTypes from './constants';

const initialState = [];

const actionsMap = {
  [AlertActionTypes.ADD_ALERT](state, action) {
    return [...state, action.payload];
  },

  [AlertActionTypes.REMOVE_ALERT](state, action) {
    return state.filter((alert) => alert.id !== action.id);
  },
};

export default function alerts(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
