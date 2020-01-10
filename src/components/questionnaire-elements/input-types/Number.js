/* eslint-disable max-len */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withFormsy } from 'formsy-react';

import styles from './Number.css';

const TextWrapper = styled(TextField)`${styles}`;

const NumberInput = ({ tag, label, onChange, response, setValue, getValue, getErrorMessage, isValid, isValidValue, isPristine }) => {
  function changeValue(event) {
    // if (isValidValue(event.target.value) || event.target.value === '') {
    onChange(tag, event.target.value);
    setValue(event.target.value);
  }
  // }

  return (
    <TextWrapper
      error={!isPristine && !isValid()}
      name={tag}
      type="number"
      value={response || getValue()}
      label={label}
      variant="outlined"
      onChange={changeValue}
      helperText={isPristine() ? null : getErrorMessage()}
      formNoValidate
    />
  );
};

NumberInput.propTypes = {
  response: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  tag: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
  getErrorMessage: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  isValidValue: PropTypes.func.isRequired,
};

export default withFormsy(NumberInput);