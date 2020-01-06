/* eslint-disable no-return-assign */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';

import styles from './Checkbox.css';

const RadioWrapper = styled(FormGroup)`${styles}`;

const CheckboxInput = ({ tag, label, onChange, response, validationRules, options }) => {
  let value;
  if (!response) {
    value = {};
    options.forEach(option => value[option.value] = false);
  } else {
    value = response;
  }

  return (
    <RadioWrapper
      name={tag}
      value={response}
      aria-label={label}
      onChange={(event) => {
        const currentValue = response || options.map(option => ({ [option.value]: false }));
        const nextValue = ({ ...currentValue, [tag]: event.target.checked });
        onChange(tag, nextValue);
      }}
    >
      {
        options.map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Checkbox color="primary" checked={value.value} />}
            label={option.label}
          />
        ))
      }
    </RadioWrapper>
  );
}

CheckboxInput.propTypes = {
  response: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  validationRules: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default CheckboxInput;
