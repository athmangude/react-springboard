/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import styles from './Text.css';

const KeyboardDatePickerWrapper = styled(KeyboardDatePicker)`${styles}`;

const DatePicker = ({ tag, label, onChange, answer, validationRules }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePickerWrapper
        name={tag}
        margin="normal"
        id="date-picker-dialog"
        variant="inline"
        label={label}
        format="dd/MM/yyyy"
        value={answer}
        onChange={date => onChange(tag, date)}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

DatePicker.propTypes = {
  answer: PropTypes.string,
  tag: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  validationRules: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
};

export default DatePicker;
