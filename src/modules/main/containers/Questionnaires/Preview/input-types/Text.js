/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import styles from './Text.css';

const TextWrapper = styled(TextField)`${styles}`;

const TextInput = ({ tag, label, onChange, response, validationRules }) => {
  return (
    <TextWrapper
      name={tag}
      type="text"
      value={response}
      label={label}
      variant="outlined"
      onChange={event => onChange(tag, event.target.value)}
    />
  );
}

TextInput.propTypes = {
  response: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validationRules: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
};

export default TextInput;
