/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker } from '@material-ui/pickers';

import styles from './Text.css';

const TextWrapper = styled(TextField)`${styles}`;

const TextInput = ({ tag, label, onChange, answer, validationRules }) => {
  return (
    <KeyboardDatePicker
      name={tag}
      margin="normal"
      id="date-picker-dialog"
      variant="inline"
      label={label}
      format="dd/MM/yyyy"
      value={answer}
      onChange={event => onChange(tag, event.target.value)}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
    />
  );

  return (
    <TextWrapper
      name={tag}
      type="text"
      value={answer}
      label={label}
      variant="outlined"
      onChange={event => onChange(tag, event.target.value)}
    />
  );
}

TextInput.propTypes = {
  answer: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validationRules: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
};

export default TextInput;
