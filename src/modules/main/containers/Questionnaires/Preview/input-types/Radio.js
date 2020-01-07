/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withFormsy } from 'formsy-react';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import styles from './Radio.css';

const RadioWrapper = styled(FormControl)`${styles}`;

const RadioInput = ({ tag, label, onChange, response, options, setValue, getValue, getErrorMessage, isValid, isValidValue, isPristine }) => {
  function changeValue(event) {
    // if (isValidValue(event.target.value) || event.target.value === '') {
    onChange(tag, event.target.value);
    setValue(event.target.value);
    // }
  }

  return (
    <RadioWrapper
      error={!isPristine() && !isValid()}
    >
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        name={tag}
        value={response}
        aria-label={label}
        onChange={changeValue}
      >
        {
          options.map(option => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio color="primary" />}
              label={option.label}
            />
          ))
        }
      </RadioGroup>
      {
        !isPristine() && !isValid() ? (
          <FormHelperText
            error={!isPristine() && !isValid()}
          >
            {isPristine() ? null : getErrorMessage()}
          </FormHelperText>
        ) : null
      }
    </RadioWrapper>
  );
};

RadioInput.propTypes = {
  response: PropTypes.string,
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

export default withFormsy(RadioInput);
