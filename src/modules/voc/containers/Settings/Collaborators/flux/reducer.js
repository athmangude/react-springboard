import * as CollaboratorActionTypes from './constants';

const initialState = [];

const actionsMap = {
  [CollaboratorActionTypes.ADD_COLLABORATORS](state, action) {
    return [...state, ...action.collaborators];
  },
  [CollaboratorActionTypes.UPDATE_COLLABORATOR](state, action) {
    return state.map((collaborator) => {
      if (collaborator.id === action.collaborator.id) {
        return action.collaborator;
      }
      return collaborator;
    });
  },
  [CollaboratorActionTypes.REMOVE_COLLABORATOR](state, action) {
    return state.map((collaborator) => {
      if (collaborator.id === action.collaborator.id) {
        return action.collaborator;
      }
      return collaborator;
    });
  },
  [CollaboratorActionTypes.REMOVE_COLLABORATORS]() {
    return [];
  },
};

export default function collaborators(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
