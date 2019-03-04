import * as ItemActionTypes from './constants';

export function addItems(items) {
  return {
    action: ItemActionTypes.ADD_ITEMS,
    payload: items,
  }
}

export function removeItems removeItems() {
  return {
    action: ItemActionTypes.REMOVE_ITEMS,
  }
}
