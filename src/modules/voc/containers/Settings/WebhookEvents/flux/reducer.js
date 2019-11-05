import * as WebhookEventActionTypes from './constants';

const initialState = { accountHookViewList: [], surveyHookViewList: [] };

const actionsMap = {
  [WebhookEventActionTypes.SET_WEB_HOOK_EVENTS](state, action) {
    return action.webhookEvents;
  },
};

export default function webhookEvents(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
