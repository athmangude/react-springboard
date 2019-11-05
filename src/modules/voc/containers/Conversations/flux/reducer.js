import * as ConversationActionTypes from './constants';

const initialState = {
  active: {
    items: [],
    page: null,
    totalCount: null,
  },
  draft: {
    items: [],
    page: null,
    totalCount: null,
  },
  inactive: {
    items: [],
    page: null,
    totalCount: null,
  },
};

const actionsMap = {
  [ConversationActionTypes.SET_CONVERSATIONS](state, action) {
    return {
      ...state, [action.conversationType]: action.conversations,
    };
  },
  [ConversationActionTypes.REMOVE_CONVERSATIONS](state) {
    return {
      ...state,
      active: { items: null, page: null, totalCount: null },
      draft: { items: null, page: null, totalCount: null },
      inactive: { items: null, page: null, totalCount: null },
    };
  },
  [ConversationActionTypes.REMOVE_CONVERSATION](state, action) {
    return {
      ...state,
      [action.listType]: {
        items: state[action.listType].items.filter((item) => item.id !== action.conversationId),
        totalCount: state[action.listType].totalCount - 1,
      },
    };
  },
};

export default function conversations(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
