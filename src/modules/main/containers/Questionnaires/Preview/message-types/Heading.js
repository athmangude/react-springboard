/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import styles from './Heading.css';

const HeadingWrapper = styled(Typography)`${styles}`;

const Heading = ({ message }) => (
  <HeadingWrapper variant="h5">{message.text}</HeadingWrapper>
);

Heading.propTypes = {
  message: PropTypes.object.isRequired,
};

export default Heading;
