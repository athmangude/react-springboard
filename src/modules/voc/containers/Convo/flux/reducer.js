import * as ConversationActionTypes from './constants';

const initialState = {
  conversations: [],
};

const actionsMap = {
  [ConversationActionTypes.SET_CONVERSATIONS](state, action) {
    return {
      ...state, ...action.conversations,
    };
  },

  [ConversationActionTypes.ADD_NEW_CONVERSATION](state, action) {
    const existingConversations = state.conversations || [];
    existingConversations.splice(0, 0, action.conversation.conversation);
    return {
      ...state, conversations: existingConversations,
    };
  },

  [ConversationActionTypes.SET_MORE_CONVERSATIONS](state, action) {
    const updatedConversationsList = state.conversations.concat(action.conversations.conversations);
    return {
      ...state, conversations: updatedConversationsList,
    };
  },

  [ConversationActionTypes.RESET_UNREAD_MESSAGES_COUNT](state, action) {
    const conversation = state.conversations[action.conversationIdx.conversationIdx];
    conversation.unreadMessagesCount = 0;
    const newState = {
      ...state, ...conversations,
    };

    return newState;
  },

  [ConversationActionTypes.UNMOUNT_CONVERSATIONS]() {
    return {};
  },
};

export default function conversations(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
