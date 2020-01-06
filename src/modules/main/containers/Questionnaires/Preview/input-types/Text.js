/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withFormsy } from 'formsy-react';

import styles from './Text.css';

const TextWrapper = styled(TextField)`${styles}`;

const TextInput = ({ tag, label, onChange, response, validationRules, setValue, getValue, getErrorMessage, isValid ...rest }) => {
  function changeValue(event) {
    onChange(tag, event.target.value);
    setValue(event.currentTarget.value);
  }

  console.log('[rest]', rest);

  return (
    <TextWrapper
      error={isValid()}
      name={tag}
      type="text"
      value={getValue() || response}
      label={label}
      variant="outlined"
      onChange={changeValue}
      helperText={getErrorMessage()}
    />
  );
}

TextInput.propTypes = {
  response: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validationRules: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
};

export default withFormsy(TextInput);
