/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';

import styles from './Text.css';

const SliderWrapper = styled(Slider)`${styles}`;

const SliderInput = ({ tag, label, onChange, answer, validationRules, min, max, step, marks }) => {
  return (
    <SliderWrapper
      name={tag}
      type="text"
      defaultValue={answer}
      label={label}
      marks
      min={min}
      max={max}
      step={step}
      valueLabelDisplay="auto"
      onChange={(event, nextValue) => onChange(tag, nextValue)}
      value={answer}
      track={false}
    />
  );
}

SliderInput.propTypes = {
  answer: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validationRules: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  marks: PropTypes.array,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
};

export default SliderInput;
