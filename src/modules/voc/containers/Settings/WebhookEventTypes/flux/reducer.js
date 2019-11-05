import * as WebhookEventTypeActionTypes from './constants';

const initialState = [];

const actionsMap = {
  [WebhookEventTypeActionTypes.SET_WEB_HOOK_EVENT_TYPES](state, action) {
    return action.webhookEventTypes;
  },
};

export default function webhookEventTypes(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
