/* eslint-disable jsx-a11y/interactive-supports-focus */

import React from 'react';
import PropTypes from 'prop-types';
import './DimensionOption.css';

const DimensionOption = (props) => (
  <div role="button" onClick={() => props.onSelect(props.value)} className="dimension-option" style={{ width: '100%', padding: '3px 7px', fontSize: 11 }}>
    <span style={{ textTransform: 'capitalize', ...props.selectedOption === props.value ? { fontWeight: 'bold' } : {} }}>{props.option}</span>
  </div>
);

DimensionOption.propTypes = {
  option: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  selectedOption: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default DimensionOption;
