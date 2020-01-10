import * as ItemActionTypes from './constants';

export function addItems(items) {
  return {
    type: ItemActionTypes.ADD_ITEMS,
    payload: items,
  }
}

export function removeItems removeItems() {
  return {
    type: ItemActionTypes.REMOVE_ITEMS,
  }
}
