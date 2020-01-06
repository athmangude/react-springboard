/* eslint-disable max-len */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withFormsy } from 'formsy-react';

import styles from './Text.css';

const TextWrapper = styled(TextField)`${styles}`;

const TextInput = ({ tag, label, onChange, response, setValue, getValue, getErrorMessage, isValid, isValidValue, isPristine }) => {
  function changeValue(event) {
    // if (isValidValue(event.target.value) || event.target.value === '') {
    onChange(tag, event.target.value);
    setValue(event.currentTarget.value);
    // }
  }

  return (
    <TextWrapper
      error={!isPristine() && !isValid()}
      name={tag}
      type="text"
      value={response || getValue()}
      label={label}
      variant="outlined"
      onChange={changeValue}
      helperText={isPristine() ? null : getErrorMessage()}
      formNoValidate
    />
  );
}

TextInput.propTypes = {
  response: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
  getErrorMessage: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  isValidValue: PropTypes.func.isRequired,
  isPristine: PropTypes.func.isRequired,
};

export default withFormsy(TextInput);
