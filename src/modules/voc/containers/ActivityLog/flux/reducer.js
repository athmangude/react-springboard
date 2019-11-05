import * as ActivityLogsActionTypes from './constants';

const initialState = {
  items: [],
};

const actionsMap = {
  [ActivityLogsActionTypes.ADD_ACTIVITY_LOGS](state, action) {
    return { ...state, items: [...state.items, ...action.items] };
  },
};

export default function activityLog(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) {
    return state;
  }
  return reduceFn(state, action);
}
