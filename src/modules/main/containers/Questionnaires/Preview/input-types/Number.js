/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import styles from './Number.css';

const TextWrapper = styled(TextField)`${styles}`;

const NumberInput = ({ tag, label, onChange, response, validationRules }) => {
  return (
    <TextWrapper
      name={tag}
      type="number"
      value={response}
      label={label}
      variant="outlined"
      onChange={event => onChange(tag, event.target.value)}
    />
  );
};

NumberInput.propTypes = {
  response: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validationRules: PropTypes.array.isRequired,
  tag: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default NumberInput;
