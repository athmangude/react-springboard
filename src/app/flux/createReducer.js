import { combineReducers } from 'redux';
import itemsReducer from './items/reducer';

export default function createReducer() {
  return combineReducers({
    items: itemsReducer,
  });
}
