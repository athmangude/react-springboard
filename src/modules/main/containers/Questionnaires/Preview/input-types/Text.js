/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import styles from './Text.css';

const TextWrapper = styled(TextField)`${styles}`;

const TextInput = ({ tag, label, onChange, answer, validationRules }) => {
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
  answer: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  validationRules: PropTypes.object.isRequired,
  tag: PropTypes.string.isRequired,
};

export default TextInput;
