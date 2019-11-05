/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

const TrendItem = props => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      backgroundColor: '#f9fafc',
      borderTop: 'solid 1px #d9d9d9',
      color: '#3d4553',
      ':hover': {
        backgroundColor: '#6d6e71',
        color: '#d9d9d9',
      },
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ height: 10, width: 10, backgroundColor: props.color, margin: 5 }} />
      <span>{props.label}</span>
    </div>
    <div style={{ marginRight: 10 }}>{props.value}</div>
  </div>
);

TrendItem.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default Radium(TrendItem);
