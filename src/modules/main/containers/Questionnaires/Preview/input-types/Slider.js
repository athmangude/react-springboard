/* eslint-disable max-len */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { withFormsy } from 'formsy-react';

import Slider from '@material-ui/core/Slider';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import styles from './Text.css';

const SliderWrapper = styled(FormControl)`${styles}`;

const SliderInput = ({ tag, label, onChange, defaultValue, response, validationRules, min, max, step, marks, setValue, getValue, getErrorMessage, isValid, isValidValue, isPristine }) => {
  function changeValue(event, nextValue) {
    // if (isValidValue(event.target.value) || event.target.value === '') {
    onChange(tag, nextValue);
    setValue(nextValue);
    // }
  }

  return (
    <SliderWrapper
      error={!isPristine() && !isValid()}
    >
      <FormLabel component="legend">{label}</FormLabel>
      <Slider
        name={tag}
        type="text"
        defaultValue={response || defaultValue}
        label={label}
        marks
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        onChange={changeValue}
        value={response}
        track={false}
      />
      {
        !isPristine() && !isValid() ? (
          <FormHelperText
            error={!isPristine() && !isValid()}
          >
            {isPristine() ? null : getErrorMessage()}
          </FormHelperText>
        ) : null
      }
    </SliderWrapper>
  );
};

SliderInput.propTypes = {
  response: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validationRules: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  marks: PropTypes.array,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  defaultValue: PropTypes.number.isRequired,
  tag: PropTypes.string.isRequired,
  getValue: PropTypes.func.isRequired,
  getErrorMessage: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  isValidValue: PropTypes.func.isRequired,
  isPristine: PropTypes.func.isRequired,
};

export default withFormsy(SliderInput);
