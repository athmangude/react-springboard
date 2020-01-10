/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import styles from './ImagePanel.css';

const ImagePanelWrapper = styled.div`${styles}`;

const ImagePanel = ({ name, url }) => (
  <ImagePanelWrapper>
    <img src={url} alt={name} />
  </ImagePanelWrapper>
);

ImagePanel.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default ImagePanel;
