/* eslint-disable no-bitwise, no-plusplus */

import Color from 'color';

export function extractInitials(string) {
  return string.split(' ').map((segment) => `${segment[0]}`).join('').toUpperCase().replace(/[^a-z0-9+]+/gi, '').slice(0, 2);
}

export function stringToHexColor(string) {
  const backgroundColor = `#${intToRGB(hashCode(string))}`;
  const color = Color(backgroundColor);

  return {
    backgroundColor,
    color: color.isLight() ? '#030a16' : '#fff',
  };
}

function hashCode(str) { // java String#hashCode
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i) {
  const c = (i & 0x00FFFFFF).toString(16).toUpperCase();
  return '00000'.substring(0, 6 - c.length) + c;
}

export function camelCaseToSentenseCase(str) {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}
