import * as PaymentTypeActionTypes from './constants';

const initialState = [];

const actionsMap = {
  [PaymentTypeActionTypes.SET_PAYMENT_TYPES](state, action) {
    return action.paymentTypes;
  },
};

export default function paymentTypes(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
