/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import styles from './UnorderedList.css';

const UnorderedListWrapper = styled.ul`${styles}`;

const UnorderedList = ({ message }) => (
  <UnorderedListWrapper>
    {
      message.items.map(item => (
        <li>{item}</li>
      ))
    }
  </UnorderedListWrapper>
);

UnorderedList.propTypes = {
  message: PropTypes.object.isRequired,
};

export default UnorderedList;
