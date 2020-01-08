/* eslint-disable no-return-assign */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withFormsy } from 'formsy-react';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';

import styles from './Checkbox.css';

const CheckboxWrapper = styled(FormControl)`${styles}`;

const CheckboxInput = ({ tag, label, onChange, response, options, setValue, getValue, getErrorMessage, isValid, isValidValue, isPristine }) => {
  function changeValue(event) {
    let currentValue;

    if (response) {
      currentValue = response;
    } else {
      currentValue = {};
      options.forEach(option => currentValue[option.value] = false);
    }
    const nextValue = ({ ...currentValue, [event.target.name]: event.target.checked });

    // if (isValidValue(event.target.value) || event.target.value === '') {
    onChange(tag, nextValue);
    setValue(nextValue);
    // }
  }

  let value;
  if (!response) {
    value = {};
    options.forEach(option => value[option.value] = false);
  } else {
    value = response;
  }

  return (
    <CheckboxWrapper
      error={!isPristine() && !isValid()}
    >
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup
        name={tag}
        value={response}
        aria-label={label}
        onChange={changeValue}
      >
        {
          options.map(option => (
            <FormControlLabel
              name={option.value}
              key={option.value}
              value={option.value}
              control={<Checkbox color="primary" checked={value.value} />}
              label={option.label}
            />
          ))
        }
      </FormGroup>
      {
        !isPristine() && !isValid() ? (
          <FormHelperText
            error={!isPristine() && !isValid()}
          >
            {isPristine() ? null : getErrorMessage()}
          </FormHelperText>
        ) : null
      }
    </CheckboxWrapper>
  );
}

CheckboxInput.propTypes = {
  response: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  getValue: PropTypes.func.isRequired,
  getErrorMessage: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  isValidValue: PropTypes.func.isRequired,
  isPristine: PropTypes.func.isRequired,
  tag: PropTypes.string.isRequired,
};

export default withFormsy(CheckboxInput);
