import * as PaymentActionTypes from './constants';

const initialState = [];

const actionsMap = {
  [PaymentActionTypes.SET_PAYMENTS](state, action) {
    return [...state, ...action.payments];
  },
};

export default function payments(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
