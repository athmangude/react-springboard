/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import styles from './Body.css';

const BodyWrapper = styled(Typography)`${styles}`;

const Body = ({ message }) => (
  <BodyWrapper variant="body1">{message.text}</BodyWrapper>
);

Body.propTypes = {
  message: PropTypes.object.isRequired,
};

export default Body;
