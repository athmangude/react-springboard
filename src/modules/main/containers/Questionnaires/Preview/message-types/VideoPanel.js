/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import styles from './VideoPanel.css';

const Videoapper = styled.div`${styles}`;

const VideoPanel = ({ name, url }) => (
  <Videoapper>
    <img src={url} alt={name} />
  </Videoapper>
);

VideoPanel.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default VideoPanel;
