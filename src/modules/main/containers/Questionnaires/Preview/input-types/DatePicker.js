/* eslint-disable max-len */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { withFormsy } from 'formsy-react';

import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import { format } from 'date-fns';

import styles from './Text.css';

const DatePickerWrapper = styled(FormControl)`${styles}`;

const DatePicker = ({ tag, label, onChange, response, setValue, getValue, getErrorMessage, isValid, isValidValue, isPristine }) => {
  function changeValue(date) {
    // if (isValidValue(event.target.value) || event.target.value === '') {
    onChange(tag, date ? format(date, 'dd/MM/yyyy') : date);
    setValue(date ? format(date, 'dd/MM/yyyy') : date);
    // }
  }

  return (
    <DatePickerWrapper
      error={!isPristine() && !isValid()}
    >
      <FormLabel component="legend">{label}</FormLabel>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          error={!isPristine() && !isValid()}
          name={tag}
          margin="normal"
          id="date-picker-dialog"
          variant="inline"
          label={label}
          format="dd/MM/yyyy"
          value={response}
          inputVariant="outlined"
          onChange={changeValue}
          KeyboardButtonProps={{
            'aria-label': 'Pick a date',
          }}
          emptyLabel="Pick a date"
          autoOk
          disableFuture
        />
      </MuiPickersUtilsProvider>
      {
        !isPristine() && !isValid() ? (
          <FormHelperText
            error={!isPristine() && !isValid()}
          >
            {isPristine() ? null : getErrorMessage()}
          </FormHelperText>
        ) : null
      }
    </DatePickerWrapper>
  );
};

DatePicker.propTypes = {
  response: PropTypes.string,
  tag: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  getValue: PropTypes.func.isRequired,
  getErrorMessage: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  isValidValue: PropTypes.func.isRequired,
  isPristine: PropTypes.func.isRequired,
};

export default withFormsy(DatePicker);

// https://material-ui-pickers.dev/api/DatePicker
