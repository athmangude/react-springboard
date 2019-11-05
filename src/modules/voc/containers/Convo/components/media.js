import { css } from 'styled-components';

const sizes = {
  xxl: 2560,
  giant: 1170,
  desktop: 992,
  tablet: 768,
  phone: 376,
};

const newAccumulator = [];

const media = Object.keys(sizes).reduce((accumulator, label) => {
  const emSize = sizes[label] / 16;
  newAccumulator[label] = (...args) => css`
    @media (max-width: ${emSize}em) {
      ${css(...args)}
    }
  `;
  return newAccumulator;
}, {});

export default media;
