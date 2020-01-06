/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withFormsy } from 'formsy-react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import styles from './Radio.css';

const RadioWrapper = styled(RadioGroup)`${styles}`;

const RadioInput = ({ tag, label, onChange, response, validationRules, options }) => {
  return (
    <RadioWrapper
      name={tag}
      value={response}
      aria-label={label}
      onChange={event => onChange(tag, event.target.value)}
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
    </RadioWrapper>
  );
}

RadioInput.propTypes = {
  response: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validationRules: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default withFormsy(RadioInput);
