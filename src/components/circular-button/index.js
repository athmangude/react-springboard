import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import styles from './index.css';

const CircularButtonWrapper = styled.button`${styles}`;

const CircularButton = ({ color, backgroundColor, style, className, onClick, icon, type, size }) => {
  return (
    <CircularButtonWrapper
      color={color}
      backgroundColor={backgroundColor}
      style={{ ...style }}
      className={className}
      onClick={onClick}
      type={type ? type : 'button'}
      size={size}
    >
      <i className="material-icons">{icon}</i>
    </CircularButtonWrapper>
  );
}

CircularButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string, // enum("small", "medium", "large")
};

export default CircularButton;
