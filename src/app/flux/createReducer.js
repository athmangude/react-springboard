import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import itemsReducer from 'Flux/items/reducer';
import appReducer from 'Flux/app/reducer';

export default function createReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    app: appReducer,
    items: itemsReducer,
  });
}
